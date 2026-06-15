import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getProductsSection } from './productsSection';

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), 'law-products-section-'));
});

afterEach(() => {
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function writeJson(data: unknown) {
  fs.writeFileSync(path.join(contentDir, 'section.json'), JSON.stringify(data), 'utf8');
}

describe('getProductsSection', () => {
  it('reads all fields from section.json', () => {
    writeJson({ label: 'Our Gear', heading: 'Built to Ride', subheading: 'Custom sub' });
    const result = getProductsSection({ contentDir });
    expect(result.label).toBe('Our Gear');
    expect(result.heading).toBe('Built to Ride');
    expect(result.subheading).toBe('Custom sub');
  });

  it('returns defaults when file is absent', () => {
    const result = getProductsSection({ contentDir });
    expect(result.label).toBe('The Collection');
    expect(result.heading).toBe('Gear Built for Riders');
  });

  it('returns defaults for missing individual fields', () => {
    writeJson({ label: 'Custom Label' });
    const result = getProductsSection({ contentDir });
    expect(result.label).toBe('Custom Label');
    expect(result.heading).toBe('Gear Built for Riders');
  });
});
