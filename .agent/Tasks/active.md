# Active Tasks

**Last Updated**: 2026-02-13

*Currently no active tasks.*

---

## ✅ Completed (2026-02-13)

### #5 - Saint Images for Memorial Celebrations
**Source:** [GitHub #5](https://github.com/cpbjr/catholic-readings-api/issues/5)
**Completed:** 2026-02-13

Successfully implemented saint image integration for MEMORIAL celebrations:

- ✅ Created `generators/add-saint-images.js` to fetch images from Wikipedia API
- ✅ Added `image` field to 48 out of 54 MEMORIAL celebrations in 2026 (89% coverage)
- ✅ Updated `index.html` to display saint images in demo
- ✅ Updated README.md with new feature documentation
- ✅ Images sourced from Wikimedia Commons (500px thumbnails)

**API Enhancement**: Memorial celebrations now include direct URLs to saint images when available.

**Example**:
```json
{
  "celebration": {
    "name": "Saint John Bosco, Priest",
    "type": "MEMORIAL",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/..."
  }
}
```

---

## Issues Reported

- [ ] **#3**: Future enhancements
- [ ] **#1**: Place for questions or discussion?
