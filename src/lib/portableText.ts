import {toHTML} from '@portabletext/to-html';
import type { PortableTextBlock } from '../types/sanity';

// The one Portable Text renderer for the whole site. Blocks pass their body
// through this rather than rendering raw HTML from Sanity, per the
// standing constraint that Portable Text must go through a safe renderer.
export function renderPortableText(blocks?: PortableTextBlock[], options?: { listClass?: string }): string {
  if (!blocks || blocks.length === 0) return '';
  const listClass = options?.listClass;
  return toHTML(blocks as never, {
    components: {
      ...(listClass
        ? { list: { bullet: ({ children }) => `<ul class="${listClass}">${children}</ul>` } }
        : {}),
      marks: {
        // "Link to a page": queries.ts resolves the reference to a slug.
        internalLink: ({ children, value }) => {
          const slug = value?.slug;
          if (!slug) return children;
          return `<a href="${slug === 'home' ? '/' : `/${slug}/`}">${children}</a>`;
        },
        // "Link to an upload": queries.ts resolves the reference to the
        // file's CDN URL. Opens in a new tab so a PDF doesn't replace the page.
        fileLink: ({ children, value }) => {
          const url = value?.url;
          if (!url) return children;
          return `<a href="${url}" target="_blank" rel="noopener">${children}</a>`;
        },
      },
    },
  });
}
