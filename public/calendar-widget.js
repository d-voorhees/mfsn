/**
 * Renders upcoming meetings as an editorial-style agenda list inside any
 * element matching `.agenda-widget[data-feed]`. The feed endpoint
 * (calendar-feed.php) does the Google Calendar fetch/parse server-side,
 * so this is a same-origin request — no CORS workaround needed.
 */
(function () {
  function parseEventDate(event) {
    if (event.allDay) {
      var parts = event.start.split('-');
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
    return new Date(event.start);
  }

  function renderStatus(container, message) {
    container.innerHTML = '';
    var status = document.createElement('p');
    status.className = 'agenda-widget__status';
    status.textContent = message;
    container.appendChild(status);
  }

  function renderAgenda(container, events) {
    container.innerHTML = '';
    if (events.length === 0) {
      renderStatus(container, 'No upcoming meetings right now — check back soon.');
      return;
    }

    var monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short' });
    var dateFmt = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    var timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

    events.forEach(function (event) {
      var start = parseEventDate(event);

      var item = document.createElement('div');
      item.className = 'agenda-widget__item';

      var dateCol = document.createElement('div');
      dateCol.className = 'agenda-widget__date';
      var month = document.createElement('span');
      month.className = 'agenda-widget__month';
      month.textContent = monthFmt.format(start).toUpperCase();
      var day = document.createElement('span');
      day.className = 'agenda-widget__day';
      day.textContent = String(start.getDate());
      dateCol.appendChild(month);
      dateCol.appendChild(day);

      var body = document.createElement('div');
      body.className = 'agenda-widget__body';
      var title = document.createElement('p');
      title.className = 'agenda-widget__title';
      title.textContent = event.summary || 'Untitled event';
      var meta = document.createElement('p');
      meta.className = 'agenda-widget__meta';
      var metaText = dateFmt.format(start);
      if (!event.allDay) metaText += ' at ' + timeFmt.format(start);
      if (event.location) metaText += ' · ' + event.location;
      meta.textContent = metaText;
      body.appendChild(title);
      body.appendChild(meta);

      item.appendChild(dateCol);
      item.appendChild(body);
      container.appendChild(item);
    });
  }

  function initWidget(container) {
    var endpoint = container.getAttribute('data-feed');

    fetch(endpoint)
      .then(function (res) {
        if (!res.ok) throw new Error('Bad response: ' + res.status);
        return res.json();
      })
      .then(function (events) { renderAgenda(container, events); })
      .catch(function (err) {
        // Left visible in devtools so a live-site failure (wrong endpoint path,
        // PHP not executing, non-JSON response) is diagnosable without server access.
        console.error('calendar-widget: failed to load ' + endpoint, err);
        renderStatus(container, 'Unable to load the calendar right now.');
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.agenda-widget[data-feed]').forEach(initWidget);
  });
})();
