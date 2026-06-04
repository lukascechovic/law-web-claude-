import type { Product } from './products';

export function productToJsonLd(product: Product): Record<string, unknown> {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.tagline,
    offers: {
      '@type': 'Offer',
      price: product.price,
    },
  };

  if (product.images.length > 0) {
    base.image = product.images[0];
  }

  return base;
}
