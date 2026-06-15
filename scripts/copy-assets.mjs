import sharp from 'sharp';
import { cpSync, mkdirSync, existsSync, readdirSync, rmSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const IMAGE_EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

// Discover product image subfolders dynamically so adding a new product is a
// content edit — drop a folder under content/products/, no code change here.
// Mirrors the dynamic product discovery in src/lib/products.ts (ADR-0003).
const productsSourceRoot = 'content/03-products';
const productImageCopies = existsSync(join(root, productsSourceRoot))
  ? readdirSync(join(root, productsSourceRoot), { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => [
        `${productsSourceRoot}/${entry.name}`,
        `public/products/${entry.name}`,
      ])
  : [];

const imageCopies = [
  ['content/02-about',   'public/about'],
  ['content/06-gallery', 'public/gallery'],
  ['content/04-process', 'public/process'],
  ...productImageCopies,
];

const binaryCopies = [
  ['content/01-hero',   'public/hero'],
  ['content/brand',  'public/brand'],
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
