'use client';

import { useMotionPreference } from '@/components/MotionProvider';

export default function AnimationToggle() {
  const { animationsEnabled, toggle } = useMotionPreference();

  return (
    <button
      onClick={toggle}
      aria-pressed={animationsEnabled}
      aria-label={animationsEnabled ? 'Animations on' : 'Animations off'}
      className="text-cream-200 hover:text-cream-50 font-sans text-xs tracking-wide transition-colors duration-150 border border-cream-200/30 rounded px-2 py-1 hover:border-cream-50/50"
    >
      {animationsEnabled ? '✦ Animations' : '✦ Static'}
    </button>
  );
}
