const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const calendarDir = path.join(__dirname, '..', 'liturgical-calendar', '2026');
const outputDir = path.join(__dirname, '..', 'readings', '2026');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function parsePage(html) {
    const $ = cheerio.load(html);
    const readings = {};
    let hasReadings = false;

    $('h3').each((i, el) => {
        const title = $(el).text().trim().toLowerCase();
        let citation = "";

        const addressDiv = $(el).nextAll('div.address').first();
        if (addressDiv.length && addressDiv.prevAll('h3').first().is(el)) {
            citation = addressDiv.text().trim();
        }

        if (!citation) {
            const nextLink = $(el).nextAll('a').first();
            if (nextLink.length && nextLink.prevAll('h3').first().is(el)) {
                citation = nextLink.text().trim();
            }
        }

        if (citation) {
            if (/reading\s+(i|1)\b/.test(title) && !/(ii|2)/.test(title)) {
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
    console.log('Starting final 2026 readings scraper...');
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
            if (existing.readings && Object.keys(existing.readings).length > 2) {
                continue;
            }
            console.log(`Re-scraping ${file} (missing data)...`);
        } else {
            console.log(`Fetching readings for ${date}...`);
        }

        try {
            let response = await fetchWithRetry(usccbUrl);
            const readingsFallbacks = {
                '050926': { firstReading: 'Acts 16:1-10', psalm: 'Psalm 100:1b-2, 3, 5', gospel: 'John 15:18-21' },
                '063026': { firstReading: 'Amos 3:1-8; 4:11-12', psalm: 'Psalm 5:5-6, 7, 8', gospel: 'Matthew 8:23-27' },
                '080126': { firstReading: 'Jeremiah 26:11-16, 24', psalm: 'Psalm 69:15-16, 30-31, 33-34', gospel: 'Matthew 14:1-12' },
                '081226': { firstReading: 'Ezekiel 9:1-7; 10:18-22', psalm: 'Psalm 113:1-2, 3-4, 5-6', gospel: 'Matthew 18:15-20' }
            };

            if (!response) {
                if (readingsFallbacks[usccbDate]) {
                    console.log(`Using hardcoded fallback for ${date}`);
                    const readingData = {
                        date: calendarData.date,
                        monthDay: calendarData.monthDay,
                        season: calendarData.season,
                        readings: readingsFallbacks[usccbDate],
                        usccbLink: usccbUrl,
                        apiEndpoint: `https://cpbjr.github.io/catholic-readings-api/readings/2026/${file}`
                    };
                    fs.writeFileSync(outputPath, JSON.stringify(readingData, null, 2));
                    continue;
                }
                console.error(`404 for ${usccbUrl}`);
                continue;
            }

            let { readings, hasReadings } = parsePage(response.data);

            // If no readings found, check for landing page links
            if (!hasReadings) {
                const $ = cheerio.load(response.data);
                const dayMassLink = $('a').filter((i, el) => {
                    const txt = $(el).text().toLowerCase();
                    return txt.includes('mass during the day') ||
                        txt.includes('mass at the day') ||
                        txt === 'day' ||
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
                apiEndpoint: `https://cpbjr.github.io/catholic-readings-api/readings/2026/${file}`
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

    console.log('2026 readings scraping complete!');
}

scrapeReadings().catch(console.error);
