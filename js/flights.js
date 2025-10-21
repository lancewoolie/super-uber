// Flights Mode: Fetch from AviationStack (75mi radius of BTR: BTR first, then LFT, MSY)
const AVIATIONSTACK_KEY = '35ee19955c0c5ad12c6c0b4e34e2a0e6'; // Your real key

// Airport distances from BTR (miles) for sorting priority
const AIRPORT_DISTANCES = {
    'BTR': 0,   // Baton Rouge (prioritized as 0)
    'LFT': 51,  // Lafayette
    'MSY': 70   // New Orleans
};

async function loadFlights() {
    const container = document.getElementById('flights-list');
    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading recent flights (BTR + 75mi radius, last 3hrs)...</p>';

    try {
        const airports = ['BTR', 'LFT', 'MSY']; // BTR first
        let allFlights = [];
        const now = new Date(); // Current: Oct 21, 2025
        const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000); // Filter threshold

        // Fetch departures from each (limit 5/airport)
        for (const iata of airports) {
            const response = await fetch(
                `https://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&dep_iata=${iata}&limit=5`
            );
            const data = await response.json();
            if (data.data) {
                // Add metadata
                data.data.forEach(flight => {
                    flight._distance = AIRPORT_DISTANCES[iata] || 999;
                    flight._depTime = new Date(flight.departure?.scheduled || 0);
                });
                allFlights = allFlights.concat(data.data);
            }
        }

        // Filter: Only flights with dep scheduled within last 3hrs
        const recentFlights = allFlights.filter(flight => flight._depTime >= threeHoursAgo);

        if (recentFlights.length > 0) {
            container.innerHTML = '';
            // Sort: Desc by dep time (newest first), then asc by distance (BTR first)
            recentFlights.sort((a, b) => {
                if (b._depTime.getTime() !== a._depTime.getTime()) return b._depTime.getTime() - a._depTime.getTime();
                return a._distance - b._distance;
            });

            recentFlights.slice(0, 10).forEach(flight => { // Top 10 recent
                const status = flight.flight_status || 'scheduled';
                // Status colors
                let statusColor = '#cccccc'; // Default gray
                if (status === 'cancelled') statusColor = '#ff0000'; // Red
                else if (status.includes('delayed')) statusColor = '#ff6b35'; // Orange
                else if (status === 'scheduled') statusColor = '#add8e6'; // Light blue
                else if (status === 'landed' && flight._depTime >= new Date(now.getTime() - 60 * 60 * 1000)) statusColor = '#00ff00'; // Neon green for recent land
                const passengers = flight.aircraft ? (flight.aircraft.capacity || '150') : 'Est. 150';
                const depTime = flight.departure ? new Date(flight.departure.scheduled).toLocaleString() : 'TBD';
                const arrTime = flight.arrival ? new Date(flight.arrival.scheduled).toLocaleString() : 'TBD';
                const depIata = flight.departure ? `<span style="color: yellow;">${flight.departure.iata}</span>` : 'N/A';
                const arrIata = flight.arrival ? `<span style="color: yellow;">${flight.arrival.iata}</span>` : 'N/A';
                const card = document.createElement('div');
                card.className = 'flight-card';
                card.innerHTML = `
                    <h3>${flight.flight.iata || 'N/A'} from ${depIata} to ${arrIata}</h3>
                    <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
                    <p><strong>Departure:</strong> <strong>${depTime}</strong></p>
                    <p><strong>Arrival:</strong> <strong>${arrTime}</strong></p>
                    <p><strong>Passengers:</strong> ${passengers} | <strong>Airport Dist:</strong> ${flight._distance}mi</p>
                    <p style="margin-top: 10px; grid-column: 1 / -1;"><a href="https://www.flightaware.com/live/flight/${flight.flight.iata}${flight.departure ? flight.departure.iata : ''}${flight.arrival ? flight.arrival.iata : ''}" style="color: #00c851;" target="_blank">Track on FlightAware</a></p>
                `;
                container.appendChild(card);
            });
            console.log(`Loaded & filtered ${recentFlights.length} recent flights!`);
        } else {
            container.innerHTML = '<div class="flight-card"><p>No recent flights (last 3hrs)—try peak hours!</p></div>';
        }
    } catch (error) {
        console.error('AviationStack error:', error);
        container.innerHTML = '<div class="flight-card"><p>Error loading flights—check console (key valid?).</p></div>';
    }
}

// Auto-load on mode enter (from app.js)
// TODO: Add arrivals toggle, poll every 5 mins for updates
