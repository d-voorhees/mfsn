import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

// Write access without a .env token: fall back to the login the Sanity CLI
// already holds (`npx sanity login`, stored in ~/.config/sanity/config.json).
// An explicit SANITY_API_TOKEN still wins if set.
function cliToken() {
  try {
    const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
    return JSON.parse(fs.readFileSync(file, 'utf8')).authToken;
  } catch {
    return undefined;
  }
}

export const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'js71ru0h',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2026-01-01',
  token: process.env.SANITY_API_TOKEN || cliToken(),
  useCdn: false,
});
