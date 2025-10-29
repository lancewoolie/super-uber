// edge.js - Sample Data (Tall Block Scrolls)
async function loadEdge() {
    const container = document.getElementById('edge-tools');
    container.innerHTML = `
        <div class="card">
            <h4>LSU Home Game (Surge x1.5)</h4>
            <p>Tiger Drive: 15 picks/hr | Chimes Street: 12 drops/hr</p>
            <p>Reggies in Tigerland: 8 surges | Stadium Entrance: 20 total</p>
        </div>
        <div class="card">
            <h4>Brooks & Dunn at River Center</h4>
            <p>Main Entrance: 10 drops | Parking Lot: 7 picks</p>
            <p>VIP Dropoff: Surge x1.2 | Side Exit: 5 surges</p>
        </div>
        <div class="card">
            <h4>Jazz Fest Main Entrance</h4>
            <p>North Gate: 18 picks | South Stage: 14 drops</p>
            <p>Event Peak: +25% earnings | Vendor Zone: 9 surges</p>
        </div>
    `;
    console.log('Loaded Edge sample');
    setInterval(loadEdge, 300000);
}
