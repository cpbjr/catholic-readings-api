const Romcal = require('romcal');

const romcal = new Romcal();

async function explore() {
    const events = await romcal.generateCalendar(2026);
    console.log(JSON.stringify(events.slice(0, 5), null, 2));
}

explore();
