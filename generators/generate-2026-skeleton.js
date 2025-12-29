const fs = require('fs');
const path = require('path');
const Romcal = require('romcal');

const outputDir = path.join(__dirname, '..', 'liturgical-calendar', '2026');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generate() {
    console.log('Generating 2026 skeleton...');

    // romcal 1.3.0 uses calendarFor
    const events = Romcal.calendarFor(2026);

    console.log(`Retrieved ${events.length} events from romcal.`);

    events.forEach(event => {
        // romcal 1.3.0 event structure:
        // {
        //   key: 'mary_mother_of_god',
        //   name: 'Mary, Mother of God',
        //   type: 'SOLEMNITY',
        //   moment: moment object,
        //   color: 'white',
        //   ...
        // }

        // Convert moment to ISO date string (romcal 1.3.0 moment strings)
        const date = new Date(event.moment);
        const dateStr = date.toISOString().split('T')[0];
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const monthDay = `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;

        const filename = path.join(outputDir, `${month}-${day}.json`);

        const celebration = {
            date: dateStr,
            monthDay: monthDay,
            season: event.data.season.value,
            celebration: {
                name: event.name,
                type: event.type,
                // Optional fields could be added here if available in romcal or docx
                quote: "",
                description: ""
            },
            apiEndpoint: `https://cpbjr.github.io/catholic-readings-api/liturgical-calendar/2026/${month}-${day}.json`
        };

        // If multiple events on same day, this will overwrite. 
        // In our case, we usually want the highest ranking one.
        // romcal usually sorts by precedence or we can check rank.
        // For now, simple overwrite (highest rank usually comes last or is already filtered).
        fs.writeFileSync(filename, JSON.stringify(celebration, null, 2));
    });

    console.log('2026 skeleton generation complete!');
}

generate().catch(console.error);
