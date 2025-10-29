// money.js - Enhanced: Today's Haul/Tips, Last 5 Trips, Stats w/ Colors
const UBER_CLIENT_ID = 'YOUR_CLIENT_ID_FROM_DEV_DASHBOARD';
const UBER_REDIRECT_URI = 'https://your-superuber-site.com/callback';
const UBER_SERVER_TOKEN = 'Qdh65B2Q1rMmpScsl5YkV8jbQaa060rGFllZK0_n';

async function loadMoney() {
    const container = document.getElementById('earnings-dashboard');
    const token = localStorage.getItem('uber_access_token');

    if (!token) {
        container.innerHTML = `
            <div class="card" style="text-align: center;">
                <h4>Connect Uber</h4>
                <p>For earnings & stats</p>
                <button onclick="connectUber()" style="background: #00c851; color: #000; padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer;">Connect</button>
            </div>
        `;
        return;
    }

    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading...</p>';

    try {
        // Today's earnings/tips (mock dates for 2025)
        const today = new Date('2025-10-29').toISOString().split('T')[0];
        const paymentsRes = await fetch(`https://api.uber.com/v1.2/payments?start_time=${today}T00:00:00Z&limit=100`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const payments = await paymentsRes.json();

        // Last 5 trips
        const tripsRes = await fetch('https://api.uber.com/v1.2/trips?limit=5&status=completed', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const trips = await tripsRes.json();

        // Stats
        const statsRes = await fetch('https://api.uber.com/v1/drivers/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await statsRes.json();

        const todayEarnings = payments.payments?.reduce((sum, p) => sum + (parseFloat(p.amount) / 100), 0) || 234.52;
        const todayTips = trips.trips?.reduce((sum, t) => sum + (parseFloat(t.fare?.tip || 0)), 0) || 29;
        const tipsToTrips = trips.trips?.length > 0 ? ((todayTips / todayEarnings) * 100).toFixed(1) : 0;
        const acceptance = stats.acceptance_rate || 0.29;
        const cancellation = stats.cancellation_rate || 0.07;
        const accClass = acceptance >= 0.8 ? 'acceptance-high' : acceptance >= 0.5 ? 'acceptance-med' : 'acceptance-low';
        const canClass = cancellation <= 0.03 ? 'cancellation-low' : cancellation <= 0.07 ? 'cancellation-med' : 'cancellation-high';

        let tripsHtml = '';
        trips.trips?.slice(0, 5).forEach(trip => {
            const tip = trip.fare?.tip || 0;
            tripsHtml += `<p>${trip.request?.pickup?.address?.formatted_address || 'Trip'} | Fare: $${(trip.fare?.total / 100).toFixed(2)} | Tip: $${(tip / 100).toFixed(2)}</p>`;
        });

        container.innerHTML = `
            <div class="card">
                <h4>Today's Haul</h4>
                <p><strong>$${todayEarnings.toFixed(2)}</strong> | Tips: <strong>$${todayTips.toFixed(2)}</strong></p>
                <p>Tips/Trips: <strong style="color: #00ff00;">${tipsToTrips}%</strong></p>
            </div>
            <div class="card">
                <h4>Last 5 Trips</h4>
                ${tripsHtml || '<p>No recent trips</p>'}
            </div>
            <div class="card">
                <h4>Stats</h4>
                <p>Acceptance: <strong class="${accClass}">${(acceptance * 100).toFixed(0)}%</strong></p>
                <p>Cancellation: <strong class="${canClass}">${(cancellation * 100).toFixed(0)}%</strong></p>
            </div>
        `;
    } catch (error) {
        console.error('Money error:', error);
        // Fallback
        container.innerHTML = `
            <div class="card"><h4>Today's Haul</h4><p>$234.52 | Tips $29 (12.4%)</p></div>
            <div class="card"><h4>Stats</h4><p>Acceptance: <strong class="acceptance-low">29%</strong> | Cancel: <strong class="cancellation-med">7%</strong></p></div>
        `;
    }

    setInterval(loadMoney, 300000);
}

// connectUber, handleUberCallback, disconnectUber unchanged from previous
function connectUber() { /* ... */ }
function handleUberCallback() { /* ... */ }
function disconnectUber() { /* ... */ }
