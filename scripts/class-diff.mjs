import fs from 'node:fs';
import path from 'node:path';

const SITE_ROOT = path.resolve(import.meta.dirname, '..', '..');
const DIST = path.join(import.meta.dirname, '..', 'dist', 'client');

const PAGES = [
  ['index.html', 'index.html'],
  ['our-network.html', 'our-network/index.html'],
  ['leadership.html', 'leadership/index.html'],
  ['steering-committee.html', 'steering-committee/index.html'],
  ['member-connection.html', 'member-connection/index.html'],
  ['meeting-documents.html', 'meeting-documents/index.html'],
  ['in-the-news.html', 'in-the-news/index.html'],
  ['our-strategy.html', 'our-strategy/index.html'],
  ['talking-points.html', 'talking-points/index.html'],
  ['data-mapping.html', 'data-mapping/index.html'],
  ['resources.html', 'resources/index.html'],
  ['unite-us.html', 'unite-us/index.html'],
  ['working-groups.html', 'working-groups/index.html'],
  ['find-food-now.html', 'find-food-now/index.html'],
  ['privacy-policy.html', 'privacy-policy/index.html'],
  ['terms-of-service.html', 'terms-of-service/index.html'],
];

// Classes confirmed dead (no CSS rule at all, or only used as an
// unused body-scoping hook per site.css's own opening comment) — not
// worth flagging as regressions on every run.
const KNOWN_HARMLESS = new Set([
  'page-index', 'page-our-network', 'page-leadership', 'page-steering-committee',
  'page-member-connection', 'page-meeting-documents', 'page-in-the-news', 'page-our-strategy',
  'page-talking-points', 'page-data-mapping', 'page-resources', 'page-unite-us',
  'page-working-groups', 'page-find-food-now', 'page-privacy-policy', 'page-terms-of-service',
]);

function extractClasses(html) {
  const classes = new Set();
  const re = /class="([^"]*)"/g;
  let m;
  while ((m = re.exec(html))) {
    for (const c of m[1].split(/\s+/)) if (c) classes.add(c);
  }
  return classes;
}

for (const [src, out] of PAGES) {
  const srcHtml = fs.readFileSync(path.join(SITE_ROOT, src), 'utf8');
  const outPath = path.join(DIST, out);
  if (!fs.existsSync(outPath)) {
    console.log(`${src}: MISSING OUTPUT FILE ${out}`);
    continue;
  }
  const outHtml = fs.readFileSync(outPath, 'utf8');
  const srcClasses = extractClasses(srcHtml);
  const outClasses = extractClasses(outHtml);
  const missing = [...srcClasses].filter((c) => !outClasses.has(c) && !KNOWN_HARMLESS.has(c));
  if (missing.length > 0) {
    console.log(`${src}: missing ${missing.length} classes ->`, missing.join(', '));
  } else {
    console.log(`${src}: OK`);
  }
}
