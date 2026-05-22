import VideoPlayer from './VideoPlayer';

interface HeroProps {
  videoSrc: string;
  videoPosition: string;
}

export default function Hero({ videoSrc, videoPosition }: HeroProps) {
  return (
    <section
      data-testid="hero-section"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-forest-950"
    >
      {/* Background video */}
      <VideoPlayer
        src={videoSrc}
        autoPlay
        controls={false}
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        objectPosition={videoPosition}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/40 to-forest-950/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="section-label text-bark-500 mb-4">Horseback Archery Equipment</p>
        <h1 className="font-serif text-5xl md:text-7xl text-cream-50 leading-tight mb-6">
          Lukas&nbsp;Archery
          <br />
          <span className="text-bark-500">Works</span>
        </h1>
        <p className="font-sans text-cream-200 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
          Precision-crafted gear for horseback archery and speed shooting —
          built in Slovakia for riders who demand more.
        </p>
        <a href="#products" className="btn-primary">
          View Products
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
