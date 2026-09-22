import {toHTML} from '@portabletext/to-html';
import type { PortableTextBlock } from '../types/sanity';

// The one Portable Text renderer for the whole site. Blocks pass their body
// through this rather than rendering raw HTML from Sanity, per the
// standing constraint that Portable Text must go through a safe renderer.
export function renderPortableText(blocks?: PortableTextBlock[], options?: { listClass?: string }): string {
  if (!blocks || blocks.length === 0) return '';
  return toHTML(
    blocks as never,
    options?.listClass
      ? { components: { list: { bullet: ({ children }) => `<ul class="${options.listClass}">${children}</ul>` } } }
      : undefined,
  );
}
