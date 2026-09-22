import fs from 'node:fs';
import path from 'node:path';
import { client } from './sanityClient.mjs';

// This file lives at astro-build/scripts/lib/uploadImage.mjs, so the site
// root (where img/ and uploads/ actually live) is three levels up, not two.
export const SITE_ROOT = path.resolve(import.meta.dirname, '..', '..', '..');

const cache = new Map();
const missing = [];

// Uploads a local file once and reuses the resulting asset for every
// subsequent reference to that same relative path (e.g. the nav/footer
// logo, or a partner logo that happens to appear more than once) instead of
// re-uploading duplicate binaries.
// @sanity/client's upload requests have NO timeout unless one is explicitly
// passed (uploads can legitimately be slow, so the library opts out by
// default) — a single dropped/stalled connection was hanging the whole
// migration indefinitely with zero CPU activity and no error. A 30s timeout
// plus a couple of retries turns that into a normal, recoverable failure.
const UPLOAD_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadImage(relativePath) {
  if (cache.has(relativePath)) return cache.get(relativePath);

  const absolutePath = path.join(SITE_ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) {
    missing.push(relativePath);
    return null;
  }

  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const asset = await client.assets.upload('image', fs.createReadStream(absolutePath), {
        filename: path.basename(absolutePath),
        timeout: UPLOAD_TIMEOUT_MS,
      });
      const ref = { _type: 'reference', _ref: asset._id };
      cache.set(relativePath, ref);
      return ref;
    } catch (err) {
      lastError = err;
      console.warn(`  ⚠ upload attempt ${attempt}/${MAX_ATTEMPTS} failed for ${relativePath}: ${err.message}`);
      if (attempt < MAX_ATTEMPTS) await sleep(1000 * attempt);
    }
  }
  throw new Error(`Failed to upload ${relativePath} after ${MAX_ATTEMPTS} attempts: ${lastError.message}`);
}

export async function image(relativePath, alt, extra = {}) {
  const asset = await uploadImage(relativePath);
  if (!asset) return undefined;
  return { _type: 'imageWithAlt', asset, alt, ...extra };
}

// Called once after all content is built. A silent "some images were
// skipped" warning is too easy to miss in a long migration log — if this
// count comes back non-trivial, something is wrong with path resolution
// (as opposed to a handful of genuinely-missing source assets), so this
// fails the whole run rather than leaving broken image references live.
export function reportMissing({ failThreshold = 3 } = {}) {
  if (missing.length === 0) return;
  console.warn(`\n⚠ ${missing.length} image(s) referenced by the migration were not found on disk:`);
  for (const m of missing) console.warn(`  - ${m}`);
  if (missing.length >= failThreshold) {
    throw new Error(
      `${missing.length} missing images is more than the expected few-typos threshold (${failThreshold}) — this usually means SITE_ROOT or a path is wrong, not that this many files are genuinely missing. Aborting instead of leaving broken image references live.`,
    );
  }
}
