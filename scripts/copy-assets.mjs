import sharp from 'sharp';
import { cpSync, mkdirSync, existsSync, readdirSync, rmSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const IMAGE_EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

const imageCopies = [
  ['content/images/brand',   'public/images/brand'],
  ['content/images/about',   'public/images/about'],
  ['content/images/wings',   'public/images/wings'],
  ['content/images/arc',     'public/images/arc'],
  ['content/images/horizon', 'public/images/horizon'],
];

const binaryCopies = [
  ['content/videos',         'public/videos'],
  ['content/promo',          'public/promo'],
];

async function copyImagesWithNormalizedOrientation(srcPath, destPath) {
  mkdirSync(destPath, { recursive: true });

  for (const entry of readdirSync(srcPath, { withFileTypes: true })) {
    const src = join(srcPath, entry.name);
    const dest = join(destPath, entry.name);

    if (entry.isDirectory()) {
      cpSync(src, dest, { recursive: true });
      continue;
    }

    if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      const pipeline = sharp(src).rotate();
      const metadata = await pipeline.metadata();

      // The source set is prepared for height-first display. If pixels are landscape,
      // rotate once so the longer side becomes height in the generated web assets.
      if ((metadata.width ?? 0) > (metadata.height ?? 0)) {
        pipeline.rotate(90);
      }

      await pipeline.toFile(dest);
      continue;
    }

    cpSync(src, dest);
  }
}

// Clear Next.js optimized image cache so stale transformed variants are not reused.
rmSync(join(root, '.next/cache/images'), { recursive: true, force: true });

for (const [src, dest] of imageCopies) {
  const srcPath = join(root, src);
  const destPath = join(root, dest);
  if (!existsSync(srcPath)) {
    console.warn(`Skipping missing source: ${src}`);
    continue;
  }

  rmSync(destPath, { recursive: true, force: true });
  await copyImagesWithNormalizedOrientation(srcPath, destPath);
  console.log(`Processed ${src} -> ${dest}`);
}

for (const [src, dest] of binaryCopies) {
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
