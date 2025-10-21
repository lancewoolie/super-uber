function loadMoney() {
    const container = document.getElementById('money-dashboard');
    container.innerHTML = `
        <div class="money-item">
            <h3>Weekly Earnings</h3>
            <p><strong>$1,250</strong> (up 15% from last week)</p>
            <p>Total Miles: <strong>850</strong></p>
        </div>
        <div class="money-item">
            <h3>Mileage Tracker</h3>
            <p>Target: 1,000 miles this week</p>
            <p>Progress: <strong>85%</strong></p>
        </div>
    `;
    // TODO: Fetch from backend or localStorage for real data
    console.log('Money dashboard loaded (stub)');
}
