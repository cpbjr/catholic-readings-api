# Liturgical Data Generators

This directory contains the scripts used to generate the liturgical calendar and mass readings for the Catholic Readings API.

## USCCB title overrides (`usccb-title-overrides.json`)

romcal's default English `event.name` is sometimes a folk/nickname title
(e.g. "The Beheading of Saint John the Baptist") instead of the wording
USCCB actually uses on `bible.usccb.org` daily readings pages (e.g.
"Memorial of the Passion of Saint John the Baptist"). `usccb-title-overrides.json`
maps `MM-DD` to the USCCB-preferred `celebration.name`, verified against the
`<title>` of the corresponding `bible.usccb.org/bible/readings/MMDDYY.cfm` page.

- Applied at generation time by `generate-2026-skeleton.js` (any new skeleton
  generator for a future year should `require('./apply-usccb-overrides')` and
  call `getOverrideName(monthDay, type)` the same way).
- Applied retroactively to already-generated JSON via
  `node generators/apply-usccb-overrides.js [--year YYYY] [--dry-run]`, so a
  new override doesn't require regenerating the whole calendar.
- Skipped when the date's `celebration.type` is `SUNDAY`/`WEEKDAY`/`FERIA`
  (i.e. when a Sunday supersedes the memorial/solemnity that year — see
  2027-08-29, which stays "22nd Sunday of Ordinary Time").

When adding a new override, verify the USCCB wording directly (fetch the
`bible.usccb.org` page and read its `<title>`) rather than guessing.

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
3. The script scrapes USCCB (`bible.usccb.org`), then **automatically runs** `check-solemnity-readings.js` for that year. A thin holy-day parse (missing `firstReading`, or a solemnity missing `secondReading`) exits non-zero so it cannot be published silently.
4. You can also run the review alone: `node generators/check-solemnity-readings.js --year 2027` (or `npm run check:solemnities -- --year 2027`).

### Key Implementation Details

#### Handling Landing Pages
The USCCB website often uses landing pages for major solemnities (Christmas, Pentecost, Holy Thursday, Assumption, etc.). The scraper is designed to:
- Detect if a page has no citations **or is missing `firstReading`**.
- Look for links containing "Mass during the Day", href `-Day`, "Lord's Supper", or "Thanksgiving".
- Recursively fetch and parse the target page.

Partial holy-day parses (Psalm + Gospel + Second, but no First) used to be treated as complete because the skip rule was `Object.keys(readings).length > 2`. Skip now requires both `firstReading` and `gospel`.

USCCB weekday memorials often title the first reading as a bare **Reading** (no 1/I). `parsePage` treats that as `firstReading`.

#### Solemnity / holy-day review (`check-solemnity-readings.js`)
Required after every scrape (the `generate-YYYY-readings.js` scripts invoke it):

- Every readings file must have `firstReading` and `gospel`.
- `SOLEMNITY` also requires `secondReading`, except Easter Monday–Saturday (octave weekdays).
- Assumption / Christmas / Pentecost-class names are labeled `[PROMINENT HOLY DAY]` in the report.
- Exit 0 if clean, exit 1 on any FAIL.
- 2025 is a partial historical year and will fail the “readings file absent” check for early months. 2026 and 2027 are the production years.

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
