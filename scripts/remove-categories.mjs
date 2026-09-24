// One-time cleanup after removing the Resource Category type: strips the
// now-unused `tags` array from every resourceSpotlight block on live pages,
// then deletes the leftover category documents. Content is otherwise
// untouched. Run: node --env-file=.env scripts/remove-categories.mjs
// Add --dry-run to print what would change without writing.
import { client as baseClient } from './lib/sanityClient.mjs';

// 'raw' so unpublished drafts are included: a category can't be deleted while
// a draft still references it. Drafts are only stripped of `tags`, never
// replaced, so in-progress edits are preserved.
const client = baseClient.withConfig({ perspective: 'raw' });

const dryRun = process.argv.includes('--dry-run');

const pages = await client.fetch(
  `*[_type == "page" && count(pageBuilder[_type == "resourceSpotlight" && defined(tags)]) > 0]{_id, "keys": pageBuilder[_type == "resourceSpotlight" && defined(tags)]._key}`,
);
for (const page of pages) {
  console.log(`  ${dryRun ? '(dry run) ' : ''}${page._id}: unset tags on ${page.keys.length} block(s)`);
  if (dryRun) continue;
  await client
    .patch(page._id)
    .unset(page.keys.map((k) => `pageBuilder[_key=="${k}"].tags`))
    .commit();
}

const categoryIds = await client.fetch('*[_type == "category"]._id');
console.log(`  ${dryRun ? '(dry run) ' : ''}deleting ${categoryIds.length} category document(s)`);
if (!dryRun && categoryIds.length) {
  const tx = client.transaction();
  categoryIds.forEach((id) => tx.delete(id));
  await tx.commit();
}
