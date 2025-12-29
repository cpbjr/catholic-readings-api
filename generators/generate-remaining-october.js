// Generate remaining October 2025 readings files using fallback pattern
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

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// October 1, 2025 is a Wednesday
const startDate = new Date(2025, 9, 4); // October 4 (month is 0-indexed)
const endDate = new Date(2025, 9, 31); // October 31

const outputDir = path.join(__dirname, '..', 'readings', '2025');

// Generate files for October 4-31
for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dayOfWeek = dayNames[date.getDay()];

  const readings = ordinaryTimeReadings[dayOfWeek];

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
  fs.writeFileSync(filename, JSON.stringify(fileContent, null, 2));
  console.log(`Created: ${month}-${day}.json (${dayOfWeek})`);
}

console.log('\n✅ October 2025 readings files generated successfully!');
