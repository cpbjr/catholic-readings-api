# Catholic Readings API

> A free, open-source REST API providing daily Catholic Mass readings, saints, and liturgical calendar data via GitHub Pages.

[![API Status](https://img.shields.io/badge/API-Live-green)](https://cpbjr.github.io/catholic-readings-api/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Powered%20by-GitHub%20Pages-blue)](https://pages.github.com/)

## 🙏 Mission

To provide the Catholic developer community with reliable, free access to liturgical data for building apps, websites, and tools that serve the faithful worldwide.

## ✨ Features

- **Daily Mass Readings** - First Reading, Psalm, Second Reading (when applicable), Gospel
- **Saints & Feast Days** - Complete calendar with quotes and biographical information
- **Liturgical Seasons** - Ordinary Time, Advent, Christmas, Lent, Easter
- **USCCB Verification Links** - Direct links to official USCCB readings
- **Wikipedia Integration** - Research links for saints and feasts
- **JSON Format** - Easy integration with any programming language
- **No Rate Limits** - Completely free, powered by GitHub Pages
- **CORS Enabled** - Access from web applications

## 🚀 Quick Start

### Get Today's Readings
```javascript
// Replace MM-DD with today's date (e.g., 09-07 for September 7)
fetch('https://cpbjr.github.io/catholic-readings-api/readings/2025/09-07.json')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Get Today's Saint
```javascript
fetch('https://cpbjr.github.io/catholic-readings-api/saints/2025/09-07.json')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 📖 API Reference

### Base URL
```
https://cpbjr.github.io/catholic-readings-api/
```

### Endpoints

#### Readings
```
GET /readings/2025/{MM-DD}.json
```

**Example Response:**
```json
{
  "date": "2025-09-07",
  "monthDay": "9/7",
  "season": "Ordinary Time",
  "readings": {
    "firstReading": "Wisdom 9:13-18b",
    "psalm": "Psalm 90:3-4, 5-6, 12-13, 14 and 17",
    "secondReading": "Philemon 9-10, 12-17",
    "gospel": "Luke 14:25-33"
  },
  "usccbLink": "https://bible.usccb.org/bible/readings/090725.cfm",
  "apiEndpoint": "https://cpbjr.github.io/catholic-readings-api/readings/2025/09-07.json"
}
```

#### Saints
```
GET /saints/2025/{MM-DD}.json
```

**Example Response:**
```json
{
  "date": "2025-09-08",
  "monthDay": "9/8",
  "saint": {
    "name": "Birth of Mary",
    "type": "Feast",
    "quote": "Rejoice, O highly favored daughter! The Lord is with you.",
    "description": "Celebrates the birth of the Mother of God."
  },
  "wikipediaLink": "https://en.wikipedia.org/wiki/Birth_of_Mary",
  "apiEndpoint": "https://cpbjr.github.io/catholic-readings-api/saints/2025/09-08.json"
}
```

## 💡 Use Cases

### Parish Websites
```javascript
// Display daily readings on parish homepage
async function displayDailyReadings() {
    const today = new Date();
    const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const response = await fetch(`https://cpbjr.github.io/catholic-readings-api/readings/2025/${dateStr}.json`);
    const readings = await response.json();
    
    document.getElementById('first-reading').textContent = readings.readings.firstReading;
    document.getElementById('gospel').textContent = readings.readings.gospel;
}
```

### Mobile Apps
```swift
// Swift example for iOS apps
struct CatholicReading: Codable {
    let date: String
    let season: String
    let readings: Readings
    let usccbLink: String
}

func fetchDailyReadings() {
    let url = URL(string: "https://cpbjr.github.io/catholic-readings-api/readings/2025/09-07.json")!
    URLSession.shared.dataTask(with: url) { data, response, error in
        // Handle response
    }.resume()
}
```

### Automated Bulletins
```python
# Python example for bulletin generation
import requests
from datetime import date

def get_sunday_readings():
    today = date.today()
    date_str = today.strftime("%m-%d")
    
    response = requests.get(f'https://cpbjr.github.io/catholic-readings-api/readings/2025/{date_str}.json')
    readings = response.json()
    
    return readings
```

## 🗓️ Data Coverage

### Liturgical Year 2025
- **247 Total Entries** - Complete coverage of major feasts and seasons
- **43 Daily Readings** - From August through December 2025
- **204 Saints & Feasts** - Throughout the liturgical calendar
- **All Liturgical Seasons** - Ordinary Time, Advent, Christmas
- **Major Solemnities** - Christmas, Epiphany, Annunciation, etc.

### Liturgical Rankings Included
- **Solemnities** - Christmas, Easter, Immaculate Conception
- **Feasts** - Apostles, Evangelists, major saints
- **Memorials** - Obligatory commemorations
- **Optional Memorials** - Saints that may be celebrated

## 🛠️ Integration Examples

### React Component
```jsx
import { useState, useEffect } from 'react';

function DailyReadings() {
    const [readings, setReadings] = useState(null);
    
    useEffect(() => {
        const today = new Date();
        const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        fetch(`https://cpbjr.github.io/catholic-readings-api/readings/2025/${dateStr}.json`)
            .then(res => res.json())
            .then(data => setReadings(data));
    }, []);
    
    if (!readings) return <div>Loading...</div>;
    
    return (
        <div>
            <h2>Daily Readings - {readings.date}</h2>
            <p><strong>First Reading:</strong> {readings.readings.firstReading}</p>
            <p><strong>Psalm:</strong> {readings.readings.psalm}</p>
            <p><strong>Gospel:</strong> {readings.readings.gospel}</p>
            <a href={readings.usccbLink} target="_blank">Verify on USCCB</a>
        </div>
    );
}
```

### WordPress Plugin
```php
<?php
function catholic_readings_shortcode() {
    $date = date('m-d');
    $url = "https://cpbjr.github.io/catholic-readings-api/readings/2025/{$date}.json";
    
    $response = wp_remote_get($url);
    $readings = json_decode(wp_remote_retrieve_body($response), true);
    
    return '<div class="daily-readings">
        <h3>Today\'s Readings</h3>
        <p><strong>First Reading:</strong> ' . $readings['readings']['firstReading'] . '</p>
        <p><strong>Gospel:</strong> ' . $readings['readings']['gospel'] . '</p>
    </div>';
}
add_shortcode('daily_readings', 'catholic_readings_shortcode');
?>
```

## 📅 Date Format

All endpoints use the format: `MM-DD.json`

Examples:
- January 1: `01-01.json`
- March 17: `03-17.json` (St. Patrick)
- December 25: `12-25.json` (Christmas)

## 🔗 Related Links

- **USCCB Official Readings**: https://bible.usccb.org/
- **Vatican Liturgical Calendar**: https://www.vatican.va/
- **Catholic Resource Library**: https://catholic-resources.org/

## 🤝 Contributing

We welcome contributions from the Catholic developer community!

### How to Contribute
1. **Data Updates** - Submit corrections or additions to readings/saints
2. **New Features** - Suggest additional liturgical data (Liturgy of the Hours, etc.)
3. **Bug Reports** - Report incorrect dates, readings, or saint information
4. **Documentation** - Improve examples, add new language samples

### Liturgical Data Sources
- United States Conference of Catholic Bishops (USCCB)
- Roman Missal, Third Edition
- Roman Martyrology
- General Roman Calendar

### Adding New Years
To add 2026 data:
1. Create `readings/2026/` and `saints/2026/` directories
2. Follow the existing JSON schema
3. Update README with new year coverage
4. Submit a pull request

## 📋 Roadmap

### Future Enhancements
- [ ] **Liturgy of the Hours** - Morning/Evening Prayer
- [ ] **Multiple Languages** - Spanish, French, Portuguese
- [ ] **Liturgical Colors** - Proper colors for each season
- [ ] **Propers** - Collect prayers and readings for Mass
- [ ] **Mobile SDKs** - Native iOS/Android libraries
- [ ] **RSS Feeds** - Daily readings subscription
- [ ] **Webhook Support** - Daily reading notifications

## 🏆 Recognition

Built with ❤️ for the Catholic community worldwide.

**Special Thanks:**
- United States Conference of Catholic Bishops for official readings
- Catholic developers who requested this resource
- GitHub for free hosting via Pages

## 📞 Support

### For Developers
- Create an issue for bug reports or feature requests
- Join discussions about Catholic tech development
- Share your implementations and use cases

### For Parishes & Organizations
- This API is completely free for parish, school, and ministry use
- No registration or API keys required
- Suitable for commercial Catholic apps and websites

## 📜 License

MIT License - Free for all uses, including commercial applications.

See [LICENSE](LICENSE) file for full details.

---

**"Go into all the world and preach the Gospel to every creature."** - Mark 16:15

*Built to serve the New Evangelization through technology.*