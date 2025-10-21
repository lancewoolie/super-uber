// Money Mode: Uber Driver API Integration (Live with Your Key)
const UBER_SERVER_TOKEN = 'Qdh65B2Q1rMmpScsl5YkV8jbQaa060rGFllZK0_n'; // Your Super Driver Dashboard secret key

async function loadMoney() {
    const container = document.getElementById('money-dashboard');
    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading Uber earnings & mileage...</p>'; // Loading spinner

    try {
        // Fetch payments (earnings)
        const paymentsRes = await fetch('https://api.uber.com/v1/partners/payments?limit=100', {
            headers: { 'Authorization': `Bearer ${UBER_SERVER_TOKEN}` }
        });
        const paymentsData = await paymentsRes.json();

        // Fetch trips (mileage)
        const tripsRes = await fetch('https://api.uber.com/v1/partners/trips?limit=100&status=completed', {
            headers: { 'Authorization': `Bearer ${UBER_SERVER_TOKEN}` }
        });
        const tripsData = await tripsRes.json();

        if (paymentsData.payments && tripsData.trips) {
            // Calculate weekly earnings (last 7 days; adjust date filter if needed)
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const weeklyEarnings = paymentsData.payments
                .filter(p => new Date(p.created_at) >= weekAgo)
                .reduce((sum, p) => sum + (parseFloat(p.amount) / 100), 0); // Uber amounts in cents

            // Calculate total mileage (sum distances)
            const totalMiles = tripsData.trips.reduce((sum, t) => sum + (parseFloat(t.distance || 0)), 0);
            const progress = Math.min(100, (totalMiles / 1000) * 100); // % toward 1k mile goal

            container.innerHTML = `
                <div class="money-item">
                    <h3>Weekly Earnings (Uber)</h3>
                    <p><strong>$${weeklyEarnings.toFixed(2)}</strong> (from ${paymentsData.payments.length} payments)</p>
                    <p>Total Trips: <strong>${tripsData.trips.length}</strong></p>
                </div>
                <div class="money-item">
                    <h3>Mileage Tracker</h3>
                    <p>Total Miles: <strong>${totalMiles.toFixed(1)}</strong></p>
                    <p>Target: 1,000 miles this week | Progress: <strong>${progress.toFixed(0)}%</strong></p>
                </div>
            `;
            console.log(`Loaded real Uber data: $${weeklyEarnings} earnings, ${totalMiles}mi mileage`);
        } else {
            throw new Error('No data returned—check token/approval');
        }
    } catch (error) {
        console.error('Uber API error:', error);
        // Fallback stub
        const earnings = 1250 + Math.floor(Math.random() * 100);
        const miles = 850 + Math.floor(Math.random() * 50);
        const progress = Math.min(100, (miles / 1000) * 100);
        container.innerHTML = `
            <div class="money-item">
                <h3>Weekly Earnings</h3>
                <p><strong>$${earnings.toLocaleString()}</strong> (API error—check console)</p>
                <p>Total Miles: <strong>${miles}</strong></p>
            </div>
            <div class="money-item">
                <h3>Mileage Tracker</h3>
                <p>Target: 1,000 miles this week</p>
                <p>Progress: <strong>${progress.toFixed(0)}%</strong></p>
            </div>
        `;
    }
}

// Poll every 5 mins for updates (optional)
setInterval(loadMoney, 300000);
