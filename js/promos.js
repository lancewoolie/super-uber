// promos.js - Unchanged, Compact Top-Right
async function loadPromos() {
    const container = document.getElementById('promos-list');
    const deals = [
        { title: 'Model 3 Floor Mats', desc: 'All-weather TPE - $99 (20% off)', link: 'https://www.amazon.com/G-PLUS-Tesla-Model-Compatible-Fit/dp/B0D4PY99SR' },
        { title: 'Front Seat Covers', desc: 'Breathable for shifts - $45/pair', link: 'https://www.amazon.com/TOPABYTE-Breathable-Protector-Protection-Accessories/dp/B0CND81KQM' },
        { title: 'HubCaps 18" Pink', desc: 'Fun rims Highland - $60/set', link: 'https://www.amazon.com/Compatible-Highland-Replacement-Automobile-Accessories/dp/B0F27YXN69' }
    ];
    let html = deals.map(deal => `
        <div class="card">
            <h4>${deal.title}</h4>
            <p>${deal.desc}</p>
            <p><a href="${deal.link}" style="color: #00c851;" target="_blank">Grab Deal</a></p>
        </div>
    `).join('');
    container.innerHTML = html;
    console.log('Loaded Promos');
    setInterval(loadPromos, 600000);
}
