import Image from 'next/image';
import type { GallerySection } from '@/lib/gallery';
import VideoPlayer from './VideoPlayer';
import RevealOnScroll from '@/components/RevealOnScroll';

type GalleryProps = Omit<GallerySection, never>;

export default function Gallery({ label, heading, subheading, items }: GalleryProps) {
  return (
    <section
      id="gallery"
      data-testid="gallery-section"
      className="py-24 px-6 bg-cream-50/75"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <RevealOnScroll repeat className="text-center mb-16">
          <p className="section-label mb-3">{label}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900 leading-tight">
            {heading}
          </h2>
          <p className="mt-4 font-sans text-stone-dark max-w-xl mx-auto text-base leading-relaxed">
            {subheading}
          </p>
        </RevealOnScroll>

        {/* Responsive media grid */}
        <RevealOnScroll repeat delay={150}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {items.map((item, i) => (
            <div
              key={item.src}
              data-testid={`gallery-item-${i}`}
              className="relative overflow-hidden rounded-lg aspect-square bg-forest-950/5 transition-shadow duration-300 hover:shadow-xl"
            >
              {item.type === 'video' ? (
                <VideoPlayer
                  src={item.src}
                  controls
                  loop
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt ?? 'Gear in action — horseback archery'}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-[opacity,transform] duration-500 hover:scale-[1.03]"
                />
              )}
            </div>
          ))}
        </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
