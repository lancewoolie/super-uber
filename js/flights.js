// flights.js - Fixed: Past 24h + Future 24h, Colors by Time/Type
const AVIATIONSTACK_KEY = '35ee19955c0c5ad12c6c0b4e34e2a0e6';

async function loadFlights() {
    const container = document.getElementById('flights-list');
    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading Flights ±24h...</p>';

    try {
        const now = new Date('2025-10-29T12:00:00'); // Midday for demo
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const dayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const airports = ['BTR', 'LFT', 'MSY'];

        let allFlights = [];

        // Past 24h: Historical via /flights with flight_date
        const pastDates = ['2025-10-28', '2025-10-29']; // Last 2 days for coverage
        for (const date of pastDates) {
            for (const iata of airports) {
                // Arrivals
                const arrRes = await fetch(
                    `https://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&arr_iata=${iata}&flight_date=${date}&limit=5`
                );
                const arrData = await arrRes.json();
                if (arrData.data) allFlights = allFlights.concat(arrData.data.map(f => ({...f, type: 'arrival', airport: iata})));

                // Departures
                const depRes = await fetch(
                    `https://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&dep_iata=${iata}&flight_date=${date}&limit=5`
                );
                const depData = await depRes.json();
                if (depData.data) allFlights = allFlights.concat(depData.data.map(f => ({...f, type: 'departure', airport: iata})));
            }
        }

        // Future 24h: Scheduled via /flightsFuture
        const futureDates = ['2025-10-29', '2025-10-30'];
        for (const date of futureDates) {
            // Arrivals BTR focus
            const futureArrRes = await fetch(
                `https://api.aviationstack.com/v1/flightsFuture?access_key=${AVIATIONSTACK_KEY}&iataCode=BTR&type=arrival&date=${date}&limit=5`
            );
            const futureArrData = await futureArrRes.json();
            if (futureArrData.data) allFlights = allFlights.concat(futureArrData.data.map(f => ({...f, type: 'arrival', airport: 'BTR'})));

            // Departures BTR
            const futureDepRes = await fetch(
                `https://api.aviationstack.com/v1/flightsFuture?access_key=${AVIATIONSTACK_KEY}&iataCode=BTR&type=departure&date=${date}&limit=5`
            );
            const futureDepData = await futureDepRes.json();
            if (futureDepData.data) allFlights = allFlights.concat(futureDepData.data.map(f => ({...f, type: 'departure', airport: 'BTR'})));
        }

        if (allFlights.length > 0) {
            // Sort by scheduled time desc
            allFlights.forEach(f => {
                f._schedTime = new Date(f.departure?.scheduled || f.arrival?.scheduled || now);
                f._isOld = f._schedTime < new Date(now.getTime() - 60 * 60 * 1000); // >1h old
            });
            allFlights.sort((a, b) => b._schedTime - a._schedTime);

            let html = '';
            allFlights.slice(0, 10).forEach(flight => {
                const status = flight.flight_status || 'scheduled';
                const timeStr = flight._schedTime.toLocaleString();
                const className = flight._isOld ? 'flight-old' : flight.type === 'arrival' ? 'flight-arrival' : 'flight-departure';
                const icon = flight.type === 'arrival' ? '→' : '←';
                html += `
                    <div class="card ${className}">
                        <h4>${flight.flight?.iata} ${icon} ${flight.airline?.name || ''} (${flight.airport})</h4>
                        <p><strong>${status.toUpperCase()}:</strong> ${timeStr}</p>
                        <p>From/To: ${flight.departure?.iata || ''} - ${flight.arrival?.iata || ''}</p>
                    </div>
                `;
            });
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p style="text-align: center; color: tan;">No flights ±24h—quiet skies!</p>';
        }
    } catch (error) {
        console.error('Flights error:', error);
        container.innerHTML = '<div class="card"><p>Error loading—API limits? Check console.</p></div>';
    }

    setInterval(loadFlights, 300000); // 5min
}
