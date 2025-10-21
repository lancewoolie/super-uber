// Money Mode: Uber Driver API Integration (Stub + Steps)
const UBER_ACCESS_TOKEN = 'YOUR_OAUTH_TOKEN_HERE'; // From OAuth flow below
const UBER_SERVER_TOKEN = 'YOUR_SERVER_TOKEN'; // For server-side calls

function loadMoney() {
    const container = document.getElementById('money-dashboard');

    // TODO: Replace stub with real API calls
    // STEPS FOR UBER DRIVER API INTEGRATION:
    // 1. Register app at https://developer.uber.com/ (select "Driver" product) → Get Client ID/Secret.
    // 2. Request scopes: profile, payment, history (for earnings/mileage/trips). Submit for approval (1-2 weeks; limited access).
    // 3. OAuth 2.0 Flow (Client Credentials for server, Authorization Code for user):
    //    - Redirect user: https://login.uber.com/oauth/authorize?client_id=YOUR_ID&response_type=code&redirect_uri=YOUR_URI&scope=profile%20payment%20history
    //    - Exchange code for token: POST https://login.uber.com/oauth/token (with client_secret, grant_type=authorization_code)
    //    - Refresh: POST same endpoint with grant_type=refresh_token
    // 4. Endpoints (use Bearer token in Authorization header):
    //    - Profile: GET https://api.uber.com/v1/partners/me → Driver info
    //    - Earnings: GET https://api.uber.com/v1/partners/payments?limit=100 → Weekly totals (sum 'amount' for earnings)
    //    - Mileage/Trips: GET https://api.uber.com/v1/partners/trips?limit=100&status=completed → Sum 'distance' for mileage
    //    - Realtime: Webhooks for trip updates (subscribe via /v1/partners/webhooks)
    // 5. Code Snippet Example (fetch earnings):
    //    fetch('https://api.uber.com/v1/partners/payments?limit=10', {
    //      headers: { 'Authorization': `Bearer ${UBER_ACCESS_TOKEN}` }
    //    }).then(res => res.json()).then(data => { /* Process payments */ });
    // Limitations: Rate limits (1000/day), no realtime polling (use webhooks), US-only for some data.

    // Stub data (simulate API)
    const earnings = 1250 + Math.floor(Math.random() * 100); // Fake variance
    const miles = 850 + Math.floor(Math.random() * 50);
    const progress = Math.min(100, (miles / 1000) * 100);
    container.innerHTML = `
        <div class="money-item">
            <h3>Weekly Earnings (Uber API)</h3>
            <p><strong>$${earnings.toLocaleString()}</strong> (up ~15% from last week)</p>
            <p>Total Miles: <strong>${miles}</strong></p>
        </div>
        <div class="money-item">
            <h3>Mileage Tracker</h3>
            <p>Target: 1,000 miles this week</p>
            <p>Progress: <strong>${progress.toFixed(0)}%</strong></p>
        </div>
    `;
    console.log('Money dashboard loaded (integrate Uber API per steps above)');
}
