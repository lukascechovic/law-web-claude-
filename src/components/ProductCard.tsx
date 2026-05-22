'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import type { Product } from '@/lib/markdown';

interface ProductCardProps {
  product: Product;
  reverse?: boolean;
}

export default function ProductCard({ product, reverse = false }: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(0);
  const { id, title, features, images } = product;

  const mainImage = images[activeImage] ?? images[0];

  return (
    <article
      id={id}
      data-testid={`product-card-${id}`}
      className={`flex flex-col lg:flex-row gap-12 items-center ${
        reverse ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Image gallery */}
      <div className="w-full lg:w-1/2 flex flex-col gap-3">
        {mainImage && (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200">
            <Image
              src={mainImage}
              alt={`${title} — product image ${activeImage + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-opacity duration-300"
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
                className={`relative w-14 h-14 overflow-hidden border-2 transition-colors ${
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
      <div className="w-full lg:w-1/2">
        <p className="section-label mb-2">{id.toUpperCase()}</p>
        <h3 className="font-serif text-3xl md:text-4xl text-forest-900 mb-6 leading-snug">
          {title}
        </h3>
        <ul className="space-y-2">
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
      </div>
    </article>
  );
}
