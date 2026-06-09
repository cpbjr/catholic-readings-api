const generateSkeleton = require('./skeleton')
const addSaintImages = require('./add-saint-images')
const scrapeReadings = require('./scrape-readings')

const arg = process.argv.slice(2);

const year = Number(arg[0])

if (Number.isNaN(year)) {
    console.error('YEAR is a required argument. Example: `node generator.js 2027`')
    process.exit(0)
}

async function generate(year) {
    await generateSkeleton(year)
    await addSaintImages(year)
    await scrapeReadings(year)
}

generate(year)