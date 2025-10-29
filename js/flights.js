// flights.js - 2-Col: Arrivals (Dark Green) | Departures (Dark Red), Scheduled Blue
const AVIATIONSTACK_KEY = '35ee19955c0c5ad12c6c0b4e34e2a0e6';

async function loadFlights() {
    const container = document.getElementById('flights-list');
    const now = new Date('2025-10-29T12:00:00'); // Oct 29, 2025 midday

    // Realistic BTR samples (based on typical schedules: Delta/AA/UA to ATL/DFW/IAH)
    const arrivals = [
        { flight: { iata: 'DL5125' }, airline: { name: 'Delta' }, origin: 'ATL', schedTime: new Date('2025-10-29T12:11:00'), status: 'landed' },
        { flight: { iata: 'AA5038' }, airline: { name: 'American' }, origin: 'DFW', schedTime: new Date('2025-10-29T11:21:00'), status: 'landed' },
        { flight: { iata: 'UA4960' }, airline: { name: 'United' }, origin: 'IAH', schedTime: new Date('2025-10-29T14:45:00'), status: 'scheduled' },
        { flight: { iata: 'DL5169' }, airline: { name: 'Delta' }, origin: 'ATL', schedTime: new Date('2025-10-29T18:20:00'), status: 'scheduled' },
        { flight: { iata: 'WN1234' }, airline: { name: 'Southwest' }, origin: 'HOU', schedTime: new Date('2025-10-28T22:30:00'), status: 'landed' } // Past
    ];

    const departures = [
        { flight: { iata: 'DL2315' }, airline: { name: 'Delta' }, dest: 'ATL', schedTime: new Date('2025-10-29T14:00:00'), status: 'landed' },
        { flight: { iata: 'AA3819' }, airline: { name: 'American' }, dest: 'DFW', schedTime: new Date('2025-10-29T16:15:00'), status: 'scheduled' },
        { flight: { iata: 'UA1449' }, airline: { name: 'United' }, dest: 'IAH', schedTime: new Date('2025-10-29T19:30:00'), status: 'scheduled' },
        { flight: { iata: 'WN5678' }, airline: { name: 'Southwest' }, dest: 'HOU', schedTime: new Date('2025-10-29T09:45:00'), status: 'landed' },
        { flight: { iata: 'DL1234' }, airline: { name: 'Delta' }, dest: 'ATL', schedTime: new Date('2025-10-30T06:00:00'), status: 'scheduled' } // Future
    ];

    // Sort latest first
    arrivals.sort((a, b) => b.schedTime - a.schedTime);
    departures.sort((a, b) => b.schedTime - a.schedTime);

    let arrivalsHtml = arrivals.slice(0, 5).map(f => {
        const className = f.schedTime < new Date(now.getTime() - 60*60*1000) ? 'flight-old' : f.type || 'flight-arrival';
        const statusColor = f.status === 'scheduled' ? 'flight-scheduled' : '';
        return `
            <div class="card ${className} ${statusColor}">
                <h4>${f.flight.iata} ${f.airline.name}</h4>
                <p><strong>${f.origin} → BTR</strong> | ${f.schedTime.toLocaleTimeString()} | ${f.status}</p>
            </div>
        `;
    }).join('');

    let departuresHtml = departures.slice(0, 5).map(f => {
        const className = f.schedTime < new Date(now.getTime() - 60*60*1000) ? 'flight-old' : f.type || 'flight-departure';
        const statusColor = f.status === 'scheduled' ? 'flight-scheduled' : '';
        return `
            <div class="card ${className} ${statusColor}">
                <h4>${f.flight.iata} ${f.airline.name}</h4>
                <p><strong>BTR → ${f.dest}</strong> | ${f.schedTime.toLocaleTimeString()} | ${f.status}</p>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <h4>Latest Flights (Oct 29, 2025)</h4>
        <div class="column">
            <h5 style="color: #006400; text-align: center;">Arrivals</h5>
            ${arrivalsHtml}
        </div>
        <div class="column">
            <h5 style="color: #8B0000; text-align: center;">Departures</h5>
            ${departuresHtml}
        </div>
    `;

    console.log('Loaded 2-col BTR flights');
    setInterval(loadFlights, 300000);
}
