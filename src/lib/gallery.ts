import fs from 'node:fs';
import path from 'node:path';

export interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
}

export interface GalleryOptions {
  /** Directory holding section image/video folders (`{imagesDir}/gallery/`). */
  imagesDir?: string;
}

const DEFAULT_IMAGES_DIR = path.join(process.cwd(), 'public');

const GALLERY_ALT = 'Gear in action — horseback archery';

const IMAGE_EXTENSIONS = /\.(webp|jpg|jpeg|png)$/i;
const VIDEO_EXTENSIONS = /\.(mp4|webm|mov)$/i;

function buildItem(file: string): GalleryItem {
  return {
    type: VIDEO_EXTENSIONS.test(file) ? 'video' : 'image',
    src: `/gallery/${file}`,
    alt: GALLERY_ALT,
  };
}

/**
 * Collects gallery media from `{imagesDir}/gallery/`, sorted, as public URLs.
 *
 * Content-driven (mirrors `collectImages` in products.ts, ADR-0003): the owner
 * adds media by dropping files into `content/images/gallery/`, which
 * `copy-assets.mjs` mirrors into `public/images/gallery/`. A missing folder
 * yields an empty array and never throws.
 */
export function getGallery(opts: GalleryOptions = {}): GalleryItem[] {
  const imagesDir = opts.imagesDir ?? DEFAULT_IMAGES_DIR;
  const dir = path.join(imagesDir, 'gallery');

  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }

  return files
    .filter(file => IMAGE_EXTENSIONS.test(file) || VIDEO_EXTENSIONS.test(file))
    .sort()
    .map(buildItem);
}
