import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

// Astro frontmatter runs at build time for static routes, so this client is
// invoked during `astro build`/`astro dev`, not in the visitor's browser —
// the token below never reaches client-side code.
//
// The token is passed even though this project's dataset is nominally
// "public": anonymous queries against this project return null for every
// custom document type regardless (verified directly against the HTTP API,
// not just this client), so build-time reads rely on the token rather than
// dataset visibility. This is also just the standard, more robust pattern
// for a static build — it works the same regardless of any future
// visibility change, and never depends on the public API being reachable
// the way a visitor's browser would need it to be.
//
// useCdn is false because a token forces the live API anyway (the CDN only
// serves unauthenticated requests); there's no freshness tradeoff being
// made either way for a build-time-only fetch.
export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.SANITY_API_VERSION,
  token: import.meta.env.SANITY_API_TOKEN,
  useCdn: false,
});

const builder = createImageUrlBuilder(sanityClient);

// Central place for turning a Sanity image reference into a renderable URL.
// Every block component should go through this rather than building URLs by hand.
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
