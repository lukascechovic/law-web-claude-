import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getProcess } from './process';

let contentDir: string;
let imagesDir: string;

beforeEach(() => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'law-process-'));
  contentDir = path.join(base, 'texts');
  imagesDir = path.join(base, 'images');
  fs.mkdirSync(contentDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(path.dirname(contentDir), { recursive: true, force: true });
});

function writeProcess(body: string) {
  fs.writeFileSync(path.join(contentDir, 'process.md'), body, 'utf8');
}

function writeImages(files: string[]) {
  const dir = path.join(imagesDir, 'process');
  fs.mkdirSync(dir, { recursive: true });
  for (const file of files) fs.writeFileSync(path.join(dir, file), '');
}

describe('getProcess', () => {
  it('parses steps in order with their title and description', () => {
    writeProcess(
      [
        '---',
        'title: How It Is Made',
        'steps:',
        '  - title: Design & CAD',
        '    description: Each part starts as a digital model.',
        '  - title: Bioplastic Production',
        '    description: Printed on demand from renewable bioplastic.',
        '---',
      ].join('\n'),
    );

    const result = getProcess({ contentDir, imagesDir });

    expect(result.title).toBe('How It Is Made');
    expect(result.steps.map(s => s.title)).toEqual([
      'Design & CAD',
      'Bioplastic Production',
    ]);
    expect(result.steps[0].description).toBe('Each part starts as a digital model.');
  });

  it('tolerates a missing process file, returning empty steps', () => {
    const result = getProcess({ contentDir, imagesDir });
    expect(result.title).toBe('');
    expect(result.steps).toEqual([]);
  });

  it('tolerates malformed frontmatter without throwing', () => {
    // Unterminated quote => invalid YAML.
    writeProcess('---\ntitle: "unterminated\n---\n');
    expect(getProcess({ contentDir, imagesDir }).steps).toEqual([]);
  });
});

describe('step images', () => {
  it('resolves a referenced image filename to a public URL when it exists', () => {
    writeImages(['process-01.webp']);
    writeProcess(
      [
        '---',
        'title: How It Is Made',
        'steps:',
        '  - title: Design',
        '    description: Modeled in CAD.',
        '    image: process-01.webp',
        '---',
      ].join('\n'),
    );

    const result = getProcess({ contentDir, imagesDir });
    expect(result.steps[0].image).toBe('/images/process/process-01.webp');
  });

  it('leaves image undefined for a step with no image reference', () => {
    writeProcess(
      [
        '---',
        'title: How It Is Made',
        'steps:',
        '  - title: Finishing',
        '    description: Final QC by hand.',
        '---',
      ].join('\n'),
    );

    const result = getProcess({ contentDir, imagesDir });
    expect(result.steps[0].image).toBeUndefined();
  });

  it('drops an image reference that points to a missing file', () => {
    writeProcess(
      [
        '---',
        'title: How It Is Made',
        'steps:',
        '  - title: Design',
        '    description: Modeled in CAD.',
        '    image: nope.webp',
        '---',
      ].join('\n'),
    );

    const result = getProcess({ contentDir, imagesDir });
    expect(result.steps[0].image).toBeUndefined();
  });
});
