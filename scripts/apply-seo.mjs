// Patches ONLY the seo field on the live page documents from
// scripts/data/seo.mjs. Unlike migrate.mjs (which createOrReplace()s pages
// and would overwrite any edits made in Studio), this leaves all other
// content untouched. Run: node --env-file=.env scripts/apply-seo.mjs
// Add --dry-run to print what would change without writing.
import { client } from './lib/sanityClient.mjs';
import { SEO } from './data/seo.mjs';

const dryRun = process.argv.includes('--dry-run');

for (const [slug, seo] of Object.entries(SEO)) {
  const id = `page.${slug}`;
  const exists = await client.fetch('count(*[_id == $id])', { id });
  if (!exists) {
    console.log(`  - ${id} not found, skipped`);
    continue;
  }
  if (dryRun) {
    console.log(`  (dry run) ${id}:`, seo.metaTitle);
    continue;
  }
  // Set field-by-field so an existing shareImage on the page is preserved.
  await client
    .patch(id)
    .set(Object.fromEntries(Object.entries(seo).map(([k, v]) => [`seo.${k}`, v])))
    .commit();
  console.log('  ✓', id);
}

// Site-wide fallback used when a page has no SEO of its own.
if (!dryRun) {
  await client
    .patch('siteSettings')
    .set({
      'defaultSeo.metaTitle': SEO.home.metaTitle,
      'defaultSeo.metaDescription': SEO.home.metaDescription,
    })
    .commit();
  console.log('  ✓ siteSettings.defaultSeo');
}
