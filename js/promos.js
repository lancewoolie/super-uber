function loadPromos() {
    const container = document.getElementById('promos-list');
    // Enhanced stub with fake "dynamic" deals
    const promos = [
        { title: 'Tesla Model 3 Referral', desc: 'Get $1,000 off + free Supercharge', link: 'https://ts.la/your-referral' },
        { title: 'Amazon Prime Driver Deal', desc: '3 months free for Uber drivers', link: 'https://amazon.com/driver-promo' }
    ];
    container.innerHTML = promos.map(promo => `
        <div class="promo-card">
            <h3>${promo.title}</h3>
            <p>${promo.desc}</p>
            <p style="margin-top: 10px;"><a href="${promo.link}" style="color: #00c851;" target="_blank">Claim Now</a></p>
        </div>
    `).join('');
    // TODO: RSS fetch for Tesla, Amazon API
    console.log('Promos loaded');
}
