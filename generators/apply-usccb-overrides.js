#!/usr/bin/env node

/**
 * apply-usccb-overrides.js
 *
 * Shared helper: applies generators/usccb-title-overrides.json on top of a
 * romcal-derived (or existing) celebration name, so the USCCB wording wins
 * over romcal's folk/nickname titles.
 *
 * Used two ways:
 *   1. require()'d by skeleton generators at generation time.
 *   2. run directly to retroactively patch existing liturgical-calendar/*.json
 *      files, so a fix here doesn't require a full regeneration to land:
 *        node generators/apply-usccb-overrides.js [--year YYYY] [--dry-run]
 *
 * Days superseded by a Sunday (celebration.type === 'SUNDAY') are left alone,
 * since the override applies to the memorial/solemnity itself, not whatever
 * happens to occupy that calendar date in a given year.
 */

const fs = require('fs');
const path = require('path');

const OVERRIDES_PATH = path.join(__dirname, 'usccb-title-overrides.json');
const { overrides } = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'));

const SKIP_TYPES = new Set(['SUNDAY', 'WEEKDAY', 'FERIA']);

/**
 * Given a MM-DD key and the type romcal/the file assigned, return the
 * USCCB-preferred name if an override exists and applies, otherwise null.
 */
function getOverrideName(monthDay, type) {
  const entry = overrides[monthDay];
  if (!entry) return null;
  if (SKIP_TYPES.has(type)) return null;
  return entry.name;
}

module.exports = { getOverrideName, overrides };

// ---------------------------------------------------------------------------
// CLI: retroactively patch existing calendar JSON
// ---------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);
  const yearFlag = args.includes('--year') ? args[args.indexOf('--year') + 1] : null;
  const dryRun = args.includes('--dry-run');

  const calendarDir = path.join(__dirname, '..', 'liturgical-calendar');
  const years = yearFlag ? [yearFlag] : fs.readdirSync(calendarDir).filter(f =>
    fs.statSync(path.join(calendarDir, f)).isDirectory()
  );

  let changed = 0;

  for (const year of years) {
    const yearDir = path.join(calendarDir, year);
    if (!fs.existsSync(yearDir)) continue;

    for (const [monthDay, entry] of Object.entries(overrides)) {
      const file = path.join(yearDir, `${monthDay}.json`);
      if (!fs.existsSync(file)) continue;

      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const cel = data.celebration || {};
      const overrideName = getOverrideName(monthDay, cel.type);
      if (!overrideName) continue;
      if (cel.name === overrideName) continue;

      console.log(`${year}/${monthDay}.json: "${cel.name}" -> "${overrideName}"`);
      changed++;

      if (!dryRun) {
        data.celebration.name = overrideName;
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
      }
    }
  }

  console.log(dryRun ? `\n${changed} file(s) would change.` : `\n${changed} file(s) updated.`);
}
