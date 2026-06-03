'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import type { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  reverse?: boolean;
}

export default function ProductCard({ product, reverse = false }: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(0);
  const { id, title, tagline, price, specs, techniques, features, images } = product;

  const mainImage = images[activeImage] ?? images[0];

  return (
    <article
      id={id}
      data-testid={`product-card-${id}`}
      className={`flex flex-col lg:flex-row gap-12 items-start ${
        reverse ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Image gallery */}
      <div className="w-full lg:w-1/2 flex flex-col gap-3">
        {mainImage && (
          <div className="relative w-full h-[clamp(300px,55vh,600px)] overflow-hidden rounded-lg bg-cream-200">
            <Image
              src={mainImage}
              alt={`${title} — product image ${activeImage + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain transition-opacity duration-300"
              priority={activeImage === 0}
            />
          </div>
        )}
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {images.slice(0, 8).map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImage(i)}
                className={`relative w-14 h-14 shrink-0 overflow-hidden rounded border-2 transition-colors ${
                  i === activeImage
                    ? 'border-forest-600'
                    : 'border-cream-200 hover:border-bark-500'
                }`}
                aria-label={`View image ${i + 1} of ${title}`}
              >
                <Image
                  src={src}
                  alt={`${title} thumbnail ${i + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="w-full lg:w-1/2" data-testid={`product-content-${id}`}>
        <p className="section-label mb-2">{id.toUpperCase()}</p>
        <h3 className="font-serif text-3xl md:text-4xl text-forest-900 mb-3 leading-snug">
          {title}
        </h3>
        {tagline && (
          <p className="font-sans text-stone-mid text-base leading-relaxed mb-4">
            {tagline}
          </p>
        )}
        {price && (
          <p
            data-testid={`product-price-${id}`}
            className="font-serif text-xl text-forest-700 mb-6"
          >
            {price}
          </p>
        )}

        <ul className="space-y-2 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-stone-dark font-sans text-sm leading-relaxed">
              <CheckCircle2
                size={16}
                aria-hidden="true"
                className="text-forest-600 shrink-0 mt-0.5"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {techniques.length > 0 && (
          <div className="mb-6" data-testid={`product-techniques-${id}`}>
            <p className="section-label mb-2">Nocking techniques</p>
            <div className="flex flex-wrap gap-2">
              {techniques.map(technique => (
                <span
                  key={technique}
                  className="rounded-full border border-bark-500/40 bg-cream-50 px-3 py-1 font-sans text-xs text-bark-600"
                >
                  {technique}
                </span>
              ))}
            </div>
          </div>
        )}

        {specs.length > 0 && (
          <dl
            data-testid={`product-specs-${id}`}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 border-t border-cream-200 pt-5"
          >
            {specs.map(spec => (
              <div key={spec.label} className="flex flex-col">
                <dt className="font-sans text-xs uppercase tracking-wide text-bark-500">
                  {spec.label}
                </dt>
                <dd className="font-sans text-sm text-stone-dark leading-snug">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}
