# Active Tasks

**Last Updated**: 2026-08-29

## 6. Use USCCB official titles instead of romcal folk names — IN PROGRESS

**Started**: 2026-08-29
**Why**: Daily spiritual email showed "The Beheading of Saint John the Baptist" on 2026-08-29; USCCB's actual page title is "Memorial of the Passion of Saint John the Baptist". `generate-2026-skeleton.js` copies `event.name` straight from romcal, which uses folk/nickname titles instead of USCCB wording for some dates.

- [x] 6.1 Add `generators/usccb-title-overrides.json` — MM-DD -> verified USCCB `celebration.name`, with source URL/notes
- [x] 6.2 Add `generators/apply-usccb-overrides.js` — shared `getOverrideName()` helper + CLI to retroactively patch existing calendar JSON
- [x] 6.3 Wire `generate-2026-skeleton.js` to apply overrides at generation time (so regenerating doesn't wipe the fix)
- [x] 6.4 Patch existing JSON for 2025/2026/2027: 08-29 (Passion of Saint John the Baptist), 09-23 (Saint Pius of Pietrelcina, Priest — romcal said "Saint Pio ... (Padre Pio)"), 06-24 (Nativity of Saint John the Baptist — romcal said "Birth of John the Baptist"). 2027-08-29 correctly left as "22nd Sunday of Ordinary Time" (Sunday supersedes the memorial that year).
- [x] 6.5 Audited all non-Sunday/weekday `celebration.name` values in 2026 for other folk-sounding titles (Beheading/Decollation/nicknames). Two more candidates flagged (09-08 "Birth of the Blessed Virgin Mary", 08-22 "Queenship of Blessed Virgin Mary") but could not be verified — bible.usccb.org started returning a Cloudflare "Checking connection" challenge page mid-session and didn't clear for those two URLs. **Not changed** — left as romcal's names pending verification.
- [ ] 6.6 Commit, push main, verify GitHub Pages serves updated 08-29.json

**Follow-up (not yet verified)**: check `bible.usccb.org/bible/readings/090826.cfm` and `.../082226.cfm` `<title>` and add overrides to `usccb-title-overrides.json` if they differ from current names.

---

## 5. Fix missing firstReading on holy days (Assumption) — IN PROGRESS

**Started**: 2026-08-15
**Why**: Daily spiritual email crashed 2026-08-15 4 AM because `readings/2026/08-15.json` omitted `firstReading`.

- [x] 5.1 Audit 2025/2026/2027 JSON for missing `firstReading`
- [x] 5.2 Patch Assumption 2026-08-15 (Rev 11:19A; 12:1-6A, 10AB) and 2026-11-21 (Rev 11:4-12)
- [x] 5.3 Harden 2026/2027 scrapers: bare "Reading" heading; follow Day page if firstReading missing; do not skip incomplete files
- [ ] 5.4 Commit, push main, verify GitHub Pages

---

## Issues Reported

- [ ] **#3**: Future enhancements
- [ ] **#1**: Place for questions or discussion?
