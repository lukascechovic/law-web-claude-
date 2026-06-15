import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getProduct, getProducts } from './products';

let contentDir: string;
let imagesDir: string;

beforeEach(() => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'law-products-'));
  contentDir = path.join(base, 'products');
  imagesDir = path.join(base, 'products');
  fs.mkdirSync(contentDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(path.dirname(contentDir), { recursive: true, force: true });
});

function writeProduct(id: string, body: string) {
  fs.writeFileSync(path.join(contentDir, `${id}.md`), body, 'utf8');
}

function writeImages(id: string, files: string[]) {
  const dir = path.join(imagesDir, id);
  fs.mkdirSync(dir, { recursive: true });
  for (const file of files) fs.writeFileSync(path.join(dir, file), '');
}

describe('getProduct', () => {
  it('parses a product file into id, title, tagline, price, and features', () => {
    writeProduct(
      'wings',
      [
        '---',
        'title: Arrow Nocking Aid WINGS',
        'tagline: Secure, fast nocking',
        'price: From €19',
        '---',
        '- game-changing aid for secure nocking',
        '- tuned for arrow diameter',
      ].join('\n'),
    );

    const product = getProduct('wings', { contentDir, imagesDir });

    expect(product).toBeDefined();
    expect(product!.id).toBe('wings');
    expect(product!.title).toBe('Arrow Nocking Aid WINGS');
    expect(product!.tagline).toBe('Secure, fast nocking');
    expect(product!.price).toBe('From €19');
    expect(product!.features).toEqual([
      'game-changing aid for secure nocking',
      'tuned for arrow diameter',
    ]);
  });
});

describe('getProducts (dynamic discovery)', () => {
  it('discovers every product file, deriving the id from the filename', () => {
    writeProduct('wings', '---\ntitle: WINGS\n---\n- feature a');
    writeProduct('arc', '---\ntitle: ARC\n---\n- feature b');

    const products = getProducts({ contentDir, imagesDir });

    expect(products.map(p => p.id).sort()).toEqual(['arc', 'wings']);
  });

  it('picks up a newly-added product file with no code change', () => {
    writeProduct('wings', '---\ntitle: WINGS\n---\n- feature a');
    expect(getProducts({ contentDir, imagesDir })).toHaveLength(1);

    writeProduct('horizon', '---\ntitle: HORIZON\n---\n- feature c');
    const products = getProducts({ contentDir, imagesDir });

    expect(products.map(p => p.id).sort()).toEqual(['horizon', 'wings']);
  });
});

describe('specs', () => {
  it('parses an ordered list of label/value spec pairs', () => {
    writeProduct(
      'arc',
      [
        '---',
        'title: ARC',
        'specs:',
        '  - label: Material',
        '    value: Beef leather',
        '  - label: Capacity',
        '    value: 30 or 45 arrows',
        '---',
        '- feature',
      ].join('\n'),
    );

    const product = getProduct('arc', { contentDir, imagesDir });

    expect(product!.specs).toEqual([
      { label: 'Material', value: 'Beef leather' },
      { label: 'Capacity', value: '30 or 45 arrows' },
    ]);
  });

  it('defaults specs to an empty array when none are given', () => {
    writeProduct('wings', '---\ntitle: WINGS\n---\n- feature');
    expect(getProduct('wings', { contentDir, imagesDir })!.specs).toEqual([]);
  });
});

describe('techniques', () => {
  it('reads the supported nocking techniques as a string array', () => {
    writeProduct(
      'arc',
      '---\ntitle: ARC\ntechniques:\n  - Slavic\n  - Thumb\n---\n- feature',
    );
    expect(getProduct('arc', { contentDir, imagesDir })!.techniques).toEqual([
      'Slavic',
      'Thumb',
    ]);
  });

  it('does not infer techniques across products (HORIZON lists only Slavic)', () => {
    writeProduct('horizon', '---\ntitle: HORIZON\ntechniques:\n  - Slavic\n---\n- feature');
    expect(getProduct('horizon', { contentDir, imagesDir })!.techniques).toEqual([
      'Slavic',
    ]);
  });

  it('defaults techniques to an empty array when none are given', () => {
    writeProduct('wings', '---\ntitle: WINGS\n---\n- feature');
    expect(getProduct('wings', { contentDir, imagesDir })!.techniques).toEqual([]);
  });
});

describe('images', () => {
  it('collects images from the product folder, sorted, as public URLs', () => {
    writeProduct('wings', '---\ntitle: WINGS\n---\n- feature');
    writeImages('wings', ['wings-02.webp', 'wings-01.webp', 'wings-03.webp']);

    expect(getProduct('wings', { contentDir, imagesDir })!.images).toEqual([
      '/products/wings/wings-01.webp',
      '/products/wings/wings-02.webp',
      '/products/wings/wings-03.webp',
    ]);
  });

  it('ignores non-image files and tolerates a missing image folder', () => {
    writeProduct('arc', '---\ntitle: ARC\n---\n- feature');
    writeImages('arc', ['arc-01.webp', 'README.md', 'notes.txt']);

    const arc = getProduct('arc', { contentDir, imagesDir });
    expect(arc!.images).toEqual(['/products/arc/arc-01.webp']);

    // horizon has a file but no image folder — must not throw, just empty.
    writeProduct('horizon', '---\ntitle: HORIZON\n---\n- feature');
    expect(getProduct('horizon', { contentDir, imagesDir })!.images).toEqual([]);
  });
});

describe('malformed / missing input', () => {
  it('returns undefined for a missing product file instead of throwing', () => {
    expect(getProduct('does-not-exist', { contentDir, imagesDir })).toBeUndefined();
  });

  it('returns undefined for a file with malformed frontmatter', () => {
    // Unterminated quote => invalid YAML.
    writeProduct('broken', '---\ntitle: "unterminated\n---\n- feature');
    expect(getProduct('broken', { contentDir, imagesDir })).toBeUndefined();
  });

  it('returns undefined for a file with no title', () => {
    writeProduct('untitled', '---\ntagline: no title here\n---\n- feature');
    expect(getProduct('untitled', { contentDir, imagesDir })).toBeUndefined();
  });

  it('omits malformed files from getProducts but keeps the valid ones', () => {
    writeProduct('wings', '---\ntitle: WINGS\n---\n- feature');
    writeProduct('broken', '---\ntitle: "unterminated\n---\n- feature');

    const products = getProducts({ contentDir, imagesDir });

    expect(products.map(p => p.id)).toEqual(['wings']);
  });
});
