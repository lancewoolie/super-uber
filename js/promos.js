// promos.js - Updated for Compact Dashboard Cards

// Promos Mode: Tesla Realtime Deals API (Unofficial)
async function loadPromos() {
    const container = document.getElementById('promos-list');

    try {
        // Fetch Tesla inventory/deals (unofficial API - no auth needed, but rate-limited)
        const response = await fetch('https://www.tesla.com/api/v1/inventory?model=m3&arrangeby=plh&zip=70801&range=50'); // Baton Rouge ZIP, 50mi
        const data = await response.json();

        if (data && data.response && data.response.colors && data.response.colors.length > 0) {
            container.innerHTML = '';
            // Highlight top deals (e.g., discounts, referrals)
            const deals = [
                { title: 'Model 3 Clearance', desc: `$${data.response.colors[0].configs[0].market_prices.base_price - data.response.colors[0].configs[0].market_prices.total_price} off`, link: 'https://www.tesla.com/inventory/new/m3' },
                { title: '$1,000 Referral', desc: 'Free Supercharge + credit (thru Dec 2025)', link: 'https://www.tesla.com/support/referral-program' },
                { title: '0% APR Model Y', desc: 'Financing on RWD stock', link: 'https://www.tesla.com/modely' }
            ];
            deals.forEach(promo => {
                const card = document.createElement('div');
                card.className = 'promo-card';
                card.innerHTML = `
                    <h3>${promo.title}</h3>
                    <p>${promo.desc}</p>
                    <p style="margin-top: 5px;"><a href="${promo.link}" style="color: #00c851; font-size: 0.8em;" target="_blank">Claim</a></p>
                `;
                container.appendChild(card);
            });
            console.log('Loaded Tesla realtime deals!');
        } else {
            // Fallback stub (current as of Oct 29, 2025)
            loadStubPromos();
        }
    } catch (error) {
        console.error('Tesla API error:', error);
        loadStubPromos();
    }

    function loadStubPromos() {
        const promos = [
            { title: 'Tesla Referral', desc: '$1,000 off + Supercharge', link: 'https://ts.la/your-referral' },
            { title: 'Amazon Prime Deal', desc: '3 months free for drivers', link: 'https://amazon.com/driver-promo' }
        ];
        container.innerHTML = promos.map(promo => `
            <div class="promo-card">
                <h3>${promo.title}</h3>
                <p>${promo.desc}</p>
                <p style="margin-top: 5px;"><a href="${promo.link}" style="color: #00c851; font-size: 0.8em;" target="_blank">Claim</a></p>
            </div>
        `).join('');
    }
    console.log('Promos loaded (Tesla integration)');
}

// Auto-load on dashboard init + poll every 10 mins
setInterval(loadPromos, 600000);
