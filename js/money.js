// money.js - Condensed No-Scroll: Tight Layout in Stretched Block
async function loadMoney() {
    const container = document.getElementById('earnings-dashboard');
    container.innerHTML = `
        <div class="card" style="margin-bottom: 5px; padding: 6px;">
            <h4 style="margin: 0 0 2px 0; font-size: 13px;">Today's Haul</h4>
            <p style="margin: 0; font-size: 12px;"><strong>$234.52</strong> | Tips: <strong>$29</strong> (12.4%)</p>
        </div>
        <div class="card" style="margin-bottom: 5px; padding: 6px;">
            <h4 style="margin: 0 0 2px 0; font-size: 13px;">Last 5 Trips</h4>
            <p style="margin: 0; font-size: 11px;">Mall→BTR $45+$8tip 12mi</p>
            <p style="margin: 0; font-size: 11px;">LSU→DT $22+$3tip 5mi</p>
            <p style="margin: 0; font-size: 11px;">Apt Run $38+$5tip 15mi</p>
            <p style="margin: 0; font-size: 11px;">Perkins $18+$2tip 4mi</p>
            <p style="margin: 0; font-size: 11px;">Surge $52+$11tip 18mi</p>
            <p style="margin: 2px 0 0 0; font-size: 11px;">Total: <strong>54mi</strong></p>
        </div>
        <div class="card" style="margin-bottom: 5px; padding: 6px;">
            <h4 style="margin: 0 0 2px 0; font-size: 13px;">Stats</h4>
            <p style="margin: 0; font-size: 11px;">Acc: <strong class="acceptance-low">29%</strong> | Can: <strong class="cancellation-med">7%</strong></p>
        </div>
    `;
    console.log('Loaded condensed Money');
    setInterval(loadMoney, 300000);
}
function connectUber() { /* unchanged */ }
function handleUberCallback() { /* unchanged */ }
function disconnectUber() { /* unchanged */ }
