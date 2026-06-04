import { describe, it, expect } from 'vitest';
import type { Product } from './products';
import { productToJsonLd } from './jsonld';

const baseProduct: Product = {
  id: 'wings',
  title: 'Arrow Nocking Aid WINGS',
  tagline: 'Secure, fast nocking for horseback archery',
  price: 'From €19',
  specs: [],
  techniques: [],
  features: [],
  images: ['/images/wings/wings-01.webp', '/images/wings/wings-02.webp'],
};

describe('productToJsonLd', () => {
  it('maps product to JSON-LD Product schema with required fields', () => {
    const jsonld = productToJsonLd(baseProduct);

    expect(jsonld['@context']).toBe('https://schema.org');
    expect(jsonld['@type']).toBe('Product');
    expect(jsonld.name).toBe('Arrow Nocking Aid WINGS');
    expect(jsonld.description).toBe('Secure, fast nocking for horseback archery');
    expect(jsonld.offers).toMatchObject({ '@type': 'Offer', price: 'From €19' });
  });

  it('uses the first image as the image field', () => {
    const jsonld = productToJsonLd(baseProduct);
    expect(jsonld.image).toBe('/images/wings/wings-01.webp');
  });

  it('omits image field when product has no images', () => {
    const jsonld = productToJsonLd({ ...baseProduct, images: [] });
    expect('image' in jsonld).toBe(false);
  });
});
