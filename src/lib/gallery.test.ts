import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getGallery } from './gallery';

let base: string;
let imagesDir: string;

beforeEach(() => {
  base = fs.mkdtempSync(path.join(os.tmpdir(), 'law-gallery-'));
  imagesDir = path.join(base, 'images');
  fs.mkdirSync(imagesDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(base, { recursive: true, force: true });
});

function writeGalleryImages(files: string[]) {
  const dir = path.join(imagesDir, 'gallery');
  fs.mkdirSync(dir, { recursive: true });
  for (const file of files) fs.writeFileSync(path.join(dir, file), '');
}

describe('getGallery', () => {
  it('collects image files from the gallery folder, sorted, as public URLs', () => {
    writeGalleryImages(['gallery-02.webp', 'gallery-01.webp', 'gallery-03.webp']);

    expect(getGallery({ imagesDir })).toEqual([
      { type: 'image', src: '/images/gallery/gallery-01.webp', alt: 'Gear in action — horseback archery' },
      { type: 'image', src: '/images/gallery/gallery-02.webp', alt: 'Gear in action — horseback archery' },
      { type: 'image', src: '/images/gallery/gallery-03.webp', alt: 'Gear in action — horseback archery' },
    ]);
  });

  it('classifies video files as video items and ignores non-media files', () => {
    writeGalleryImages(['gallery-01.webp', 'clip.mp4', 'README.md', 'notes.txt']);

    expect(getGallery({ imagesDir })).toEqual([
      { type: 'video', src: '/images/gallery/clip.mp4', alt: 'Gear in action — horseback archery' },
      { type: 'image', src: '/images/gallery/gallery-01.webp', alt: 'Gear in action — horseback archery' },
    ]);
  });

  it('tolerates a missing gallery folder and returns an empty array', () => {
    expect(getGallery({ imagesDir })).toEqual([]);
  });
});
