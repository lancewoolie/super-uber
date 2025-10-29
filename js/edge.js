// edge.js - Repurposed from events.js: Edge Module (Surge Scanner, Predictor, Calc Tools)
// Rename file to edge.js and update script src in index.html

// Edge Mode: Quick-Hit Competitive Tools (Mocks + Uber API for Surge)
const UBER_SERVER_TOKEN = 'Qdh65B2Q1rMmpScsl5YkV8jbQaa060rGFllZK0_n'; // For server-side surges

async function loadEdge() {
    const container = document.getElementById('edge-tools');
    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading Edge Tools...</p>';

    try {
        // Fetch surges (use Uber estimates for mock hotspots)
        const surgesRes = await fetch('https://api.uber.com/v1/estimates/price?start_latitude=30.4515&start_longitude=-91.1871&end_latitude=30.4100&end_longitude=-91.1800', {
            headers: { 'Authorization': `Bearer ${UBER_SERVER_TOKEN}` }
        });
        const surgesData = await surgesRes.json();

        // Mock predictor & calc (expand with your trip data later)
        const mockSurge = surgesData.prices ? surgesData.prices[0].surge_multiplier || 1.0 : 1.2;
        const mockPredictor = 'Friday flights: +30% airport runs - Position now';
        const mockCalc = '3 hrs @ 1.2x = $120 projected (pure profit)';

        container.innerHTML = `
            <div class="event-card">
                <h3>Surge Scanner (20mi Radius)</h3>
                <p><strong>Top Surge:</strong> Downtown BR at <strong style="color: #00ff00;">${mockSurge}x</strong> - Drive time: 8 mins</p>
            </div>
            <div class="event-card">
                <h3>Rider Flow Predictor</h3>
                <p>${mockPredictor}</p>
            </div>
            <div class="event-card">
                <h3>Quick Calc Tools</h3>
                <p>${mockCalc}</p>
            </div>
        `;
        console.log('Loaded Edge tools with mock surges!');
    } catch (error) {
        console.error('Edge load error:', error);
        // Fallback stubs
        container.innerHTML = `
            <div class="event-card"><h3>Surge Scanner</h3><p>Downtown BR 1.2x - 8 min drive (mock)</p></div>
            <div class="event-card"><h3>Rider Predictor</h3><p>Friday flights = +30% (mock)</p></div>
            <div class="event-card"><h3>Break-Even</h3><p>Pure profit mode active (mock)</p></div>
        `;
    }

    // Poll every 5 mins for live surges
    setInterval(loadEdge, 300000);
}
