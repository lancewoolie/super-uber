// flights.js - Tight 1-2 Lines/Row, Blue Inbound/Orange Outbound, Top-Aligned
const AVIATIONSTACK_KEY = '35ee19955c0c5ad12c6c0b4e34e2a0e6';

async function loadFlights() {
    const container = document.getElementById('flights-list');
    const now = new Date('2025-10-29T12:00:00'); // Oct 29, 2025

    // Realistic BTR samples (tight format)
    const arrivals = [
        { flight: { iata: 'DL5125' }, airline: { name: 'Delta' }, origin: 'ATL', schedTime: new Date('2025-10-29T12:11:00'), status: 'landed' },
        { flight: { iata: 'AA5038' }, airline: { name: 'American' }, origin: 'DFW', schedTime: new Date('2025-10-29T11:21:00'), status: 'landed' },
        { flight: { iata: 'UA4960' }, airline: { name: 'United' }, origin: 'IAH', schedTime: new Date('2025-10-29T14:45:00'), status: 'scheduled' },
        { flight: { iata: 'DL5169' }, airline: { name: 'Delta' }, origin: 'ATL', schedTime: new Date('2025-10-29T18:20:00'), status: 'scheduled' },
        { flight: { iata: 'WN1234' }, airline: { name: 'Southwest' }, origin: 'HOU', schedTime: new Date('2025-10-28T22:30:00'), status: 'landed' },
        { flight: { iata: 'AA1234' }, airline: { name: 'American' }, origin: 'CLT', schedTime: new Date('2025-10-29T09:30:00'), status: 'landed' },
        { flight: { iata: 'UA5678' }, airline: { name: 'United' }, origin: 'ORD', schedTime: new Date('2025-10-29T20:15:00'), status: 'scheduled' }
    ];

    const departures = [
        { flight: { iata: 'DL2315' }, airline: { name: 'Delta' }, dest: 'ATL', schedTime: new Date('2025-10-29T14:00:00'), status: 'landed' },
        { flight: { iata: 'AA3819' }, airline: { name: 'American' }, dest: 'DFW', schedTime: new Date('2025-10-29T16:15:00'), status: 'scheduled' },
        { flight: { iata: 'UA1449' }, airline: { name: 'United' }, dest: 'IAH', schedTime: new Date('2025-10-29T19:30:00'), status: 'scheduled' },
        { flight: { iata: 'WN5678' }, airline: { name: 'Southwest' }, dest: 'HOU', schedTime: new Date('2025-10-29T09:45:00'), status: 'landed' },
        { flight: { iata: 'DL1234' }, airline: { name: 'Delta' }, dest: 'ATL', schedTime: new Date('2025-10-30T06:00:00'), status: 'scheduled' },
        { flight: { iata: 'AA5678' }, airline: { name: 'American' }, dest: 'PHX', schedTime: new Date('2025-10-29T13:20:00'), status: 'landed' },
        { flight: { iata: 'UA9012' }, airline: { name: 'United' }, dest: 'DEN', schedTime: new Date('2025-10-29T17:50:00'), status: 'scheduled' }
    ];

    // Sort latest first
    arrivals.sort((a, b) => b.schedTime - a.schedTime);
    departures.sort((a, b) => b.schedTime - a.schedTime);

    let arrivalsHtml = arrivals.slice(0, 8).map(f => {
        const isOld = f.schedTime < new Date(now.getTime() - 60*60*1000);
        const statusClass = f.status === 'scheduled' ? 'flight-scheduled' : '';
        const className = isOld ? 'flight-old' : 'flight-arrival';
        return `
            <div class="card ${className} ${statusClass}" style="padding: 4px; margin-bottom: 2px; font-size: 11px;">
                <p>${f.flight.iata} ${f.airline.name.slice(0,3)} | ${f.origin}→BTR ${f.schedTime.toLocaleTimeString().slice(0,5)} ${f.status.slice(0,3)}</p>
            </div>
        `;
    }).join('');

    let departuresHtml = departures.slice(0, 8).map(f => {
        const isOld = f.schedTime < new Date(now.getTime() - 60*60*1000);
        const statusClass = f.status === 'scheduled' ? 'flight-scheduled' : '';
        const className = isOld ? 'flight-old' : 'flight-departure';
        return `
            <div class="card ${className} ${statusClass}" style="padding: 4px; margin-bottom: 2px; font-size: 11px;">
                <p>${f.flight.iata} ${f.airline.name.slice(0,3)} | BTR→${f.dest} ${f.schedTime.toLocaleTimeString().slice(0,5)} ${f.status.slice(0,3)}</p>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <h4 style="margin: 0;">Latest Flights (Oct 29, 2025)</h4>
        <div class="column">
            <h5 style="margin: 2px 0;">Inbound</h5>
            ${arrivalsHtml}
        </div>
        <div class="column">
            <h5 style="margin: 2px 0;">Outbound</h5>
            ${departuresHtml}
        </div>
    `;

    console.log('Loaded tight 2-col flights');
    setInterval(loadFlights, 300000);
}
