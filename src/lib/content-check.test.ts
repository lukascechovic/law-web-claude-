import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  validateProduct,
  validateReview,
  checkContent,
  type ContentReport,
} from './content-check';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'law-content-check-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ─── validateProduct ────────────────────────────────────────────────────────

describe('validateProduct', () => {
  it('passes a fully valid product file', () => {
    const md = [
      '---',
      'title: WINGS',
      'tagline: A precision nocking aid',
      'price: Price on request',
      'techniques:',
      '  - Slavic',
      'specs:',
      '  - label: Material',
      '    value: Bioplastic',
      '---',
      '- Game-changing nocking aid',
    ].join('\n');

    expect(validateProduct('wings', md)).toEqual([]);
  });

  it('reports missing title', () => {
    const md = '---\ntagline: Something\nprice: €10\n---\n- feature';
    const errors = validateProduct('wings', md);
    expect(errors.some(e => e.includes('title'))).toBe(true);
  });

  it('reports missing tagline', () => {
    const md = '---\ntitle: WINGS\nprice: €10\n---\n- feature';
    expect(validateProduct('wings', md).some(e => e.includes('tagline'))).toBe(true);
  });

  it('reports missing price', () => {
    const md = '---\ntitle: WINGS\ntagline: Aid\n---\n- feature';
    expect(validateProduct('wings', md).some(e => e.includes('price'))).toBe(true);
  });

  it('reports empty feature list', () => {
    const md = '---\ntitle: WINGS\ntagline: Aid\nprice: €10\n---\n';
    expect(validateProduct('wings', md).some(e => e.includes('feature'))).toBe(true);
  });

  it('reports malformed YAML', () => {
    const md = '---\ntitle: "unterminated\n---\n- feature';
    expect(validateProduct('wings', md).some(e => e.toLowerCase().includes('parse'))).toBe(true);
  });
});

// ─── validateReview ──────────────────────────────────────────────────────────

describe('validateReview', () => {
  it('passes a fully valid review file', () => {
    const md = [
      '---',
      'author: Maria Kovac',
      'role: Competitive horseback archer',
      '---',
      'Great quiver, holds up perfectly.',
    ].join('\n');

    expect(validateReview('01-maria', md)).toEqual([]);
  });

  it('reports missing author', () => {
    const md = '---\nrole: Archer\n---\nGood product.';
    expect(validateReview('01-maria', md).some(e => e.includes('author'))).toBe(true);
  });

  it('reports missing role', () => {
    const md = '---\nauthor: Maria\n---\nGood product.';
    expect(validateReview('01-maria', md).some(e => e.includes('role'))).toBe(true);
  });

  it('reports empty review body', () => {
    const md = '---\nauthor: Maria\nrole: Archer\n---\n';
    expect(validateReview('01-maria', md).some(e => e.includes('body'))).toBe(true);
  });
});

// ─── checkContent (full directory audit) ────────────────────────────────────

describe('checkContent', () => {
  function writeFile(rel: string, content: string) {
    const full = path.join(tmpDir, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, 'utf8');
  }

  function makeImageDir(rel: string, files: string[]) {
    const dir = path.join(tmpDir, rel);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of files) fs.writeFileSync(path.join(dir, f), '');
  }

  it('returns a passing report for a fully valid content directory', () => {
    writeFile(
      'products/wings.md',
      '---\ntitle: WINGS\ntagline: Aid\nprice: €10\n---\n- feature',
    );
    makeImageDir('products/wings', ['wings-01.webp']);
    writeFile('reviews/01-maria.md', '---\nauthor: Maria\nrole: Archer\n---\nGreat product.');

    const report: ContentReport = checkContent(tmpDir);

    expect(report.ok).toBe(true);
    expect(report.issues).toHaveLength(0);
  });

  it('surfaces errors from invalid product and review files', () => {
    writeFile('products/wings.md', '---\ntagline: Aid\n---\n- feature'); // missing title & price
    writeFile('reviews/01-maria.md', '---\nauthor: Maria\n---\nGood.'); // missing role

    const report = checkContent(tmpDir);

    expect(report.ok).toBe(false);
    expect(report.issues.some(i => i.file.includes('wings'))).toBe(true);
    expect(report.issues.some(i => i.file.includes('01-maria'))).toBe(true);
  });

  it('reports a product image folder with no images', () => {
    writeFile(
      'products/wings.md',
      '---\ntitle: WINGS\ntagline: Aid\nprice: €10\n---\n- feature',
    );
    makeImageDir('products/wings', []); // folder exists but empty

    const report = checkContent(tmpDir);

    expect(report.ok).toBe(false);
    expect(report.issues.some(i => i.errors.some(e => e.includes('image')))).toBe(true);
  });

  it('reports a product with no image folder at all', () => {
    writeFile(
      'products/arc.md',
      '---\ntitle: ARC\ntagline: Quiver\nprice: €100\n---\n- feature',
    );
    // no images/arc/ folder created

    const report = checkContent(tmpDir);

    expect(report.ok).toBe(false);
    expect(report.issues.some(i => i.errors.some(e => e.includes('image')))).toBe(true);
  });

  it('tolerates an empty content directory without throwing', () => {
    expect(() => checkContent(tmpDir)).not.toThrow();
  });
});
