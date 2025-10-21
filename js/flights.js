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
    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading flights (BTR + 75mi radius)...</p>';

    try {
        const airports = ['BTR', 'LFT', 'MSY']; // BTR first
        let allFlights = [];
        const now = new Date('2025-10-21'); // Current: Oct 21, 2025
        const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000); // Filter threshold
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // End of today for "no today" check

        // Fetch recent departures from each (limit 10/airport for broader pool)
        for (const iata of airports) {
            const response = await fetch(
                `https://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&dep_iata=${iata}&limit=10`
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

        // Filter & classify: All flights, but tag old/active
        const classifiedFlights = allFlights.map(flight => ({
            ...flight,
            isActive: flight._depTime >= threeHoursAgo,
            isToday: flight._depTime < todayEnd,
            isTomorrow: !flight.isToday && flight._depTime.getDate() === now.getDate() + 1 // First tomorrow
        }));

        // If no today flights, fetch first tomorrow (BTR priority)
        let tomorrowFlight = null;
        if (classifiedFlights.every(f => !f.isToday)) {
            const tomorrowRes = await fetch(
                `https://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&dep_iata=BTR&departure_date=2025-10-22&flight_status=scheduled&limit=1`
            );
            const tomorrowData = await tomorrowRes.json();
            if (tomorrowData.data && tomorrowData.data.length > 0) {
                tomorrowFlight = { ...tomorrowData.data[0], _distance: 0, _depTime: new Date(tomorrowData.data[0].departure?.scheduled || 0), isTomorrow: true };
                classifiedFlights.unshift(tomorrowFlight); // Prepend as first
            }
        }

        if (classifiedFlights.length > 0) {
            container.innerHTML = '';
            // Sort: Desc by dep time (newest first), then asc by distance (BTR first)
            classifiedFlights.sort((a, b) => {
                if (b._depTime.getTime() !== a._depTime.getTime()) return b._depTime.getTime() - a._depTime.getTime();
                return a._distance - b._distance;
            });

            classifiedFlights.slice(0, 10).forEach(flight => { // Top 10
                const status = flight.flight_status || 'scheduled';
                // Status colors (default light grey-white)
                let statusColor = '#f0f0f0'; // Grey-white
                if (status === 'cancelled') statusColor = '#ff0000'; // Red
                else if (status.includes('delayed')) statusColor = '#ff6b35'; // Orange
                else if (status === 'scheduled') statusColor = '#add8e6'; // Light blue
                else if (status === 'landed' && flight._depTime >= new Date(now.getTime() - 60 * 60 * 1000)) statusColor = '#00ff00'; // Neon green for recent land
                const passengers = flight.aircraft ? (flight.aircraft.capacity || '150') : 'Est. 150';
                const depTime = flight.departure ? new Date(flight.departure.scheduled).toLocaleString() : 'TBD';
                const arrTime = flight.arrival ? new Date(flight.arrival.scheduled).toLocaleString() : 'TBD';
                const depIata = flight.departure ? `<span style="color: yellow;">${flight.departure.iata}</span>` : 'N/A';
                const arrIata = flight.arrival ? `<span style="color: yellow;">${flight.arrival.iata}</span>` : 'N/A';
                const flightNum = flight.flight ? `<span style="color: cyan;">${flight.flight.iata}</span>` : 'N/A';
                const isOld = !flight.isActive;
                const isArriving = flight.arrival?.iata === 'BTR'; // Home arrival
                const isDeparting = !isArriving; // Default departing
                const cardClass = isOld ? 'flight-card old-flight' : `flight-card ${isArriving ? 'arriving-flight' : 'departing-flight'}`;
                const card = document.createElement('div');
                card.className = cardClass;
                card.innerHTML = `
                    <h3>${depIata} to ${arrIata} ${flightNum}</h3>
                    <p><strong style="color: ${isArriving ? '#ffffff' : '#ffffff'};">${isArriving ? 'Arriving to BTR' : `Departing from ${depIata}`}:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
                    <p><strong style="color: ${isArriving ? '#ffffff' : '#ffffff'};">Departure:</strong> <strong style="color: cyan;">${depTime}</strong></p>
                    <p><strong style="color: ${isArriving ? '#ffffff' : '#ffffff'};">Arrival:</strong> <strong style="color: #00c851;">${arrTime}</strong></p>
                    <p><strong style="color: orange; font-size: 1.1em;">Passengers:</strong> <span style="color: orange; font-size: 1.1em;">${passengers}</span> | <strong style="color: orange; font-size: 1.1em;">Airport Dist:</strong> <span style="color: orange; font-size: 1.1em;">${flight._distance}mi</span></p>
                    <p style="margin-top: 10px; grid-column: 1 / -1;"><a href="https://www.flightaware.com/live/flight/${flight.flight.iata}${flight.departure ? flight.departure.iata : ''}${flight.arrival ? flight.arrival.iata : ''}" style="color: #00c851;" target="_blank">Track on FlightAware</a></p>
                `;
                container.appendChild(card);
            });
            console.log(`Loaded ${classifiedFlights.length} flights (active/old/tomorrow)!`);
        } else {
            // Truly no flights: Top center tan message
            container.innerHTML = '<p style="text-align: center; color: tan; font-size: 1.2em; margin-top: 50px;">No recent flights (last 3hrs)—try peak hours!</p>';
        }
    } catch (error) {
        console.error('AviationStack error:', error);
        container.innerHTML = '<div class="flight-card"><p>Error loading flights—check console (key valid?).</p></div>';
    }
}

// Auto-load on mode enter (from app.js)
// TODO: Add arrivals toggle, poll every 5 mins for updates
