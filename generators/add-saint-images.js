const fs = require('fs');
const path = require('path');
const axios = require('axios');

const calendarDir = path.join(__dirname, '..', 'liturgical-calendar', '2026');

// Manual mappings for saints with different Wikipedia page names
const SAINT_NAME_MAPPINGS = {
    'Anthony of Egypt': 'Anthony_the_Great',
    'Agnes': 'Agnes_of_Rome',
    'Agatha': 'Agatha_of_Sicily',
    'Athanasius': 'Athanasius_of_Alexandria',
    'Justin': 'Justin_Martyr',
    'Boniface': 'Saint_Boniface',
    'Clare': 'Clare_of_Assisi',
    'Monica': 'Saint_Monica',
    'Basil the Great and Gregory Nazianzen': 'Basil_of_Caesarea',  // Use primary saint
    'Timothy and Titus': 'Saint_Timothy',  // Use primary saint
    'Cyril, Monk and Methodius': 'Cyril_and_Methodius',
    'Paul Miki and Companions': 'Paul_Miki',
    'Charles Lwanga and Companions': 'Charles_Lwanga',
    'Cornelius, Pope, and Cyprian': 'Pope_Cornelius',
    'Jean Vianney (the Cure of Ars)': 'John_Vianney',
    'Alphonsus Maria de Liguori': 'Alphonsus_Liguori',
    'Maximilian Mary Kolbe': 'Maximilian_Kolbe',
    'Gregory the Great': 'Pope_Gregory_I',
    'Pio of Pietrelcina (Padre Pio)': 'Padre_Pio',
    'Pius X': 'Pope_Pius_X',
    'Therese of the Child Jesus': 'Thérèse_of_Lisieux',
    'Teresa of Jesus': 'Teresa_of_Ávila',
    'Leo the Great': 'Pope_Leo_I',
    'Josaphat': 'Josaphat_Kuntsevych',
    'Barnabas the Apostle': 'Barnabas',
    'The Beheading of Saint John the Baptist': 'Beheading_of_John_the_Baptist',
    'Andrew Dung-Lac and Companions': 'Andrew_Dung-Lac',
    'Mary, Mother of The Church': 'Mary,_Mother_of_the_Church',
    'Queenship of Blessed Virgin Mary': 'Queenship_of_Mary',
    'Presentation of The Blessed Virgin Mary': 'Presentation_of_Mary',
    'Guardian Angels': 'Guardian_angel'
};

/**
 * Converts saint name to Wikipedia page title
 * @param {string} saintName - Saint name from celebration data
 * @returns {string} - Wikipedia page title
 */
function saintNameToWikipediaTitle(saintName) {
    // Remove common suffixes like ", Priest", ", Bishop", ", Martyr", etc.
    let cleanName = saintName
        .replace(/,?\s+(Priest|Bishop|Martyr|Virgin|Doctor of the Church|Abbot|Deacon|Religious|Pope|Monk|Patron of Europe|and Doctor).*$/i, '')
        .replace(/^Saints?\s+/i, '')  // Remove "Saint" or "Saints" prefix
        .trim();

    // Check manual mappings first
    if (SAINT_NAME_MAPPINGS[cleanName]) {
        return SAINT_NAME_MAPPINGS[cleanName];
    }

    // Replace spaces with underscores for Wikipedia URL format
    return cleanName.replace(/\s+/g, '_');
}

/**
 * Fetches saint image from Wikipedia using the MediaWiki API
 * @param {string} saintName - Saint name from celebration data
 * @returns {Promise<string|null>} - Image URL or null if not found
 */
async function fetchSaintImage(saintName) {
    if (!saintName) return null;

    try {
        const pageTitle = saintNameToWikipediaTitle(saintName);

        // Query Wikipedia API for page image
        const apiUrl = 'https://en.wikipedia.org/w/api.php';
        const params = {
            action: 'query',
            titles: pageTitle,
            prop: 'pageimages',
            format: 'json',
            pithumbsize: 500  // 500px width thumbnail
        };

        const response = await axios.get(apiUrl, {
            params,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; CatholicReadingsAPI/1.0; +https://github.com/cpbjr/catholic-readings-api)'
            },
            timeout: 10000
        });

        const pages = response.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];

        if (page.thumbnail && page.thumbnail.source) {
            return page.thumbnail.source;
        }

        console.log(`No image found for: ${pageTitle}`);
        return null;

    } catch (error) {
        console.error(`Error fetching image for ${saintName}: ${error.message}`);
        return null;
    }
}

/**
 * Adds saint images to all MEMORIAL celebrations in 2026
 */
async function addSaintImages() {
    console.log('Starting to add saint images to MEMORIAL celebrations...');

    const files = fs.readdirSync(calendarDir).sort();
    let processedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = path.join(calendarDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Only process MEMORIAL celebrations
        if (data.celebration && data.celebration.type === 'MEMORIAL') {
            processedCount++;

            // Skip if image already exists
            if (data.celebration.image) {
                console.log(`Skipping ${file} - image already exists`);
                skippedCount++;
                continue;
            }

            console.log(`Processing ${file}: ${data.celebration.name}`);

            // Fetch image from Wikipedia
            const imageUrl = await fetchSaintImage(data.celebration.name);

            if (imageUrl) {
                data.celebration.image = imageUrl;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                console.log(`✓ Added image for ${data.celebration.name}`);
                updatedCount++;
            } else {
                console.log(`✗ No image found for ${data.celebration.name}`);
            }

            // Rate limiting: wait 500ms between requests
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    console.log('\n=== Summary ===');
    console.log(`Total MEMORIAL celebrations: ${processedCount}`);
    console.log(`Updated with images: ${updatedCount}`);
    console.log(`Skipped (already had images): ${skippedCount}`);
    console.log(`Failed to find images: ${processedCount - updatedCount - skippedCount}`);
}

// Run the script
addSaintImages().catch(console.error);
