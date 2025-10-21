// Flights Mode: Fetch from AviationStack (BTR + 75mi Airports)
const AVIATIONSTACK_KEY = '35ee19955c0c5ad12c6c0b4e34e2a0e6'; // Your real key

async function loadFlights() {
    const container = document.getElementById('flights-list');
    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading flights (BTR, MSY)...</p>';

    try {
        // Fetch departures from BTR + arrivals to BTR/MSY (limit 10 total)
        const airports = ['BTR', 'MSY']; // Baton Rouge + New Orleans (~70mi)
        let allFlights = [];

        for (const iata of airports) {
            const response = await fetch(
                `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&dep_iata=${iata}&limit=5`
            );
            const data = await response.json();
            if (data.data) allFlights = allFlights.concat(data.data);
        }

        if (allFlights.length > 0) {
            container.innerHTML = '';
            allFlights.slice(0, 10).forEach(flight => { // Top 10
                const card = document.createElement('div');
                card.className = 'flight-card';
                const status = flight.flight_status || 'scheduled';
                const statusColor = status === 'active' ? '#00c851' : status.includes('delayed') ? '#ff6b35' : '#cccccc';
                const passengers = flight.aircraft ? (flight.aircraft.capacity || '150') : 'Est. 150';
                card.innerHTML = `
                    <h3>${flight.flight.iata || 'N/A'} to ${flight.arrival.iata || 'N/A'}</h3>
                    <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
                    <p><strong>Departure:</strong> ${flight.departure ? new Date(flight.departure.scheduled).toLocaleString() : 'TBD'}</p>
                    <p><strong>Arrival:</strong> ${flight.arrival ? new Date(flight.arrival.scheduled).toLocaleString() : 'TBD'}</p>
                    <p><strong>Passengers:</strong> ${passengers}</p>
                    <p style="margin-top: 10px;"><a href="https://www.flightaware.com/live/flight/${flight.flight.iata}${flight.departure ? flight.departure.iata : ''}${flight.arrival ? flight.arrival.iata : ''}" style="color: #00c851;" target="_blank">Track on FlightAware</a></p>
                `;
                container.appendChild(card);
            });
            console.log(`Loaded ${allFlights.length} flights!`);
        } else {
            container.innerHTML = '<div class="flight-card"><p>No flights right now—try during peak hours (e.g., evenings)!</p></div>';
        }
    } catch (error) {
        console.error('AviationStack error:', error);
        container.innerHTML = '<div class="flight-card"><p>Error loading flights—check console (key valid?).</p></div>';
    }
}

// Auto-load on mode enter (from app.js)
// TODO: Add arrivals toggle, poll every 5 mins for updates
