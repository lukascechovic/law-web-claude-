import { useEffect, useRef, useState } from 'react';

export function revealClasses(inView: boolean, animationsEnabled = true): string {
  if (!animationsEnabled || inView) {
    return 'opacity-100 translate-y-0';
  }
  return 'opacity-0 translate-y-8';
}

export function useInView<T extends Element = Element>(
  { repeat = false, ...observerOptions }: IntersectionObserverInit & { repeat?: boolean } = {},
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setInView(false);
        }
      },
      { threshold: 0.12, ...observerOptions },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

export function useParallax<T extends HTMLElement = HTMLElement>(factor = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      ref.current.style.transform = `translateY(${window.scrollY * factor}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [factor]);

  return ref;
}
