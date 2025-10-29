// money.js - Sample Data: $234.52 Haul, $29 Tips, 29% Acc (Red), 7% Cancel (Orange)
async function loadMoney() {
    const container = document.getElementById('earnings-dashboard');
    container.innerHTML = `
        <div class="card">
            <h4>Today's Haul</h4>
            <p><strong>$234.52</strong> | Tips: <strong>$29</strong></p>
            <p>Tips Ratio: <strong style="color: #00ff00; font-size: 14px;">12.4%</strong></p>
        </div>
        <div class="card">
            <h4>Last 5 Trips</h4>
            <p>Mall to BTR | $45 | Tip $8</p>
            <p>LSU to Downtown | $22 | Tip $3</p>
            <p>Airport Run | $38 | Tip $5</p>
            <p>Perkins Rd | $18 | Tip $2</p>
            <p>Evening Surge | $52 | Tip $11</p>
            <p>Total Mileage: <strong>156mi</strong></p>
        </div>
        <div class="card">
            <h4>Live Stats</h4>
            <p>Acceptance: <strong class="acceptance-low">29%</strong></p>
            <p>Cancellation: <strong class="cancellation-med">7%</strong></p>
        </div>
    `;
    console.log('Loaded Money sample');
    setInterval(loadMoney, 300000);
}

// connectUber, etc. unchanged
function connectUber() { /* ... */ }
function handleUberCallback() { /* ... */ }
function disconnectUber() { /* ... */ }
