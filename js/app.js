// app.js - Unchanged
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initMap === 'function') initMap();
    if (typeof loadEdge === 'function') loadEdge();
    if (typeof loadFlights === 'function') loadFlights();
    if (typeof loadMoney === 'function') loadMoney();
    if (typeof loadPromos === 'function') loadPromos();
    if (window.location.search.includes('code=')) handleUberCallback();
    console.log('Super Uber V1.1: Sexy Layout Loaded!');
});
