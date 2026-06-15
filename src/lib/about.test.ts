import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getAboutImages } from './about';

let base: string;
let imagesDir: string;

beforeEach(() => {
  base = fs.mkdtempSync(path.join(os.tmpdir(), 'law-about-'));
  imagesDir = base;
});

afterEach(() => {
  fs.rmSync(base, { recursive: true, force: true });
});

function writeAboutImages(files: string[]) {
  const dir = path.join(imagesDir, 'about');
  fs.mkdirSync(dir, { recursive: true });
  for (const file of files) fs.writeFileSync(path.join(dir, file), '');
}

describe('getAboutImages', () => {
  it('returns sorted /about/ URLs for webp files in the about folder', () => {
    writeAboutImages(['about-03.webp', 'about-01.webp', 'about-02.webp']);

    expect(getAboutImages({ imagesDir })).toEqual([
      '/about/about-01.webp',
      '/about/about-02.webp',
      '/about/about-03.webp',
    ]);
  });

  it('returns an empty array when the about folder does not exist', () => {
    expect(getAboutImages({ imagesDir })).toEqual([]);
  });
});
