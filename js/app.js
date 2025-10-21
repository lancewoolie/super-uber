// Main App Logic: Mode Switching
document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.nav-btn');
    const modes = document.querySelectorAll('.mode');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            btns.forEach(b => b.classList.remove('active'));
            modes.forEach(m => m.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const modeId = btn.id.replace('-btn', '-mode');
            document.getElementById(modeId).classList.add('active');

            // Trigger mode init if needed (e.g., load data)
            if (modeId === 'map-mode') initMap();
            if (modeId === 'events-mode') loadEvents();
            if (modeId === 'flights-mode') loadFlights();
            if (modeId === 'money-mode') loadMoney();
            if (modeId === 'promos-mode') loadPromos();
        });
    });

    // Default to Map Mode
    document.getElementById('map-btn').click();
});
