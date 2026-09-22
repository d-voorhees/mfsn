import fs from 'node:fs';
import path from 'node:path';
import { client } from './lib/sanityClient.mjs';
import { image, reportMissing, SITE_ROOT } from './lib/uploadImage.mjs';
import { CATEGORIES } from './data/categories.mjs';
import { NEWS_MENTIONS } from './data/newsMentions.mjs';
import { NAVIGATION, FOOTER } from './data/siteSettings.mjs';
import { buildPages } from './data/pages.mjs';

function assertSiteRootIsCorrect() {
  const canary = path.join(SITE_ROOT, 'img/mfsn-logo-white.png');
  if (!fs.existsSync(canary)) {
    throw new Error(
      `SITE_ROOT resolved to "${SITE_ROOT}", but "img/mfsn-logo-white.png" isn't there. Fix SITE_ROOT in scripts/lib/uploadImage.mjs before running the migration — every image upload would silently fail otherwise.`,
    );
  }
}

async function run() {
  assertSiteRootIsCorrect();

  console.log('--- Migrating categories ---');
  for (const cat of CATEGORIES) {
    await client.createOrReplace({ _id: cat._id, _type: 'category', label: cat.label, colorKey: cat.colorKey });
    console.log('  ✓', cat.label);
  }

  console.log('\n--- Migrating news mentions ---');
  for (const mention of NEWS_MENTIONS) {
    const outletLogo = mention.outletLogoFile ? await image(mention.outletLogoFile, mention.outletName) : undefined;
    await client.createOrReplace({
      _id: mention._id,
      _type: 'newsMention',
      headline: mention.headline,
      outletName: mention.outletName,
      outletLogo,
      excerpt: mention.excerpt,
      byline: mention.byline,
      citation: mention.citation,
      url: mention.url,
      linkLabel: mention.linkLabel,
      featured: mention.featured,
      publishedAt: mention.publishedAt,
    });
    console.log('  ✓', mention.headline);
  }

  console.log('\n--- Migrating pages (this uploads every referenced image; can take a while) ---');
  const pages = await buildPages();

  // Pages cross-reference each other (e.g. the homepage links to
  // /our-strategy/, /resources/, etc.), and Sanity's default references are
  // strong — they're rejected if the target document doesn't exist yet.
  // Create every page as a stub first so every target ID exists, then fill
  // in the full pageBuilder content in a second pass.
  console.log('  Pass 1/2: creating stub documents for every page...');
  for (const page of pages) {
    await client.createIfNotExists({ _id: page._id, _type: 'page', title: page.title, slug: page.slug });
  }

  console.log('  Pass 2/2: writing full content...');
  for (const page of pages) {
    await client.createOrReplace(page);
    console.log('  ✓', page.title, `(${page._id})`);
  }

  console.log('\n--- Migrating site settings (singleton, references pages created above) ---');
  const logo = await image('img/mfsn-logo-white.png', 'Manatee Food Security Network logo');
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Manatee Food Security Network',
    logo,
    navigation: NAVIGATION,
    footer: FOOTER,
    defaultSeo: {
      metaTitle: 'Manatee Food Security Network | Building a Stronger, Food-Secure Manatee County',
    },
  });
  console.log('  ✓ siteSettings');

  reportMissing();
  console.log('\nMigration complete.');
}

run().catch((err) => {
  console.error('\nMigration failed:', err);
  process.exit(1);
});
