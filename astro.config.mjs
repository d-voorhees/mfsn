// @ts-check
import { defineConfig } from 'astro/config';

// The site is fully static (SSG), no adapter needed. The one route that
// can't be pre-rendered (a live Google Calendar feed, replacing
// calendar-feed.php) is NOT an Astro route — it lives as a plain
// Cloudflare Pages Function at functions/api/calendar.js in the deploy
// repo, alongside the existing functions/api/oauth/callback.js (a
// Constant Contact OAuth callback). Both are classic Cloudflare Pages
// Functions (the mfsn-bkw.pages.dev project's existing, working
// deployment model — dashboard-driven git build + a root-level
// functions/ directory), NOT the newer Astro Cloudflare adapter's
// Workers+static-assets output, which targets a different Cloudflare
// product and would require reconfiguring the Pages project. Keeping
// Astro itself 100% static avoids that entirely.
export default defineConfig({});
