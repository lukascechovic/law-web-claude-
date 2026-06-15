import Image from 'next/image';
import RevealOnScroll from '@/components/RevealOnScroll';

const ABOUT_ALT = 'Workshop — Lukas Archery Works';

interface AboutProps {
  content: {
    title: string;
    htmlContent: string;
  };
  images: string[];
}

export default function About({ content, images }: AboutProps) {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="py-24 px-6 bg-cream-50/75"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <RevealOnScroll repeat>
          <p className="section-label mb-3">Our Story</p>
          <div
            className="prose prose-cream max-w-none prose-headings:font-serif prose-headings:text-forest-900 prose-p:text-stone-dark prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.htmlContent }}
          />
        </RevealOnScroll>

        {/* Image mosaic */}
        <RevealOnScroll repeat delay={200} className="grid grid-cols-2 gap-3">
          {images.slice(0, 3).map((src, i) => (
            <div
              key={src}
              className={`relative overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-xl ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
            >
              <Image
                src={src}
                alt={ABOUT_ALT}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-[opacity,transform] duration-500 hover:scale-[1.03]"
              />
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
