import VideoPlayer from './VideoPlayer';
import HeroParallaxLayer from './HeroParallaxLayer';
import type { HeroContent } from '@/lib/heroContent';

interface HeroProps extends HeroContent {
  videoSrc: string;
  videoPosition: string;
}

export default function Hero({ videoSrc, videoPosition, label, heading, subheading, cta }: HeroProps) {
  return (
    <section
      data-testid="hero-section"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-forest-950"
    >
      {/* Background video with parallax */}
      <HeroParallaxLayer>
        <VideoPlayer
          src={videoSrc}
          autoPlay
          controls={false}
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          objectPosition={videoPosition}
        />
      </HeroParallaxLayer>

      {/* Gradient overlay — stays fixed relative to section */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/40 to-forest-950/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="section-label text-bark-500 mb-4">{label}</p>
        <h1 className="font-serif text-5xl md:text-7xl text-cream-50 leading-tight mb-6">
          {heading}
        </h1>
        <p className="font-sans text-cream-200 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
          {subheading}
        </p>
        <a href="#products" className="btn-primary">
          {cta}
        </a>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-300">
        <span className="text-xs tracking-widest uppercase font-sans">Scroll</span>
        <div className="w-px h-10 bg-cream-300/40 animate-pulse" />
      </div>
    </section>
  );
}
