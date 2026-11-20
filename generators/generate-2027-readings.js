const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const axios = require('axios');
const cheerio = require('cheerio');

const calendarDir = path.join(__dirname, '..', 'liturgical-calendar', '2027');
const outputDir = path.join(__dirname, '..', 'readings', '2027');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function extractCleanBlockText($, el) {
    const rawHtml = ($(el).html() ?? "").replace(/<br\s*\/?>/gi, "\n");
    return cheerio
        .load(rawHtml)
        .text()
        .split("\n")
        .map((line) => line.replace(/[ \t\u00a0]+/g, " ").trim())
        .filter(Boolean)
        .join("\n")
        .trim();
}

function parsePage(html) {
    const $ = cheerio.load(html);
    const readings = {};
    let hasReadings = false;

    $('h3, h4').each((i, el) => {
        const heading = $(el);
        const title = heading.text().replace(/\s+/g, " ").trim().toLowerCase();
        let citation = "";

        const addressDiv = heading.nextAll("div.address").first();
        if (addressDiv.length && addressDiv.prevAll("h3, h4").first().is(el)) {
            citation = addressDiv.text().replace(/\s+/g, " ").trim();
        }

        if (!citation) {
            const nextLink = heading.find('a').first().length
                ? heading.find('a').first()
                : heading.nextAll('a').filter((_, aEl) => $(aEl).prevAll('h3, h4').first().is(el)).first();
            if (nextLink.length) {
                const linkText = nextLink.text().replace(/\s+/g, " ").trim();
                if (!/^see\s+/i.test(linkText)) {
                    citation = linkText;
                }
            }
        }

        // Capture the body text for the Alleluia / Verse Before the Gospel
        const isAcclamation = /\balleluia\b|\bverse before\b/i.test(title);
        if (isAcclamation) {
            readings.gospelAcclamation = citation || "";

            const bodyParts = [];
            let curr = heading.next();
            while (curr.length) {
                if (curr.is("header.content-header, h3, h4") || curr.find("h3, h4").length > 0) {
                    break;
                }
                if (curr.is("div.content-body, div.poetry, p")) {
                    const cleanText = extractCleanBlockText($, curr);
                    if (cleanText.length > 0) {
                        bodyParts.push(cleanText);
                    }
                } else if (curr.is("div")) { // Sometimes there's an extra 'div' element on some Daily Reading Entries
                    curr.find("p, div.content-body, div.poetry").each((_, child) => {
                        const cleanText = extractCleanBlockText($, child);
                        if (cleanText.length > 0) {
                            bodyParts.push(cleanText);
                        }
                    });
                }
                curr = curr.next();
            }

            const gospelAcclamationBodyText = bodyParts.join("\n\n").trim();
            if (gospelAcclamationBodyText.length > 0) {
                readings.gospelAcclamationText = gospelAcclamationBodyText;
            }

            hasReadings = true;
        } else if (citation) {
            // USCCB weekday memorials often use a bare "Reading" heading (no 1/I).
            if ((/^reading$/.test(title) || /reading\s+(i|1)\b/.test(title)) && !/(ii|2)/.test(title)) {
                readings.firstReading = citation;
                hasReadings = true;
            } else if (/reading\s+(ii|2)\b/.test(title)) {
                readings.secondReading = citation;
                hasReadings = true;
            } else if (/psalm/.test(title)) {
                readings.psalm = citation;
                hasReadings = true;
            } else if (/gospel/.test(title)) {
                readings.gospel = citation;
                hasReadings = true;
            }
        }
    });

    return { readings, hasReadings };
}

async function fetchWithRetry(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; CatholicReadingsAPI/1.0; +https://github.com/cpbjr/catholic-readings-api)'
            },
            timeout: 10000
        });
        return response;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
}

async function scrapeReadings() {
    console.log('Starting final 2027 readings scraper...');
    const files = fs.readdirSync(calendarDir).sort();

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = path.join(calendarDir, file);
        const calendarData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const date = calendarData.date;
        const [year, month, day] = date.split('-');
        const usccbDate = `${month}${day}${year.slice(-2)}`;
        const usccbUrl = `https://bible.usccb.org/bible/readings/${usccbDate}.cfm`;

        const outputPath = path.join(outputDir, file);

        // Check if we need to (re)scrape
        if (fs.existsSync(outputPath)) {
            const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
            if (existing.readings && existing.readings.firstReading && existing.readings.gospelAcclamation !== undefined && existing.readings.gospelAcclamationText && existing.readings.gospel) {
                continue;
            }
            console.log(`Re-scraping ${file} (missing data)...`);
        } else {
            console.log(`Fetching readings for ${date}...`);
        }

        try {
            let response = await fetchWithRetry(usccbUrl);
            const readingsFallbacks = {};

            // Extensionless fallback when URL with ".cfm" suffix returns 404
            if (!response) {
                const extensionlessUrl = usccbUrl.replace(/\.cfm$/i, "");
                response = await fetchWithRetry(extensionlessUrl);
            }

            if (!response) {
                if (readingsFallbacks[usccbDate]) {
                    console.log(`Using hardcoded fallback for ${date}`);
                    const readingData = {
                        date: calendarData.date,
                        monthDay: calendarData.monthDay,
                        season: calendarData.season,
                        readings: readingsFallbacks[usccbDate],
                        usccbLink: usccbUrl,
                        apiEndpoint: `https://cpbjr.github.io/catholic-readings-api/readings/2027/${file}`
                    };
                    fs.writeFileSync(outputPath, JSON.stringify(readingData, null, 2));
                    continue;
                }
                console.error(`404 for ${usccbUrl}`);
                continue;
            }

            let { readings, hasReadings } = parsePage(response.data);

            // Landing pages (Assumption, Christmas, etc.) or a partial parse
            // (first reading heading not matched) need the Day/Vigil subpage.
            if (!hasReadings || !readings.firstReading) {
                const $ = cheerio.load(response.data);
                const dayMassLink = $('a').filter((i, el) => {
                    const txt = $(el).text().toLowerCase();
                    const href = ($(el).attr('href') || '').toLowerCase();
                    return txt.includes('mass during the day') ||
                        txt.includes('mass at the day') ||
                        txt === 'day' ||
                        href.includes('-day') ||
                        txt.includes('thanksgiving day') ||
                        txt.includes('thanksgiving') ||
                        txt.includes("lord's supper") ||
                        txt.includes('ascension');
                }).first().attr('href');

                if (dayMassLink) {
                    const nextUrl = dayMassLink.startsWith('http') ? dayMassLink : `https://bible.usccb.org${dayMassLink}`;
                    console.log(`Following sub-link for ${date}: ${nextUrl}`);
                    response = await fetchWithRetry(nextUrl);
                    if (response) {
                        const result = parsePage(response.data);
                        readings = result.readings;
                        hasReadings = result.hasReadings;
                    }
                }
            }

            const readingData = {
                date: calendarData.date,
                monthDay: calendarData.monthDay,
                season: calendarData.season,
                readings: readings,
                usccbLink: usccbUrl,
                apiEndpoint: `https://cpbjr.github.io/catholic-readings-api/readings/2027/${file}`
            };

            fs.writeFileSync(outputPath, JSON.stringify(readingData, null, 2));
            if (hasReadings) {
                console.log(`Successfully saved ${file}`);
            } else {
                console.warn(`Saved empty readings for ${file} (could not parse)`);
            }

            await new Promise(resolve => setTimeout(resolve, 800));

        } catch (error) {
            console.error(`Error fetching ${date}: ${error.message}`);
        }
    }

    console.log('2027 readings scraping complete!');

    const checkerResult = spawnSync(
        'node',
        [path.join(__dirname, 'check-solemnity-readings.js'), '--year', '2027'],
        { stdio: 'inherit' }
    );
    if (checkerResult.status !== 0) {
        console.error('ERROR: Solemnity readings check failed — review the output above before publishing.');
        process.exit(1);
    }
}

scrapeReadings().catch(console.error);
