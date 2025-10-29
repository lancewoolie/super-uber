// map.js - Full-Screen BG Init (Unchanged Core, Just Full Size)
let map;
const TOMTOM_KEY = '4824d68f-e7ef-4e5c-83ba-d95b5126fbe4';
const UBER_SERVER_TOKEN = 'Qdh65B2Q1rMmpScsl5YkV8jbQaa060rGFllZK0_n';

async function initMap() {
    if (map) return;

    map = L.map('map-bg').setView([30.4515, -91.1871], 12); // Baton Rouge, lock to telemetry later

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Traffic, incidents, no-go, hotspots as before (unchanged)
    // ... (loadTrafficClouds, loadNoGoZones, loadUberHotspots, etc.)
    loadTrafficClouds();
    loadNoGoZones();
    loadUberHotspots();
    // Polls unchanged
}
