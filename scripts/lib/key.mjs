import { randomUUID } from 'node:crypto';

// Sanity array items need a unique `_key`. Prefixing with a readable label
// keeps Studio's array UI and any future manual editing legible instead of
// showing bare UUIDs.
export function key(label) {
  return `${label}-${randomUUID().slice(0, 8)}`;
}
