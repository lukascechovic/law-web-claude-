import fs from 'node:fs';
import path from 'node:path';

export interface AboutImageOptions {
  imagesDir?: string;
}

const DEFAULT_IMAGES_DIR = path.join(process.cwd(), 'public');

export function getAboutImages(opts: AboutImageOptions = {}): string[] {
  const imagesDir = opts.imagesDir ?? DEFAULT_IMAGES_DIR;
  const dir = path.join(imagesDir, 'about');

  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }

  return files
    .filter(file => /\.webp$/i.test(file))
    .sort()
    .map(file => `/about/${file}`);
}
