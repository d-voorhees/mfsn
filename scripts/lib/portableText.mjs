import { key } from './key.mjs';

// Builds a plain Portable Text array from paragraph strings — sufficient
// for this migration since the source HTML's prose has no inline
// formatting (bold/links) that needs preserving as marks, only paragraph
// breaks and, occasionally, lists (handled separately per-block below).
export function paragraphs(...texts) {
  return texts.filter(Boolean).map((text) => ({
    _type: 'block',
    _key: key('block'),
    style: 'normal',
    children: [{ _type: 'span', _key: key('span'), text }],
    markDefs: [],
  }));
}

export function bulletList(items) {
  return items.map((text) => ({
    _type: 'block',
    _key: key('block'),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [{ _type: 'span', _key: key('span'), text }],
    markDefs: [],
  }));
}

export function numberedList(items) {
  return items.map((text) => ({
    _type: 'block',
    _key: key('block'),
    style: 'normal',
    listItem: 'number',
    level: 1,
    children: [{ _type: 'span', _key: key('span'), text }],
    markDefs: [],
  }));
}

export function heading(text, style = 'h3') {
  return { _type: 'block', _key: key('block'), style, children: [{ _type: 'span', _key: key('span'), text }], markDefs: [] };
}
