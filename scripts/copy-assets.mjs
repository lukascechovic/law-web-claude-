import { cpSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const copies = [
  ['content/images/brand',   'public/images/brand'],
  ['content/images/about',   'public/images/about'],
  ['content/images/wings',   'public/images/wings'],
  ['content/images/arc',     'public/images/arc'],
  ['content/images/horizon', 'public/images/horizon'],
  ['content/videos',         'public/videos'],
  ['content/promo',          'public/promo'],
];

for (const [src, dest] of copies) {
  const srcPath = join(root, src);
  const destPath = join(root, dest);
  if (!existsSync(srcPath)) {
    console.warn(`Skipping missing source: ${src}`);
    continue;
  }
  mkdirSync(destPath, { recursive: true });
  cpSync(srcPath, destPath, { recursive: true });
  console.log(`Copied ${src} -> ${dest}`);
}
