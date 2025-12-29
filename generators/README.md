# Liturgical Data Generators

This directory contains the scripts used to generate the liturgical calendar and mass readings for the Catholic Readings API.

## Process for Future Years (e.g., 2027)

To generate data for a new year, follow these steps:

### 1. Generate the Liturgical Calendar Skeleton
Use `generate-2026-skeleton.js` as a template (e.g., copy to `generate-2027-skeleton.js`).
1. Update the year to `2027` in the script.
2. Confirm the liturgical cycles (2027 is Sunday Cycle B, Weekday Cycle I).
3. Run the script: `node generate-2027-skeleton.js`.
4. This will populate `liturgical-calendar/2027/`.

### 2. Generate Mass Readings
Use `generate-2026-readings.js` as a template.
1. Update paths and logic to point to the new year's calendar directory.
2. Run the script: `node generate-2027-readings.js`.
3. The script will scrape the USCCB website (`bible.usccb.org`).

### Key Implementation Details

#### Handling Landing Pages
The USCCB website often uses landing pages for major solemnities (Christmas, Pentecost, Holy Thursday, etc.). The scraper is designed to:
- Detect if a page has no direct readings citations.
- Look for links containing "Mass during the Day", "Lord's Supper", or "Thanksgiving".
- Recursively fetch and parse the target page.

#### Handling 404s
Occasionally, the USCCB URL pattern `MMDDYY.cfm` fails (returns 404). For 2026, we encountered 4 such cases.
- **Solution**: Manually verify the readings for those dates and add them to the `readingsFallbacks` object in the script.

#### Respectful Scraping
- Always include a user-agent header.
- Implement a delay (at least 800ms) between requests to avoid being blocked.

## Dependencies
- `axios`: For HTTP requests.
- `cheerio`: For HTML parsing.
- `romcal`: For generating the liturgical calendar skeleton.

---
*Built with ❤️ for the Catholic developer community.*
