import fs from 'node:fs';
import path from 'node:path';
import { SITE_ROOT } from '../lib/uploadImage.mjs';

// Files that used to live in the old site's /uploads folder. The migration
// turns each one into an "Upload" document (with the file stored in Sanity),
// and pages link to it by reference instead of a hard-coded /uploads/ URL.
// A file that isn't found on disk is skipped, along with the links to it,
// rather than leaving a link that 404s. Add it later in Studio → Uploads.
export const UPLOADS = [
  {
    _id: 'upload.data-around-food-costs-september-2026',
    title: 'Fast Facts: Food Prices and Hunger (September 2026)',
    file: 'uploads/data-around-food-costs-september-2026.pdf',
  },
  {
    _id: 'upload.who-we-are-mfsn-2026',
    title: 'Who We Are Graphic (2026)',
    file: 'uploads/who-we-are-mfsn-2026.pdf',
  },
];

const byId = new Map(UPLOADS.map((u) => [u._id, u]));

export const uploadPath = (id) => path.join(SITE_ROOT, byId.get(id).file);
export const hasUpload = (id) => fs.existsSync(uploadPath(id));

export const fileLinkFor = (label, id) => ({ label, file: { _type: 'reference', _ref: id } });
