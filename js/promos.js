// promos.js - Unchanged, but fits tall block
async function loadPromos() {
    const container = document.getElementById('promos-list');
    // Same as before, scrolls in tall block
    // ...
    setInterval(loadPromos, 600000);
}

// promos.js - Realtime Tesla/Uber Driver Products (Affiliate Links)
async function loadPromos() {
    const container = document.getElementById('promos-list');

    try {
        // Mock fetch from Tesla/Amazon (use real affiliate URLs)
        const deals = [
            { title: 'Model 3 Floor Mats', desc: 'All-weather TPE for Uber spills - $99 (20% off)', link: 'https://www.amazon.com/G-PLUS-Tesla-Model-Compatible-Fit/dp/B0D4PY99SR' },
            { title: 'Front Seat Covers', desc: 'Breathable protectors for long shifts - $45/pair', link: 'https://www.amazon.com/TOPABYTE-Breathable-Protector-Protection-Accessories/dp/B0CND81KQM' },
            { title: 'HubCaps 18" Pink', desc: 'Fun rims for Model 3 Highland - $60/set', link: 'https://www.amazon.com/Compatible-Highland-Replacement-Automobile-Accessories/dp/B0F27YXN69' },
            { title: 'Tesla Trash Bin', desc: 'In-door organizer for riders - $25', link: 'https://shop.tesla.com/product/model-3-trash-bin' },
            { title: 'Uber Sign Kit', desc: 'LED display for Tesla dash - $35', link: 'https://www.uber.com/us/en/drive/driver-app/accessories/' }
        ];

        let html = '';
        deals.forEach(deal => {
            html += `
                <div class="card">
                    <h4>${deal.title}</h4>
                    <p>${deal.desc}</p>
                    <p><a href="${deal.link}" style="color: #00c851;" target="_blank">Grab Deal</a></p>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (error) {
        console.error('Promos error:', error);
        // Fallback
        container.innerHTML = `
            <div class="card"><h4>Floor Mats</h4><p>$99 All-Weather</p><a href="https://amazon.com/..." style="color: #00c851;">Buy</a></div>
            <div class="card"><h4>Seat Covers</h4><p>$45 Breathable</p><a href="https://amazon.com/..." style="color: #00c851;">Buy</a></div>
        `;
    }

    setInterval(loadPromos, 600000); // 10min
}
