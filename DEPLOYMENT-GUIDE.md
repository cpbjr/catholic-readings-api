# Catholic Readings API - GitHub Pages Deployment Guide

## 🎯 Mission
Deploy the Catholic Readings API as a **public, free, discoverable resource** for the global Catholic developer community.

---

## 📋 Step 1: Create Public GitHub Repository

### On GitHub.com:
1. Go to: https://github.com/new
2. Fill in repository details:

```
Repository name: catholic-readings-api
Description: Free Catholic Mass readings and liturgical calendar API via GitHub Pages - serving parishes, apps, and developers worldwide
Public: ✅ YES (very important!)
Initialize repository: ❌ NO (we have existing content)
```

3. Click **"Create repository"**
4. **Do NOT add README, .gitignore, or license** (we already have these)

---

## 📦 Step 2: Push Existing Content to New Repository

### Commands to Run:

```bash
# Navigate to the catholic-readings-api directory
cd "/home/cpbjr/Documents/AI_Automation/Projects/Daily Summary/catholic-readings-api"

# Initialize git repository (if not already initialized)
git init

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: Catholic Readings API for GitHub Pages

- 247 liturgical entries for 2025
- Daily Mass readings (First Reading, Psalm, Gospel)
- Celebrations and feast days with biographical data
- JSON format for easy API integration
- USCCB verification links
- Wikipedia research links
- MIT License - free for all uses

Built to serve the New Evangelization through technology."

# Set main branch
git branch -M main

# Add remote repository (use YOUR actual GitHub URL)
git remote add origin https://github.com/cpbjr/catholic-readings-api.git

# Push to GitHub
git push -u origin main
```

**Note:** If git says "remote origin already exists", run:
```bash
git remote set-url origin https://github.com/cpbjr/catholic-readings-api.git
```

---

## 🌐 Step 3: Enable GitHub Pages

### On GitHub.com:
1. Go to your repository: `https://github.com/cpbjr/catholic-readings-api`
2. Click **Settings** (top right)
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment

### Verify Deployment:
Your API will be live at:
```
https://cpbjr.github.io/catholic-readings-api/
```

Test an endpoint:
```
https://cpbjr.github.io/catholic-readings-api/readings/2025/10-12.json
```

---

## 🏷️ Step 4: Add Repository Topics (for Discoverability)

### On GitHub.com:
1. Go to your repository homepage
2. Click **⚙️ gear icon** next to "About" (top right of page)
3. Add these topics:
   ```
   catholic
   api
   liturgy
   mass-readings
   calendar
   json-api
   github-pages
   rest-api
   religious
   usccb
   vatican
   christianity
   worship
   catholic-church
   liturgical-calendar
   ```
4. Add website URL: `https://cpbjr.github.io/catholic-readings-api/`
5. Click **Save changes**

---

## 📊 Step 5: Verify Everything Works

### Test Checklist:
- [ ] Repository is public (visible without login)
- [ ] README displays nicely on repository homepage
- [ ] GitHub Pages site is live at `cpbjr.github.io/catholic-readings-api/`
- [ ] JSON files are accessible (test a readings URL)
- [ ] Topics are visible on repository page
- [ ] License badge shows MIT
- [ ] API Status badge shows "Live"

### Quick Tests:
```bash
# Test readings endpoint
curl https://cpbjr.github.io/catholic-readings-api/readings/2025/10-12.json

# Test celebration endpoint
curl https://cpbjr.github.io/catholic-readings-api/liturgical-calendar/2025/12-25.json
```

---

## 🚀 Step 6: Announce & Share (Optional)

Once live, share with the Catholic developer community:

### Suggested Platforms:
- **GitHub Topics** - Already discoverable via topics
- **Reddit** - r/Catholicism, r/webdev, r/APIs
- **Stack Overflow** - Answer questions about Catholic APIs
- **Catholic Tech Communities** - Catholic Developers Slack, forums
- **Social Media** - LinkedIn, Twitter with hashtags #CatholicTech #API

### Sample Announcement:
> 🙏 Launching a free Catholic Readings API!
>
> Daily Mass readings, celebrations, and liturgical calendar data via GitHub Pages.
> No API keys, no rate limits, completely free for parishes, apps, and developers.
>
> 📖 https://github.com/cpbjr/catholic-readings-api
> 🌐 https://cpbjr.github.io/catholic-readings-api/
>
> Built to serve the New Evangelization through technology.

---

## 🔧 Maintenance & Updates

### Adding New Data:
1. Update JSON files in your local repository
2. Commit changes: `git commit -am "Add readings for [date/period]"`
3. Push to GitHub: `git push origin main`
4. GitHub Pages auto-updates within 1-2 minutes

### Accepting Contributions:
- Other developers can submit Pull Requests
- Review changes in GitHub's PR interface
- Merge approved contributions

---

## 📞 Support

### If Something Goes Wrong:

**GitHub Pages not deploying?**
- Check Settings → Pages → Deployment status
- Verify branch is `main` and folder is `/ (root)`
- Wait 2-3 minutes after first setup

**CORS errors in browser?**
- GitHub Pages automatically enables CORS
- Verify URL format: `cpbjr.github.io` not `github.com`

**JSON files not loading?**
- Check file paths match exactly (case-sensitive)
- Verify files were committed and pushed: `git log`
- Test with: `curl [your-url]`

---

## ✅ Success Criteria

You'll know it's working when:
1. ✅ Anyone can visit `https://cpbjr.github.io/catholic-readings-api/` without login
2. ✅ JSON files load in browser: `https://cpbjr.github.io/catholic-readings-api/readings/2025/10-12.json`
3. ✅ Repository appears in GitHub search for "catholic api"
4. ✅ README displays with all badges and examples
5. ✅ Other developers can star, fork, and submit PRs

---

**"Go into all the world and preach the Gospel to every creature."** - Mark 16:15

*Serving the New Evangelization through open-source technology.*
