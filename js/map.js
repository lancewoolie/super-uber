let map; // Global map instance
let trafficLayer; // For flow tiles
const TOMTOM_KEY = '4824d68f-e7ef-4e5c-83ba-d95b5126fbe4'; // From your key

async function initMap() {
    if (map) return; // Already inited

    // Center on Baton Rouge
    map = L.map('map').setView([30.4515, -91.1871], 12);

    // Base tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add traffic flow layer (color-coded: green=free, yellow=moderate, red=heavy)
    trafficLayer = L.tileLayer('https://api.tomtom.com/map/1/tile/flow/relative/ec/{z}/{x}/{y}.png?key=' + TOMTOM_KEY + '&tilesize=256&format=png&zoomlevels=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22', {
        attribution: 'TomTom Traffic',
        opacity: 0.7
    }).addTo(map);

    // Fetch & Overlay Traffic Incidents (Waze-like: jams, accidents) + poll
    loadIncidents();
    setInterval(loadIncidents, 60000); // Poll every 60s for live

    async function loadIncidents() {
        try {
            const response = await fetch(
                `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${TOMTOM_KEY}&point=30.4515,-91.1871&radius=75000&unit=mi` // 75mi radius, miles
            );
            const data = await response.json();

            // Clear old markers
            map.eachLayer(layer => {
                if (layer instanceof L.CircleMarker) map.removeLayer(layer);
            });

            if (data.incidents && data.incidents.length > 0) {
                data.incidents.forEach(incident => {
                    const lat = incident.geometry.point.latitude;
                    const lng = incident.geometry.point.longitude;
                    const type = incident.type; // e.g., 'jam', 'accident'
                    const color = type === 'jam' ? 'red' : type === 'accident' ? 'orange' : 'yellow';
                    const severity = incident.roadClosure || incident.length ? 'High' : 'Low';

                    L.circleMarker([lat, lng], {
                        radius: 10,
                        fillColor: color,
                        color: '#000',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map).bindPopup(`<b>${type.toUpperCase()} (${severity})</b><br/>${incident.description || 'Details unavailable'}<br/>Length: ${incident.length || 'N/A'}mi`);
                });
                console.log(`Loaded ${data.incidents.length} live incidents!`);
            } else if (!trafficLayer) {
                console.log('No incidents; traffic flow active for levels.');
            }
        } catch (error) {
            console.error('TomTom fetch error:', error);
            // Enhanced fallback: Static marker + log
            L.marker([30.4515, -91.1871]).addTo(map).bindPopup('Baton Rouge - Traffic API limited; flow layer active for realtime levels.');
        }
    }

    // TODO: Realtime poll every 30s, heat map particles, no-go zones as polygons
}
