// money.js - Updated for Earnings Module (#earnings-dashboard) + Compact Cards

// Money Mode: Uber Driver API Integration (with OAuth Connect Button)
const UBER_CLIENT_ID = 'YOUR_CLIENT_ID_FROM_DEV_DASHBOARD'; // Replace with your app's Client ID
const UBER_REDIRECT_URI = 'https://your-superuber-site.com/callback'; // Or http://localhost:3000/callback for testing
const UBER_SERVER_TOKEN = 'Qdh65B2Q1rMmpScsl5YkV8jbQaa060rGFllZK0_n'; // Fallback server token (not personal)

async function loadMoney() {
    const container = document.getElementById('earnings-dashboard');
    const storedToken = localStorage.getItem('uber_access_token'); // Check for user token

    if (!storedToken) {
        // No connection: Show compact connect card
        container.innerHTML = `
            <div class="money-item" style="text-align: center;">
                <h3>Connect Uber</h3>
                <p>Grant access for earnings & mileage.</p>
                <button onclick="connectUber()" style="background: #00c851; color: #000; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.9em;">Connect</button>
            </div>
        `;
        console.log('No Uber token—show connect button');
        return;
    }

    // Has token: Fetch real data
    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading Uber data...</p>';

    try {
        // Fetch payments (earnings)
        const paymentsRes = await fetch('https://api.uber.com/v1/partners/payments?limit=100', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
        });
        const paymentsData = await paymentsRes.json();

        // Fetch trips (mileage)
        const tripsRes = await fetch('https://api.uber.com/v1/partners/trips?limit=100&status=completed', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
        });
        const tripsData = await tripsRes.json();

        if (paymentsData.payments && tripsData.trips && paymentsRes.ok && tripsRes.ok) {
            // Calculate weekly earnings (last 7 days)
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const weeklyEarnings = paymentsData.payments
                .filter(p => new Date(p.created_at) >= weekAgo)
                .reduce((sum, p) => sum + (parseFloat(p.amount) / 100), 0); // Cents to dollars

            // Calculate total mileage
            const totalMiles = tripsData.trips.reduce((sum, t) => sum + (parseFloat(t.distance || 0)), 0);
            const progress = Math.min(100, (totalMiles / 1000) * 100);

            container.innerHTML = `
                <div class="money-item">
                    <h3>Weekly Earnings</h3>
                    <p><strong>$${weeklyEarnings.toFixed(2)}</strong> (${paymentsData.payments.length} payments)</p>
                    <p>Trips: <strong>${tripsData.trips.length}</strong></p>
                </div>
                <div class="money-item">
                    <h3>Mileage Tracker</h3>
                    <p>Miles: <strong>${totalMiles.toFixed(1)}</strong></p>
                    <p>Progress: <strong>${progress.toFixed(0)}%</strong> (Target: 1k)</p>
                </div>
                <button onclick="disconnectUber()" style="background: #ff6b35; color: #fff; padding: 4px 8px; border: none; border-radius: 3px; cursor: pointer; font-size: 0.8em;">Disconnect</button>
            `;
            console.log(`Loaded your Uber data: $${weeklyEarnings} earnings, ${totalMiles}mi mileage`);
        } else {
            throw new Error('Invalid token or no data—reconnect');
        }
    } catch (error) {
        console.error('Uber API error:', error);
        container.innerHTML = `
            <div class="money-item">
                <h3>Connection Issue</h3>
                <p>Error (token expired?). <button onclick="connectUber()" style="background: #00c851; color: #000; padding: 4px 8px; border: none; border-radius: 3px; cursor: pointer; font-size: 0.8em;">Reconnect</button></p>
            </div>
        `;
    }
}

// OAuth Connect Function (Global for button onclick)
function connectUber() {
    const authUrl = `https://login.uber.com/oauth/authorize?client_id=${UBER_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(UBER_REDIRECT_URI)}&scope=profile%20history%20payment`;
    window.location.href = authUrl; // Redirect to Uber login
}

// Callback Handler (Add to your site: e.g., /callback?code=ABC → exchange for token)
function handleUberCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        // Exchange code for token (server-side recommended; stub here for demo)
        fetch('https://login.uber.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `client_id=${UBER_CLIENT_ID}&client_secret=YOUR_CLIENT_SECRET&grant_type=authorization_code&redirect_uri=${encodeURIComponent(UBER_REDIRECT_URI)}&code=${code}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('uber_access_token', data.access_token);
                localStorage.setItem('uber_refresh_token', data.refresh_token || ''); // For later refresh
                window.location.href = '/'; // Redirect back to app
                console.log('Uber connected!');
            }
        })
        .catch(err => console.error('Token exchange failed:', err));
    }
}

function disconnectUber() {
    localStorage.removeItem('uber_access_token');
    localStorage.removeItem('uber_refresh_token');
    loadMoney(); // Reload to show connect button
}

// Poll every 5 mins if connected
if (localStorage.getItem('uber_access_token')) {
    setInterval(loadMoney, 300000);
}
