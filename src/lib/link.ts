import type { LinkData } from '../types/sanity';

// Every block resolves a `link` object through this rather than re-deriving
// href/target logic in each component.
export function resolveHref(link?: LinkData): string {
  if (!link) return '#';
  if (link.internalLink?.slug?.current) {
    const slug = link.internalLink.slug.current;
    return slug === 'homepage' ? '/' : `/${slug}/`;
  }
  if (link.fileUrl) return link.fileUrl;
  return link.externalUrl ?? '#';
}

export function isExternal(link?: LinkData): boolean {
  if (link?.externalUrl?.startsWith('#') && !link.fileUrl) return false;
  return Boolean(link?.externalUrl || link?.fileUrl) && !link?.internalLink;
}
