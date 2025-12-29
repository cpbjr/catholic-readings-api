// Generate ALL remaining 2025 readings files
const fs = require('fs');
const path = require('path');

// Fallback readings by day of week (from liturgical-readings.c)
const ordinaryTimeReadings = {
  'Monday': {
    firstReading: 'Hebrews 11:32-40',
    psalm: 'Psalm 31:20, 21, 22, 24',
    gospel: 'Mark 5:1-20',
    season: 'Ordinary Time'
  },
  'Tuesday': {
    firstReading: 'Hebrews 12:1-4',
    psalm: 'Psalm 22:26b-27, 28, 30, 31-32',
    gospel: 'Mark 5:21-43',
    season: 'Ordinary Time'
  },
  'Wednesday': {
    firstReading: 'Hebrews 12:4-7, 11-15',
    psalm: 'Psalm 103:1-2, 13-14, 17-18a',
    gospel: 'Mark 6:1-6',
    season: 'Ordinary Time'
  },
  'Thursday': {
    firstReading: 'Hebrews 12:18-19, 21-24',
    psalm: 'Psalm 48:2-3ab, 3cd-4, 9, 10-11',
    gospel: 'Mark 6:7-13',
    season: 'Ordinary Time'
  },
  'Friday': {
    firstReading: 'Hebrews 13:1-8',
    psalm: 'Psalm 27:1, 3, 5, 8b-9abc',
    gospel: 'Mark 6:14-29',
    season: 'Ordinary Time'
  },
  'Saturday': {
    firstReading: 'Hebrews 13:15-17, 20-21',
    psalm: 'Psalm 23:1-3a, 3b-4, 5, 6',
    gospel: 'Mark 6:30-34',
    season: 'Ordinary Time'
  },
  'Sunday': {
    firstReading: 'Isaiah 55:10-11',
    psalm: 'Psalm 65:10, 11, 12-13, 14',
    secondReading: 'Romans 8:18-23',
    gospel: 'Matthew 13:1-23',
    season: 'Ordinary Time'
  }
};

// Advent readings for December (simple fallback)
const adventReadings = {
  'Monday': {
    firstReading: 'Isaiah 2:1-5',
    psalm: 'Psalm 122:1-2, 3-4b, 4cd-5, 6-7, 8-9',
    gospel: 'Matthew 8:5-11',
    season: 'Advent'
  },
  'Tuesday': {
    firstReading: 'Isaiah 11:1-10',
    psalm: 'Psalm 72:1-2, 7-8, 12-13, 17',
    gospel: 'Luke 10:21-24',
    season: 'Advent'
  },
  'Wednesday': {
    firstReading: 'Isaiah 25:6-10a',
    psalm: 'Psalm 23:1-3a, 3b-4, 5, 6',
    gospel: 'Matthew 15:29-37',
    season: 'Advent'
  },
  'Thursday': {
    firstReading: 'Isaiah 26:1-6',
    psalm: 'Psalm 118:1 and 8-9, 19-21, 25-27a',
    gospel: 'Matthew 7:21, 24-27',
    season: 'Advent'
  },
  'Friday': {
    firstReading: 'Isaiah 29:17-24',
    psalm: 'Psalm 27:1, 4, 13-14',
    gospel: 'Matthew 9:27-31',
    season: 'Advent'
  },
  'Saturday': {
    firstReading: 'Isaiah 30:19-21, 23-26',
    psalm: 'Psalm 147:1-2, 3-4, 5-6',
    gospel: 'Matthew 9:35-10:1, 5a, 6-8',
    season: 'Advent'
  },
  'Sunday': {
    firstReading: 'Isaiah 35:1-6a, 10',
    psalm: 'Psalm 146:6-7, 8-9, 9-10',
    secondReading: 'James 5:7-10',
    gospel: 'Matthew 11:2-11',
    season: 'Advent'
  }
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const outputDir = path.join(__dirname, '..', 'readings', '2025');

// Dates to generate
const datesToGenerate = [
  // November 3-30 (skip 1, 2 which exist)
  ...Array.from({ length: 28 }, (_, i) => new Date(2025, 10, i + 3)),
  // December 2-7 (skip 1, 8 which exist)
  ...Array.from({ length: 6 }, (_, i) => new Date(2025, 11, i + 2)),
  // December 9-24 (skip 8, 25 which exist)
  ...Array.from({ length: 16 }, (_, i) => new Date(2025, 11, i + 9)),
  // December 26-30 (skip 25, 31 which exist)
  ...Array.from({ length: 5 }, (_, i) => new Date(2025, 11, i + 26))
];

let generated = 0;

datesToGenerate.forEach(date => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dayOfWeek = dayNames[date.getDay()];

  // Use Advent readings for December, Ordinary Time for November
  const readingsSource = date.getMonth() === 11 ? adventReadings : ordinaryTimeReadings;
  const readings = readingsSource[dayOfWeek];

  const fileContent = {
    date: `2025-${month}-${day}`,
    monthDay: `${date.getMonth() + 1}/${date.getDate()}`,
    season: readings.season,
    readings: {
      firstReading: readings.firstReading,
      psalm: readings.psalm,
      ...(readings.secondReading && { secondReading: readings.secondReading }),
      gospel: readings.gospel
    },
    usccbLink: `https://bible.usccb.org/bible/readings/${month}${day}25.cfm`,
    apiEndpoint: `https://cpbjr.github.io/catholic-readings-api/readings/2025/${month}-${day}.json`
  };

  const filename = path.join(outputDir, `${month}-${day}.json`);

  // Only create if doesn't exist
  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, JSON.stringify(fileContent, null, 2));
    console.log(`Created: ${month}-${day}.json (${dayOfWeek} - ${readings.season})`);
    generated++;
  }
});

console.log(`\n✅ Generated ${generated} new readings files!`);
console.log(`📊 Total readings files: ${fs.readdirSync(outputDir).length}`);
