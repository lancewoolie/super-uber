let map; // Global map instance

function initMap() {
    if (map) return; // Already inited

    // Center on Baton Rouge
    map = L.map('map').setView([30.4515, -91.1871], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Placeholder: Add a marker
    L.marker([30.4515, -91.1871]).addTo(map)
        .bindPopup('Baton Rouge - Traffic loading...');
    
    console.log('Map initialized');
}
