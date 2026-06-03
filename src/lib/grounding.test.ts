import { describe, it, expect } from 'vitest';
import { buildGrounding } from './grounding';
import type { Product } from './products';

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: 'arc',
    title: 'ARC',
    tagline: 'Sideback quiver',
    price: 'From €149',
    specs: [],
    techniques: [],
    features: [],
    images: [],
    ...overrides,
  };
}

describe('buildGrounding', () => {
  it("includes each product's price so the bot can quote it", () => {
    const text = buildGrounding([product({ price: 'From €149' })]);
    expect(text).toContain('From €149');
  });

  it('includes each spec label and value so the bot can answer spec questions', () => {
    const text = buildGrounding([
      product({
        specs: [
          { label: 'Material', value: 'Beef leather' },
          { label: 'Capacity', value: '30 or 45 arrows' },
        ],
      }),
    ]);
    expect(text).toContain('Material');
    expect(text).toContain('Beef leather');
    expect(text).toContain('Capacity');
    expect(text).toContain('30 or 45 arrows');
  });

  it('states the supported nocking techniques per product', () => {
    const text = buildGrounding([product({ techniques: ['Slavic', 'Thumb'] })]);
    expect(text).toContain('Slavic');
    expect(text).toContain('Thumb');
  });

  it("lists each product's features", () => {
    const text = buildGrounding([
      product({ features: ['traditional beef-leather construction', 'worn at the side'] }),
    ]);
    expect(text).toContain('traditional beef-leather construction');
    expect(text).toContain('worn at the side');
  });

  it('frames ARC as the quiver and forbids inventing products, even when ARC is not in the catalog', () => {
    const text = buildGrounding([product({ id: 'wings', title: 'WINGS', techniques: [] })]);
    expect(text).toContain('ARC');
    expect(text).toMatch(/quiver/i);
    expect(text).toMatch(/invent/i);
  });

  it('describes only the products passed in, so the bot cannot drift from the catalog', () => {
    const text = buildGrounding([
      product({ id: 'wings', title: 'WINGS', tagline: 'Nocking aid', price: '€19' }),
    ]);
    // The default ARC tagline belongs to a product that was not passed in.
    expect(text).not.toContain('Sideback quiver');
  });

  it('is deterministic — the same products always yield identical text', () => {
    const ps = [product({ specs: [{ label: 'Material', value: 'Beef leather' }] })];
    expect(buildGrounding(ps)).toBe(buildGrounding(ps));
  });
});
