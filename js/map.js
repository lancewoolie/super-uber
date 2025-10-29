// map.js - Updated for Oct 29, 2025 + Decorative Overlay Mode

let map; // Global map instance
let trafficLayer; // For flow tiles
let crimeLayer; // For NO GO clouds
let hotspotLayer; // For Uber hotspots
const TOMTOM_KEY = '4824d68f-e7ef-4e5c-83ba-d95b5126fbe4'; // From your key
const UBER_SERVER_TOKEN = 'Qdh65B2Q1rMmpScsl5YkV8jbQaa060rGFllZK0_n'; // For hotspots

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

    // Layers groups
    crimeLayer = L.layerGroup().addTo(map);
    hotspotLayer = L.layerGroup().addTo(map);

    // Load initial data + poll
    loadTrafficClouds();
    loadNoGoZones();
    loadUberHotspots();
    setInterval(() => { loadTrafficClouds(); loadNoGoZones(); }, 60000); // 60s poll for traffic & no-go

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

    async function loadTrafficClouds() {
        try {
            // Fetch incidents for intensity
            const response = await fetch(
                `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${TOMTOM_KEY}&point=30.4515,-91.1871&radius=75000&unit=mi`
            );
            const data = await response.json();

            // Clear old clouds
            if (trafficLayer) {
                // Note: trafficLayer is tileLayer; for custom clouds, use separate group
                const cloudGroup = L.layerGroup().addTo(map);
                if (data.incidents && data.incidents.length > 0) {
                    // Aggregate into "clouds": Cluster by lat/lng (use Turf for density)
                    const points = data.incidents.map(inc => [inc.geometry.point.latitude, inc.geometry.point.longitude, inc.type === 'jam' ? 2 : 1]); // Weight by severity
                    const intensity = turf.density(turf.featureCollection(points.map(p => turf.point([p[1], p[0]], {weight: p[2]}))), {gridSize: 0.01}); // 2D heat

                    intensity.features.forEach(feature => {
                        const [lat, lng] = feature.geometry.coordinates;
                        const weight = feature.properties.density || 0;
                        if (weight > 0.5) { // Threshold for cloud
                            L.circle([lat, lng], {
                                radius: weight * 500, // Volumetric size
                                fillColor: 'red',
                                color: 'darkred',
                                weight: 1,
                                opacity: 0.3,
                                fillOpacity: weight * 0.6 // Alpha for cloud "volume"
                            }).addTo(cloudGroup).bindPopup(`High Traffic Cloud (Intensity: ${weight.toFixed(2)})`);
                        }
                    });
                    console.log(`Loaded ${data.incidents.length} traffic clouds!`);
                }
            }
        } catch (error) {
            console.error('TomTom error:', error);
            L.marker([30.4515, -91.1871]).addTo(map).bindPopup('Traffic loading...');
        }
    }

    async function loadNoGoZones() {
        try {
            // Fetch violent crimes past year from Open Data BR API - Updated dates
            const crimeRes = await fetch('https://data.brla.gov/resource/6zc2-imdr.json?$where=offense_category in (\'Homicide\',\'Aggravated Assault\',\'Robbery\') AND incident_datetime between \'2024-10-29\' and \'2025-10-29\'&$select=latitude,longitude,offense_category&$limit=5000');
            const crimes = await crimeRes.json();

            // Clear old
            crimeLayer.clearLayers();

            if (crimes.length > 0) {
                // Cluster into zones (Turf dbscan for "clouds")
                const points = crimes.map(c => turf.point([c.longitude, c.latitude]));
                const clustered = turf.clustersDbscan(turf.featureCollection(points), 0.01, 3); // 0.01 deg (~1km), min 3 points

                clustered.features.forEach(feature => {
                    if (feature.properties.cluster_id !== undefined) { // Valid cluster
                        const bbox = turf.bbox(feature);
                        L.polygon([[[bbox[1], bbox[0]], [bbox[1], bbox[2]], [bbox[3], bbox[2]], [bbox[3], bbox[0]]]], {
                            fillColor: 'black',
                            color: 'darkred',
                            weight: 2,
                            opacity: 0.8,
                            fillOpacity: 0.4 // Dark cloud
                        }).addTo(crimeLayer).bindPopup(`NO GO Zone: ${feature.properties.cluster_id} crimes (e.g., ${crimes[0].offense_category})`);
                    }
                });
                console.log(`Loaded ${crimes.length} crime-based NO GO clouds!`);
            }
        } catch (error) {
            console.error('Crime API error:', error);
        }
    }

    async function loadUberHotspots() {
        try {
            // Infer from recent trips (your token)
            const tripsRes = await fetch('https://api.uber.com/v1/partners/trips?limit=100&status=completed', {
                headers: { 'Authorization': `Bearer ${UBER_SERVER_TOKEN}` }
            });
            const tripsData = await tripsRes.json();

            // Clear old
            hotspotLayer.clearLayers();

            if (tripsData.trips && tripsData.trips.length > 0) {
                // Cluster trip origins for hotspots
                const points = tripsData.trips.map(t => turf.point([t.pickup_longitude, t.pickup_latitude]));
                const clustered = turf.clustersDbscan(turf.featureCollection(points), 0.005, 5); // Tight clusters for hotspots

                clustered.features.forEach(feature => {
                    if (feature.properties.cluster_id !== undefined) {
                        const [lat, lng] = feature.geometry.coordinates;
                        L.circleMarker([lat, lng], {
                            radius: 15,
                            fillColor: 'green',
                            color: 'lime',
                            weight: 3,
                            opacity: 1,
                            fillOpacity: 0.7
                        }).addTo(hotspotLayer).bindPopup(`Uber Hotspot: ${feature.properties.cluster_id} trips`);
                    }
                });
                console.log(`Loaded Uber hotspots from ${tripsData.trips.length} trips!`);
            } else {
                // Fallback Baton Rouge hotspots (from forums: Perkins Rd, LSU)
                const fallbackHotspots = [
                    [30.4100, -91.1800], // LSU area
                    [30.4000, -91.1500]  // Perkins Rd
                ];
                fallbackHotspots.forEach(([lat, lng]) => {
                    L.circleMarker([lat, lng], {
                        radius: 20,
                        fillColor: 'green',
                        color: 'lime',
                        weight: 3,
                        opacity: 1,
                        fillOpacity: 0.5
                    }).addTo(hotspotLayer).bindPopup('Known Uber Hotspot (Fallback)');
                });
            }
        } catch (error) {
            console.error('Uber hotspots error:', error);
        }
    }

    // TODO: Animate clouds (e.g., CSS pulse on hotspots) - Low priority for decorative mode
}
