// app.js - Updated for Single-Page Dashboard: Init All Modules on Load, No Switching

// Main App Logic: Initialize Everything at Once
document.addEventListener('DOMContentLoaded', () => {
    // Init all modules simultaneously (no button switching)
    if (typeof initMap === 'function') initMap();
    if (typeof loadEdge === 'function') loadEdge(); // Repurposed from events
    if (typeof loadFlights === 'function') loadFlights();
    if (typeof loadMoney === 'function') loadMoney();
    if (typeof loadPromos === 'function') loadPromos();

    // Global: Check Uber callback on any load
    if (window.location.search.includes('code=')) {
        handleUberCallback();
    }

    // Optional: Add click handlers to section icons for expand/collapse if needed (future)
    document.querySelectorAll('.section-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.currentTarget.parentElement.classList.toggle('expanded'); // CSS for toggle height
        });
    });

    console.log('Super Uber Alpha V1.1 Dashboard Loaded - All Modules Active!');
});
