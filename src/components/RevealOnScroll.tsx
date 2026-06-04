'use client';

import { useInView, revealClasses } from '@/lib/motion';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  repeat?: boolean;
}

export default function RevealOnScroll({ children, className = '', delay = 0, repeat = false }: RevealOnScrollProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ repeat });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${revealClasses(inView)} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
