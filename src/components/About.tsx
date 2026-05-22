import Image from 'next/image';

interface AboutProps {
  content: {
    title: string;
    htmlContent: string;
  };
}

const aboutImages = [
  { src: '/images/about/about-01.webp', alt: 'Lukas in action — horseback archery' },
  { src: '/images/about/about-02.webp', alt: 'Close-up of archery equipment' },
  { src: '/images/about/about-03.webp', alt: 'Horseback archery competition' },
  { src: '/images/about/about-04.webp', alt: 'Archer on horseback' },
  { src: '/images/about/about-05.webp', alt: 'Archery gear detail' },
  { src: '/images/about/about-06.webp', alt: 'Lukas Archery Works workshop' },
];

export default function About({ content }: AboutProps) {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="py-24 px-6 bg-cream-50"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <p className="section-label mb-3">Our Story</p>
          <div
            className="prose prose-cream max-w-none prose-headings:font-serif prose-headings:text-forest-900 prose-p:text-stone-dark prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.htmlContent }}
          />
        </div>

        {/* Image mosaic */}
        <div className="grid grid-cols-2 gap-3">
          {aboutImages.slice(0, 4).map((img, i) => (
            <div
              key={img.src}
              className={`relative overflow-hidden ${i === 0 ? 'col-span-2 aspect-[16/7]' : 'aspect-square'}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
