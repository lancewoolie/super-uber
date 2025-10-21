// Events Mode: Fetch from Eventbrite (Text search for Baton Rouge - location deprecated)
const EVENTBRITE_TOKEN = 'WKKM4JGM6VOHZ3EYQE'; // Pending; swap later

async function loadEvents() {
    const container = document.getElementById('events-list');
    container.innerHTML = '<p style="text-align: center; color: #cccccc;">Loading events in Baton Rouge...</p>';

    try {
        const response = await fetch(
            `https://www.eventbriteapi.com/v3/events/search/?token=${EVENTBRITE_TOKEN}&q=Baton%20Rouge&sort_by=date&expand=venue&limit=10`
        );
        const data = await response.json();

        if (data.events && data.events.length > 0) {
            container.innerHTML = '';
            data.events.slice(0, 8).forEach(event => { // Cap to 8 for no overflow
                const card = document.createElement('div');
                card.className = 'event-card';
                const venue = event.venue ? `${event.venue.name || 'TBD'} - ${event.venue.city || ''}` : 'Venue TBD';
                const date = new Date(event.start ? event.start.local : Date.now()).toLocaleDateString();
                card.innerHTML = `
                    <h3>${event.name.text || 'Unnamed Event'}</h3>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Venue:</strong> ${venue}</p>
                    <p>${event.summary || event.description ? (event.summary || event.description.text).substring(0, 100) + '...' : 'Details coming soon'}</p>
                    <p style="margin-top: 10px;"><a href="${event.url}" style="color: #00c851;" target="_blank">Get Tickets on Eventbrite</a></p>
                `;
                container.appendChild(card);
            });
            console.log(`Loaded ${data.events.length} events!`);
        } else {
            container.innerHTML = '<div class="event-card"><p>No upcoming events found—check back soon or update token!</p></div>';
        }
    } catch (error) {
        console.error('Eventbrite error:', error);
        container.innerHTML = '<div class="event-card"><p>Error loading events (API deprecated location search; using text query). Check console.</p></div>';
    }
}
