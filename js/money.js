function loadMoney() {
    const container = document.getElementById('money-dashboard');
    // Simple dynamic stub (could tie to localStorage later)
    const earnings = 1250 + Math.floor(Math.random() * 100); // Fake variance
    const miles = 850 + Math.floor(Math.random() * 50);
    const progress = Math.min(100, (miles / 1000) * 100);
    container.innerHTML = `
        <div class="money-item">
            <h3>Weekly Earnings</h3>
            <p><strong>$${earnings.toLocaleString()}</strong> (up ~15% from last week)</p>
            <p>Total Miles: <strong>${miles}</strong></p>
        </div>
        <div class="money-item">
            <h3>Mileage Tracker</h3>
            <p>Target: 1,000 miles this week</p>
            <p>Progress: <strong>${progress.toFixed(0)}%</strong></p>
        </div>
    `;
    // TODO: Fetch from backend or localStorage for real data
    console.log('Money dashboard loaded');
}
