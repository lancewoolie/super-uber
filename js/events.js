function loadEvents() {
    const container = document.getElementById('events-list');
    container.innerHTML = '<p>Events will load here via Eventbrite/Google APIs (Baton Rouge filter).</p>';
    // TODO: fetch('https://www.eventbrite.com/api/...') etc.
    console.log('Events loaded (stub)');
}
