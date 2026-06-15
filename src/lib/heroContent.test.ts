import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getHeroContent } from './heroContent';

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), 'law-hero-'));
});

afterEach(() => {
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function writeJson(data: unknown) {
  fs.writeFileSync(path.join(contentDir, 'hero.json'), JSON.stringify(data), 'utf8');
}

describe('getHeroContent', () => {
  it('reads all fields from hero.json', () => {
    writeJson({ label: 'My Label', heading: 'My Heading', subheading: 'My sub', cta: 'Shop Now' });
    const result = getHeroContent({ contentDir });
    expect(result.label).toBe('My Label');
    expect(result.heading).toBe('My Heading');
    expect(result.subheading).toBe('My sub');
    expect(result.cta).toBe('Shop Now');
  });

  it('returns defaults when file is absent', () => {
    const result = getHeroContent({ contentDir });
    expect(result.label).toBe('Horseback Archery Equipment');
    expect(result.heading).toBe('Lukas Archery Works');
    expect(result.cta).toBe('View Products');
  });

  it('returns defaults for missing individual fields', () => {
    writeJson({ label: 'Custom' });
    const result = getHeroContent({ contentDir });
    expect(result.label).toBe('Custom');
    expect(result.heading).toBe('Lukas Archery Works');
  });
});
