import {toHTML} from '@portabletext/to-html';
import type { PortableTextBlock } from '../types/sanity';

// The one Portable Text renderer for the whole site. Blocks pass their body
// through this rather than rendering raw HTML from Sanity, per the
// standing constraint that Portable Text must go through a safe renderer.
// Headings authored in Sanity (h3/h4/...) can skip a level under the section's
// own <h2> (e.g. an h4 straight after an h2), which breaks the heading outline
// for screen-reader users. Render each one one level below the previous
// heading at most, keeping the authored size via Bootstrap's .hN class.
function levelHeadings(blocks: PortableTextBlock[]): PortableTextBlock[] {
  let last = 2; // the section heading itself is an <h2>
  return blocks.map((block) => {
    const style = (block as { style?: string }).style;
    const match = /^h([1-6])$/.exec(style ?? '');
    if (!match) return block;
    const authored = Number(match[1]);
    const level = Math.min(authored, last + 1);
    last = level;
    return { ...block, style: `h${level}`, _authoredLevel: authored } as PortableTextBlock;
  });
}

export function renderPortableText(blocks?: PortableTextBlock[], options?: { listClass?: string }): string {
  if (!blocks || blocks.length === 0) return '';
  const listClass = options?.listClass;
  const headingBlock = ({ children, value }: { children: string; value: Record<string, unknown> }) => {
    const level = String(value.style).slice(1);
    const authored = value._authoredLevel;
    const cls = authored && authored !== Number(level) ? ` class="h${authored}"` : '';
    return `<h${level}${cls}>${children}</h${level}>`;
  };
  return toHTML(levelHeadings(blocks) as never, {
    components: {
      block: { h3: headingBlock, h4: headingBlock, h5: headingBlock } as never,
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
          return `<a href="${url}" target="_blank" rel="noopener">${children}<span class="visually-hidden"> (opens in a new tab)</span></a>`;
        },
      },
    },
  });
}
