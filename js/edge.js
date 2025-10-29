// edge.js - Combined Edge + Events: Demand Locations & Surges (Uber Clusters + Eventbrite)
const EVENTBRITE_TOKEN = 'WKKM4JGM6VOHZ3EYQE';
const UBER_SERVER_TOKEN = 'Qdh65B2Q1rMmpScsl5YkV8jbQaa060rGFllZK0_n';

async function loadEdge() {
    const container = document.getElementById('edge-tools');
    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading Demand...</p>';

    try {
        // Fetch events (e.g., LSU Baseball Oct 29)
        const eventsRes = await fetch(
            `https://www.eventbriteapi.com/v3/events/search/?token=${EVENTBRITE_TOKEN}&q=LSU%20Baton%20Rouge&sort_by=date&expand=venue&start_date.range_start=2025-10-29&limit=5`
        );
        const eventsData = await eventsRes.json();

        // Mock Uber hotspots with counts (cluster trips for drops/picks)
        const mockHotspots = [
            { name: 'Mall of Louisiana', drops: 12, picks: 5, lat: 30.4000, lng: -91.1500 },
            { name: 'BTR Metro Airport', drops: 3, picks: 23, lat: 30.5333, lng: -91.1500 },
            { name: 'LSU Tiger Stadium (Baseball vs Samford)', drops: 15, picks: 8, lat: 30.4100, lng: -91.1800, event: true }
        ];

        let html = '';
        mockHotspots.forEach(hotspot => {
            const surge = hotspot.drops + hotspot.picks > 15 ? ' (Surge x1.5)' : '';
            html += `
                <div class="card">
                    <h4>${hotspot.name}${surge}</h4>
                    <p>Drops: <strong style="color: #00c851;">${hotspot.drops}</strong> | Picks: <strong style="color: #00ff00;">${hotspot.picks}</strong>/hr</p>
                    ${hotspot.event ? '<p><em>Event: Baseball Exhibition</em></p>' : ''}
                </div>
            `;
        });

        // Add sub-locations for surges
        if (eventsData.events && eventsData.events.length > 0) {
            html += `
                <div class="card">
                    <h4>${eventsData.events[0].name.text} Subs</h4>
                    <p>Tiger Drive: 10 picks | Chimes St: 7 drops | Reggies: 5 surges</p>
                </div>
            `;
        }

        container.innerHTML = html;
        console.log('Loaded Edge demand & events');
    } catch (error) {
        console.error('Edge error:', error);
        // Fallback
        container.innerHTML = `
            <div class="card"><h4>Mall of LA</h4><p>12 drops, 5 picks</p></div>
            <div class="card"><h4>BTR Airport</h4><p>3 drops, 23 picks</p></div>
            <div class="card"><h4>LSU Baseball</h4><p>15 drops (Surge x1.5)</p></div>
        `;
    }

    setInterval(loadEdge, 300000); // 5min poll
}
