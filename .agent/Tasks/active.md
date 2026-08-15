# Active Tasks

**Last Updated**: 2026-08-15

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
