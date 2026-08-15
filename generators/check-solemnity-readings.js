#!/usr/bin/env node

/**
 * check-solemnity-readings.js
 *
 * Scans liturgical-calendar/{year}/*.json and the corresponding
 * readings/{year}/*.json to verify that solemnities and feasts have complete
 * readings.
 *
 * Rules:
 *   1. Every readings file must have firstReading and gospel.
 *   2. SOLEMNITY type: also require secondReading, EXCEPT Easter octave
 *      weekdays (Easter Monday–Saturday), which correctly have only
 *      first+psalm+gospel.
 *   3. SOLEMNITY or FEAST whose name matches a prominent holy-day pattern
 *      (Assumption, Christmas, Pentecost, etc.) gets an extra label in output
 *      when firstReading is missing, to surface the most liturgically critical
 *      gaps prominently.
 *
 * Usage:
 *   node generators/check-solemnity-readings.js --year 2026 [--json]
 *
 * Flags:
 *   --year <YYYY>   Year to check (required)
 *   --json          Output results as JSON instead of plain text
 *
 * Exit codes:
 *   0   All checks passed
 *   1   One or more FAILs found
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CALENDAR_DIR = path.join(__dirname, '..', 'liturgical-calendar');
const READINGS_DIR = path.join(__dirname, '..', 'readings');

// Easter octave weekdays: correct to have first+psalm+gospel only (no second)
const EASTER_OCTAVE_RE = /easter (monday|tuesday|wednesday|thursday|friday|saturday)/i;

// Prominent holy days where a missing firstReading is especially critical
const PROMINENT_HOLYDAY_RE =
  /assumption|christmas|pentecost|immaculate conception|all saints|birth of john|peter and paul|sacred heart|corpus christi|epiphany|mary mother of god|trinity|christ the king|ascension/i;

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const yearIdx = args.indexOf('--year');
const jsonOutput = args.includes('--json');

if (yearIdx === -1 || !args[yearIdx + 1]) {
  process.stderr.write('Usage: node check-solemnity-readings.js --year YYYY [--json]\n');
  process.exit(2);
}

const YEAR = args[yearIdx + 1];

// ---------------------------------------------------------------------------
// Load and check
// ---------------------------------------------------------------------------

const calendarYearDir = path.join(CALENDAR_DIR, YEAR);
const readingsYearDir = path.join(READINGS_DIR, YEAR);

if (!fs.existsSync(calendarYearDir)) {
  process.stderr.write(`Error: liturgical-calendar directory not found: ${calendarYearDir}\n`);
  process.exit(2);
}

const failures = [];
const parseErrors = [];

const calendarFiles = fs.readdirSync(calendarYearDir)
  .filter(f => f.endsWith('.json'))
  .sort();

for (const file of calendarFiles) {
  const calendarPath = path.join(calendarYearDir, file);
  const readingsPath = path.join(readingsYearDir, file);

  // Load calendar entry
  let calData;
  try {
    calData = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  } catch (e) {
    parseErrors.push({ file: `liturgical-calendar/${YEAR}/${file}`, error: e.message });
    continue;
  }

  const cel = calData.celebration || {};
  const celebType = (cel.type || '').toUpperCase();
  const celebName = cel.name || '';

  // Only check types that can have structured readings
  // (skip plain FERIAs and OPT_MEMORIALs that share the weekday readings)
  // Rule 1 applies to ALL types with a readings file, so we check any file present.

  // Load readings file
  if (!fs.existsSync(readingsPath)) {
    // Only flag missing readings files for SOLEMNITYs and FEASTs
    if (celebType === 'SOLEMNITY' || celebType === 'FEAST') {
      failures.push({
        date: calData.date,
        type: celebType,
        name: celebName,
        missing: ['readings file absent'],
        file: `readings/${YEAR}/${file}`,
      });
    }
    continue;
  }

  let readData;
  try {
    readData = JSON.parse(fs.readFileSync(readingsPath, 'utf8'));
  } catch (e) {
    parseErrors.push({ file: `readings/${YEAR}/${file}`, error: e.message });
    continue;
  }

  const readings = readData.readings || {};
  const missing = [];

  // Rule 1: Every readings file must have firstReading and gospel
  if (!readings.firstReading) missing.push('firstReading');
  if (!readings.gospel) missing.push('gospel');

  // Rule 2: SOLEMNITY (non-Easter-octave) must also have secondReading
  if (
    celebType === 'SOLEMNITY' &&
    !EASTER_OCTAVE_RE.test(celebName) &&
    !readings.secondReading
  ) {
    missing.push('secondReading');
  }

  if (missing.length > 0) {
    const isProminentHolyday =
      (celebType === 'SOLEMNITY' || celebType === 'FEAST') &&
      PROMINENT_HOLYDAY_RE.test(celebName);

    failures.push({
      date: calData.date,
      type: celebType,
      name: celebName,
      missing,
      file: `readings/${YEAR}/${file}`,
      prominentHolyday: isProminentHolyday,
    });
  }
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

if (jsonOutput) {
  console.log(JSON.stringify({ year: YEAR, failures, parseErrors }, null, 2));
} else {
  if (failures.length === 0 && parseErrors.length === 0) {
    console.log(`✓ ${YEAR}: All solemnity/feast readings checks passed.`);
  }

  if (failures.length > 0) {
    console.log(`\nFAIL — missing readings fields (${failures.length}):\n`);
    for (const f of failures) {
      const tag = f.prominentHolyday ? ' [PROMINENT HOLY DAY]' : '';
      console.log(`${f.date}  [${f.type}]  ${f.name}${tag}`);
      console.log(`  Missing: ${f.missing.join(', ')}`);
      console.log(`  File:    ${f.file}`);
      console.log();
    }
  }

  if (parseErrors.length > 0) {
    console.log(`\nParse errors (${parseErrors.length}):\n`);
    for (const e of parseErrors) {
      console.log(`  ${e.file}: ${e.error}`);
    }
  }
}

if (failures.length > 0 || parseErrors.length > 0) {
  process.exit(1);
}
