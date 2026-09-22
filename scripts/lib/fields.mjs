import { key } from './key.mjs';

export const extLink = (label, url) => ({ label, externalUrl: url });
export const intLink = (label, slug) => ({ label, internalLink: { _type: 'reference', _ref: `page.${slug}` } });

export const action = (style, link) => ({ _type: 'action', _key: key('action'), style, link });

export const sectionSettings = (opts = {}) => ({ ...opts });
