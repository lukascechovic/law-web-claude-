'use client';

import { useInView, revealClasses } from '@/lib/motion';
import { useMotionPreference } from '@/components/MotionProvider';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  repeat?: boolean;
}

export default function RevealOnScroll({ children, className = '', delay = 0, repeat = false }: RevealOnScrollProps) {
  const { animationsEnabled } = useMotionPreference();
  const { ref, inView } = useInView<HTMLDivElement>({ repeat });

  return (
    <div
      ref={ref}
      className={`${animationsEnabled ? 'transition-all duration-700' : ''} ${revealClasses(inView, animationsEnabled)} ${className}`}
      style={animationsEnabled && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
