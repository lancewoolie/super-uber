// app.js - Full Dashboard Init: All Blocks Load on Start
document.addEventListener('DOMContentLoaded', () => {
    // Init map as full BG
    if (typeof initMap === 'function') initMap();

    // Init all blocks
    if (typeof loadEdge === 'function') loadEdge();
    if (typeof loadFlights === 'function') loadFlights();
    if (typeof loadMoney === 'function') loadMoney();
    if (typeof loadPromos === 'function') loadPromos();

    // Uber callback
    if (window.location.search.includes('code=')) handleUberCallback();

    console.log('Super Uber V1.1: Sexy Dashboard Loaded!');
});
