// Cloudflare Pages Function — replaces calendar-feed.php (and, before that,
// an Astro API route: this logic used to live at astro-build's
// src/pages/api/calendar.ts, but Astro's own Cloudflare adapter targets a
// different Cloudflare product than this project's classic Pages
// deployment, so this route lives here instead, as a plain Pages Function
// alongside api/oauth/callback.js).
//
// Fetches the network's public Google Calendar iCal feed, parses upcoming
// events, and returns them as JSON for assets/calendar-widget.js (in the
// Astro build's public/ dir) to render. This needs to run per-request
// because the calendar's contents are genuinely live, external data.

const CALENDAR_ID = 'c_00a614063b5a2521bec1f4aeb72e9137cf8b832cd26c07fb9f60ffd0755f1c8c@group.calendar.google.com';
const ICAL_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;
const MAX_EVENTS = 6;
const CACHE_MS = 60 * 60 * 1000; // 1 hour

// Best-effort in-memory cache. Cloudflare Workers isolates are short-lived
// and this resets on cold start, which just means an occasional extra
// upstream fetch — not a correctness issue.
let cache = null;

function unescapeIcal(value) {
  return value.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\[nN]/g, '\n');
}

function parseIcalDate(raw) {
  const value = raw.trim();
  if (/^\d{8}$/.test(value)) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6)) - 1;
    const day = Number(value.slice(6, 8));
    return { date: new Date(year, month, day), allDayCandidate: true };
  }
  const timedMatch = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (timedMatch) {
    const [, y, mo, d, h, mi, s, z] = timedMatch;
    const date = z
      ? new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s)))
      : new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
    return { date, allDayCandidate: false };
  }
  return null;
}

function parseIcalEvents(icsData) {
  const unfolded = icsData.replace(/\r\n[ \t]/g, ''); // unfold continuation lines
  const lines = unfolded.split('\n').map((l) => l.replace(/\r$/, ''));

  const events = [];
  let current = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current) events.push(current);
      current = null;
      continue;
    }
    if (!current) continue;

    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex);
    const value = line.slice(separatorIndex + 1);
    const keyBase = key.split(';')[0];

    switch (keyBase) {
      case 'SUMMARY':
        current.summary = unescapeIcal(value).trim();
        break;
      case 'LOCATION':
        current.location = unescapeIcal(value).trim();
        break;
      case 'DTSTART': {
        const parsed = parseIcalDate(value);
        if (parsed) {
          current.start = parsed.date;
          current.allDay = parsed.allDayCandidate && key.includes('VALUE=DATE') && !key.includes('DATE-TIME');
        }
        break;
      }
    }
  }

  return events;
}

function upcomingEvents(events, limit) {
  const now = new Date();
  return events
    .filter((e) => Boolean(e.start) && e.start >= now)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, limit);
}

async function fetchIcalFeed() {
  if (cache && Date.now() - cache.fetchedAt < CACHE_MS) {
    return cache.data;
  }

  try {
    const res = await fetch(ICAL_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MFSN-CalendarFeed/1.0)' },
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.text();
    if (res.ok && data.includes('BEGIN:VCALENDAR')) {
      cache = { fetchedAt: Date.now(), data };
      return data;
    }
  } catch {
    // fall through to stale-cache-or-empty below
  }

  return cache?.data ?? '';
}

export async function onRequest() {
  let output = [];

  try {
    const icsData = await fetchIcalFeed();
    const events = upcomingEvents(parseIcalEvents(icsData), MAX_EVENTS);
    output = events.map((e) => {
      const allDay = Boolean(e.allDay);
      return {
        summary: e.summary || 'Untitled event',
        location: e.location ?? null,
        // All-day dates are floating (not tied to a moment), so they're sent
        // as a plain Y-m-d and parsed as a local calendar date client-side.
        start: allDay
          ? `${e.start.getFullYear()}-${String(e.start.getMonth() + 1).padStart(2, '0')}-${String(e.start.getDate()).padStart(2, '0')}`
          : e.start.toISOString(),
        allDay,
      };
    });
  } catch {
    output = [];
  }

  return new Response(JSON.stringify(output), {
    headers: { 'Content-Type': 'application/json' },
  });
}
