// Flights Mode: Fetch from AviationStack (75mi radius of BTR: BTR, LFT, MSY)
const AVIATIONSTACK_KEY = '35ee19955c0c5ad12c6c0b4e34e2a0e6'; // Your real key

// Airport distances from BTR (miles) for sorting priority
const AIRPORT_DISTANCES = {
    'BTR': 6,   // Baton Rouge
    'LFT': 51,  // Lafayette
    'MSY': 70   // New Orleans
};

async function loadFlights() {
    const container = document.getElementById('flights-list');
    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading flights (BTR + 75mi radius)...</p>';

    try {
        const airports = ['BTR', 'LFT', 'MSY']; // Closest first by distance
        let allFlights = [];

        // Fetch departures from each (limit 5/airport)
        for (const iata of airports) {
            const response = await fetch(
                `https://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&dep_iata=${iata}&limit=5`
            );
            const data = await response.json();
            if (data.data) {
                // Add distance metadata for sorting
                data.data.forEach(flight => flight._distance = AIRPORT_DISTANCES[iata] || 999);
                allFlights = allFlights.concat(data.data);
            }
        }

        if (allFlights.length > 0) {
            container.innerHTML = '';
            // Sort: Desc by departure time (newest first), then asc by distance (closest airports first)
            allFlights.sort((a, b) => {
                const timeA = new Date(a.departure?.scheduled || 0).getTime();
                const timeB = new Date(b.departure?.scheduled || 0).getTime();
                if (timeB !== timeA) return timeB - timeA; // Desc time
                return (a._distance || 999) - (b._distance || 999); // Asc distance
            });

            allFlights.slice(0, 10).forEach(flight => { // Top 10
                const card = document.createElement('div');
                card.className = 'flight-card';
                const status = flight.flight_status || 'scheduled';
                const statusColor = status === 'active' ? '#00c851' : status.includes('delayed') ? '#ff6b35' : '#cccccc';
                const passengers = flight.aircraft ? (flight.aircraft.capacity || '150') : 'Est. 150';
                const depTime = flight.departure ? new Date(flight.departure.scheduled).toLocaleString() : 'TBD';
                const arrTime = flight.arrival ? new Date(flight.arrival.scheduled).toLocaleString() : 'TBD';
                card.innerHTML = `
                    <h3>${flight.flight.iata || 'N/A'} from ${flight.departure?.iata || 'N/A'} to ${flight.arrival?.iata || 'N/A'}</h3>
                    <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
                    <p><strong>Departure:</strong> ${depTime}</p>
                    <p><strong>Arrival:</strong> ${arrTime}</p>
                    <p><strong>Passengers:</strong> ${passengers} | <strong>Airport Dist:</strong> ${flight._distance}mi</p>
                    <p style="margin-top: 10px;"><a href="https://www.flightaware.com/live/flight/${flight.flight.iata}${flight.departure ? flight.departure.iata : ''}${flight.arrival ? flight.arrival.iata : ''}" style="color: #00c851;" target="_blank">Track on FlightAware</a></p>
                `;
                container.appendChild(card);
            });
            console.log(`Loaded & sorted ${allFlights.length} flights!`);
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
