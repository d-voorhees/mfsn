import type { LinkData } from '../types/sanity';

// Every block resolves a `link` object through this rather than re-deriving
// href/target logic in each component.
export function resolveHref(link?: LinkData): string {
  if (!link) return '#';
  if (link.internalLink?.slug?.current) {
    const slug = link.internalLink.slug.current;
    return slug === 'home' ? '/' : `/${slug}/`;
  }
  return link.externalUrl ?? '#';
}

export function isExternal(link?: LinkData): boolean {
  return Boolean(link?.externalUrl) && !link?.internalLink;
}
