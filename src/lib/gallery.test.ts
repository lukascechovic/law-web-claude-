import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getGallery } from './gallery';

let base: string;
let imagesDir: string;
let contentDir: string;

beforeEach(() => {
  base = fs.mkdtempSync(path.join(os.tmpdir(), 'law-gallery-'));
  imagesDir = base;
  contentDir = path.join(base, 'content-gallery');
  fs.mkdirSync(contentDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(base, { recursive: true, force: true });
});

function writeGalleryImages(files: string[]) {
  const dir = path.join(imagesDir, 'gallery');
  fs.mkdirSync(dir, { recursive: true });
  for (const file of files) fs.writeFileSync(path.join(dir, file), '');
}

function writeSectionJson(data: unknown) {
  fs.writeFileSync(path.join(contentDir, 'section.json'), JSON.stringify(data), 'utf8');
}

describe('getGallery — items', () => {
  it('collects image files from the gallery folder, sorted, as public URLs', () => {
    writeGalleryImages(['gallery-02.webp', 'gallery-01.webp', 'gallery-03.webp']);

    const { items } = getGallery({ imagesDir, contentDir });
    expect(items).toEqual([
      { type: 'image', src: '/gallery/gallery-01.webp', alt: 'Gear in action — horseback archery' },
      { type: 'image', src: '/gallery/gallery-02.webp', alt: 'Gear in action — horseback archery' },
      { type: 'image', src: '/gallery/gallery-03.webp', alt: 'Gear in action — horseback archery' },
    ]);
  });

  it('classifies video files as video items and ignores non-media files', () => {
    writeGalleryImages(['gallery-01.webp', 'clip.mp4', 'README.md', 'notes.txt']);

    const { items } = getGallery({ imagesDir, contentDir });
    expect(items).toEqual([
      { type: 'video', src: '/gallery/clip.mp4', alt: 'Gear in action — horseback archery' },
      { type: 'image', src: '/gallery/gallery-01.webp', alt: 'Gear in action — horseback archery' },
    ]);
  });

  it('tolerates a missing gallery folder and returns empty items', () => {
    const { items } = getGallery({ imagesDir, contentDir });
    expect(items).toEqual([]);
  });
});

describe('getGallery — section metadata', () => {
  it('reads label, heading, and subheading from section.json', () => {
    writeSectionJson({ label: 'Custom Label', heading: 'Custom Heading', subheading: 'Custom sub' });

    const { label, heading, subheading } = getGallery({ imagesDir, contentDir });
    expect(label).toBe('Custom Label');
    expect(heading).toBe('Custom Heading');
    expect(subheading).toBe('Custom sub');
  });

  it('falls back to defaults when section.json is absent', () => {
    const { label, heading, subheading } = getGallery({ imagesDir, contentDir });
    expect(label).toBe('In Action');
    expect(heading).toBe('The Gear at Full Gallop');
    expect(subheading).toBe('Riders and their kit on the field — quivers, nocking aids, and bows where they belong.');
  });

  it('falls back to defaults for individual missing fields', () => {
    writeSectionJson({ label: 'My Label' });

    const { label, heading, subheading } = getGallery({ imagesDir, contentDir });
    expect(label).toBe('My Label');
    expect(heading).toBe('The Gear at Full Gallop');
    expect(subheading).toBe('Riders and their kit on the field — quivers, nocking aids, and bows where they belong.');
  });

  it('falls back to defaults when section.json contains invalid JSON', () => {
    fs.writeFileSync(path.join(contentDir, 'section.json'), 'not valid json', 'utf8');

    const { label } = getGallery({ imagesDir, contentDir });
    expect(label).toBe('In Action');
  });
});
