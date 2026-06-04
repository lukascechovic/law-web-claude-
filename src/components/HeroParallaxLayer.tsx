'use client';

import { useParallax } from '@/lib/motion';

export default function HeroParallaxLayer({ children }: { children: React.ReactNode }) {
  const ref = useParallax<HTMLDivElement>(0.5);

  return (
    <div
      ref={ref}
      data-testid="hero-parallax"
      className="absolute inset-0 will-change-transform"
    >
      {children}
    </div>
  );
}
