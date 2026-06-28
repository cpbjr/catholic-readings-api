#!/usr/bin/env node

/**
 * check-calendar-mismatches.js
 *
 * Scans liturgical-calendar files and flags dates where the description or
 * quote appears to reference a different saint than the celebration.name.
 *
 * Detection strategy: "cross-contamination" check.
 *   - For each celebration with content, extract the DISTINCTIVE name portion
 *     (the saint's personal name, excluding generic liturgical titles).
 *   - Check whether that name appears verbatim in the content of a *different*
 *     celebration. Flag if found.
 *
 * This targets the specific bug class from the June 29 incident: content
 * written for one saint (e.g. "John Paul II") appearing under a different
 * feast (e.g. "Saints Peter and Paul").
 *
 * Usage:
 *   node generators/check-calendar-mismatches.js [--year 2026] [--json]
 *
 * Flags:
 *   --year <YYYY>   Only check a specific year (default: all years)
 *   --json          Output results as JSON instead of plain text
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CALENDAR_DIR = path.join(__dirname, '..', 'liturgical-calendar');
const YEARS = ['2025', '2026', '2027'];

// Types with no quote/description — skip silently
const SKIP_TYPES = new Set(['FERIA', 'SUNDAY', 'WEEKDAY']);

// Prefixes/suffixes that are liturgical framing, not the saint's name itself.
// We strip these to get the "core name" for cross-contamination matching.
const STRIP_PREFIXES = [
  'saints? ', 'saint ', 'blessed ', 'most holy ', 'holy ',
  'our lady of ', 'our lady ', 'birth of ', 'death of ',
  'exaltation of the holy cross',
  'dedication of ', 'solemnity of ', 'feast of ',
];

const STRIP_SUFFIXES = [
  ', apostle', ', apostles', ', martyr', ', martyrs',
  ', bishop', ', bishops', ', pope', ', abbot', ', abbess',
  ', virgin', ', doctor', ', widow', ', confessor', ', deacon',
  ' and companions', ' and companion',
  ' of the church', ' of the cross', ' of god',
];

// Very-common words that appear in many celebration names —
// not useful as discriminating tokens on their own.
const AMBIGUOUS_WORDS = new Set([
  'john', 'paul', 'peter', 'mary', 'james', 'joseph', 'francis', 'thomas',
  'michael', 'anne', 'anna', 'philip', 'andrew', 'mark', 'luke', 'matthew',
  'stephen', 'nicholas', 'robert', 'george', 'martin', 'pius', 'clement',
  'leo', 'gregory', 'benedict', 'vincent', 'dominic', 'anthony', 'jerome',
  'rose', 'the', 'of', 'and', 'or', 'in', 'a', 'an',
]);

// Minimum word count for an extracted name to be used as a signature
const MIN_NAME_WORDS = 2;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip generic liturgical wrappers and return just the core name portion.
 * Returns lowercased result.
 */
function extractCoreName(rawName) {
  let name = rawName.toLowerCase().trim();

  // Strip known prefixes
  for (const prefix of STRIP_PREFIXES) {
    const re = new RegExp(`^${prefix}`, 'i');
    name = name.replace(re, '');
  }

  // Strip known suffixes
  for (const suffix of STRIP_SUFFIXES) {
    if (name.endsWith(suffix)) {
      name = name.slice(0, name.length - suffix.length);
    }
  }

  return name.trim();
}

/**
 * Is this core name distinctive enough to use as a signature?
 * Must be >= MIN_NAME_WORDS words and not consist only of ambiguous words.
 */
function isDistinctive(coreName) {
  const words = coreName.split(/\s+/).filter(w => w.length > 0);
  if (words.length < MIN_NAME_WORDS) return false;
  const nonAmbiguous = words.filter(w => !AMBIGUOUS_WORDS.has(w));
  return nonAmbiguous.length >= 1;
}

/** Load all calendar entries */
function loadEntries(yearsToCheck) {
  const entries = [];
  const errors = [];
  for (const year of yearsToCheck) {
    const yearDir = path.join(CALENDAR_DIR, year);
    if (!fs.existsSync(yearDir)) {
      process.stderr.write(`Warning: directory not found: ${yearDir}\n`);
      continue;
    }
    for (const file of fs.readdirSync(yearDir).filter(f => f.endsWith('.json')).sort()) {
      let data;
      try {
        data = JSON.parse(fs.readFileSync(path.join(yearDir, file), 'utf8'));
      } catch (e) {
        errors.push({ file: path.join(year, file), error: e.message });
        continue;
      }
      const cel = data.celebration || {};
      entries.push({
        date: data.date,
        year,
        name: cel.name || '',
        type: cel.type || '',
        quote: cel.quote || '',
        description: cel.description || '',
        file: path.join(year, file),
      });
    }
  }
  return { entries, errors };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const yearFlag = args.includes('--year') ? args[args.indexOf('--year') + 1] : null;
const jsonOutput = args.includes('--json');

const yearsToCheck = yearFlag ? [yearFlag] : YEARS;
const { entries: allEntries, errors } = loadEntries(yearsToCheck);

const contentEntries = allEntries.filter(
  e => !SKIP_TYPES.has(e.type) && (e.quote || e.description)
);

// Build a set of (coreName → Set<rawName>) for all entries
// These are the "signatures" we'll check for cross-contamination
const signatureMap = new Map(); // coreName (string) → Set<rawName>
for (const entry of contentEntries) {
  const core = extractCoreName(entry.name);
  if (!isDistinctive(core)) continue;
  if (!signatureMap.has(core)) signatureMap.set(core, new Set());
  signatureMap.get(core).add(entry.name);
}

// For each entry, check if a foreign signature appears in its content
const findings = [];

for (const entry of contentEntries) {
  const myCore = extractCoreName(entry.name);
  const text = `${entry.quote} ${entry.description}`.toLowerCase();

  const hits = [];
  for (const [sig, owners] of signatureMap) {
    // Skip: this is the entry's own signature
    if (sig === myCore) continue;

    // Skip: the signature is a substring of this entry's name (or vice versa)
    if (myCore.includes(sig) || sig.includes(myCore)) continue;

    // Check if the signature phrase appears literally in the content
    if (!text.includes(sig)) continue;

    // We have a hit — foreign name in this content
    const foreignOwners = [...owners].filter(o => o !== entry.name);
    if (foreignOwners.length === 0) continue;

    hits.push({ phrase: sig, owners: foreignOwners });
  }

  if (hits.length > 0) {
    // Sort by phrase length descending (prefer longer / more specific matches)
    hits.sort((a, b) => b.phrase.length - a.phrase.length);

    // Deduplicate: keep only the longest hit per set of owners
    const seen = new Set();
    const dedupedHits = [];
    for (const h of hits) {
      const key = h.owners.sort().join('|');
      if (!seen.has(key)) {
        seen.add(key);
        dedupedHits.push(h);
      }
    }

    findings.push({
      date: entry.date,
      name: entry.name,
      type: entry.type,
      quote: entry.quote.slice(0, 90) + (entry.quote.length > 90 ? '…' : ''),
      description: entry.description.slice(0, 130) + (entry.description.length > 130 ? '…' : ''),
      hits: dedupedHits,
      file: entry.file,
    });
  }
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

if (jsonOutput) {
  console.log(JSON.stringify({ findings, errors }, null, 2));
} else {
  if (findings.length === 0 && errors.length === 0) {
    console.log('✓ No cross-contamination mismatches detected.');
  } else {
    if (findings.length > 0) {
      console.log(`\nPotential mismatches — foreign saint name found in content (${findings.length}):\n`);
      for (const f of findings) {
        console.log(`${f.date}  [${f.type}]  ${f.name}`);
        for (const h of f.hits) {
          console.log(`  ⚠  "${h.phrase}" → normally belongs to: ${h.owners.join(', ')}`);
        }
        if (f.quote)       console.log(`  Quote:       ${f.quote}`);
        if (f.description) console.log(`  Description: ${f.description}`);
        console.log(`  File:        ${f.file}`);
        console.log();
      }
    }

    if (errors.length > 0) {
      console.log(`\nParse errors (${errors.length}):\n`);
      for (const e of errors) {
        console.log(`  ${e.file}: ${e.error}`);
      }
    }
  }
}
