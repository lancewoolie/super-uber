let map; // Global map instance

const TOMTOM_KEY = '4824d68f-e7ef-4e5c-83ba-d95b5126fbe4'; // From your key

async function initMap() {
    if (map) return; // Already inited

    // Center on Baton Rouge
    map = L.map('map').setView([30.4515, -91.1871], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Fetch & Overlay Traffic Incidents (Waze-like: jams, accidents)
    try {
        const response = await fetch(
            `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${TOMTOM_KEY}&point=30.4515,-91.1871&radius=50000` // 50km radius
        );
        const data = await response.json();

        if (data.incidents && data.incidents.length > 0) {
            data.incidents.forEach(incident => {
                const lat = incident.location.point.latitude;
                const lng = incident.location.point.longitude;
                const type = incident.type; // e.g., 'jam', 'accident'
                const color = type === 'jam' ? 'red' : 'orange'; // Heat map sim: red for heavy traffic

                L.circleMarker([lat, lng], {
                    radius: 8,
                    fillColor: color,
                    color: '#000',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map).bindPopup(`<b>${type.toUpperCase()}</b><br/>${incident.description}`);
            });
            console.log(`Loaded ${data.incidents.length} traffic incidents!`);
        } else {
            console.log('No incidents nearby—clear roads!');
        }
    } catch (error) {
        console.error('TomTom fetch error:', error);
        // Fallback marker
        L.marker([30.4515, -91.1871]).addTo(map).bindPopup('Baton Rouge - Traffic API loading...');
    }

    // TODO: Realtime poll every 30s, heat map particles, no-go zones as polygons
}
