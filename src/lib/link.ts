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

// Despite the name, this means "open in a new tab": it follows the editor's
// "Open in a new tab" checkbox on the link, and defaults to the same tab.
export function isExternal(link?: LinkData): boolean {
  return link?.openInNewTab === true;
}
