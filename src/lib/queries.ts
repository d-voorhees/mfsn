import { sanityClient } from './sanity';
import type { PageData, SiteSettingsData } from '../types/sanity';

// Every `link` object in the schema stores either an internal page
// reference or an external URL. This projection dereferences the internal
// reference down to just its slug, which is all resolveHref() needs, so
// components never have to follow the reference themselves.
const LINK_PROJECTION = `
  label,
  internalLink->{slug},
  externalUrl
`;

// Fetches the one siteSettings singleton: logo, primary navigation (with
// each nav/dropdown link's internal page reference resolved to a slug),
// and footer content. BaseLayout calls this once per build and passes the
// result down to Nav.astro and Footer.astro — no other route or
// component queries siteSettings directly.
export async function getSiteSettings(): Promise<SiteSettingsData> {
  return sanityClient.fetch(`
    *[_id == "siteSettings"][0]{
      siteName,
      logo,
      navigation[]{
        label,
        link{${LINK_PROJECTION}},
        dropdownItems[]{
          label,
          link{${LINK_PROJECTION}}
        }
      },
      footer{
        contactPhone,
        contactEmail,
        locationText,
        copyrightText,
        legalLinks[]{${LINK_PROJECTION}}
      },
      defaultSeo
    }
  `);
}

// A resolved `link` object: {label, internalLink, externalUrl} where
// internalLink, if present, has been dereferenced down to just its slug.
const RESOLVED_LINK = (path: string) => `
  "${path}": ${path}{
    label,
    internalLink->{slug},
    externalUrl
  }
`;

// pageBuilder is a polymorphic array — GROQ can't project one shared
// shape across every block type, so each block that contains a `link` (or a
// reference needing dereferencing) gets its own conditional merge below.
// This is verbose but explicit: every nested reference this project's
// components actually read is resolved here, and nothing is silently left
// as a raw {_ref} for a component to mishandle.
const PAGE_BUILDER_PROJECTION = `
  pageBuilder[]{
    ...,
    _type == "heroCentered" => {
      "actions": actions[]{..., ${RESOLVED_LINK('link')}}
    },
    _type == "richTextSection" => {
      "actions": actions[]{..., ${RESOLVED_LINK('link')}}
    },
    _type == "textImageSection" => {
      "actions": actions[]{..., ${RESOLVED_LINK('link')}},
      "linkList": linkList[]{label, internalLink->{slug}, externalUrl}
    },
    _type == "twoColumnImageSection" => {
      "columns": columns[]{
        ...,
        "actions": actions[]{..., ${RESOLVED_LINK('link')}}
      }
    },
    _type == "featureGrid" => {
      "items": items[]{
        ...,
        "action": action{..., ${RESOLVED_LINK('link')}}
      },
      ${RESOLVED_LINK('trailingLink')}
    },
    _type == "statGrid" => {
      "stats": stats[]{..., ${RESOLVED_LINK('link')}}
    },
    _type == "resourceSpotlight" => {
      "tags": tags[]->{_id, label, colorKey},
      "resourceLinks": resourceLinks[]{label, internalLink->{slug}, externalUrl}
    },
    _type == "newsGrid" => {
      "mentions": mentions[]->{_id, headline, outletName, outletLogo, excerpt, byline, citation, url, linkLabel, featured, publishedAt},
      ${RESOLVED_LINK('trailingLink')}
    }
  }
`;

// Fetches one page by slug with its full pageBuilder array in authored
// order, every internal link resolved to a slug, and every reference
// (resourceSpotlight's tags, newsGrid's mentions) dereferenced to the
// fields their components actually render. Used by every page route —
// see src/pages/**.
export async function getPageBySlug(slug: string): Promise<PageData | null> {
  return sanityClient.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      seo,
      ${PAGE_BUILDER_PROJECTION}
    }`,
    { slug },
  );
}

// Every page slug except "home" (which owns its own dedicated route,
// src/pages/index.astro, and its own homepage-specific layout splice).
// Used by src/pages/[slug].astro's getStaticPaths() to statically generate
// every remaining page.
export async function getAllPageSlugsExceptHome(): Promise<string[]> {
  return sanityClient.fetch(`*[_type == "page" && slug.current != "home"].slug.current`);
}
