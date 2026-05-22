'use client';

import { cn } from '@/lib/utils';

interface BackgroundComponentsProps {
  className?: string;
}

export default function BackgroundComponents({ className }: BackgroundComponentsProps) {
  return (
    <div
      className={cn('absolute inset-0 z-0 pointer-events-none', className)}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(30, 24, 10, 0.26) 0, rgba(30, 24, 10, 0.26) 1.4px, transparent 1.4px, transparent 14px), repeating-linear-gradient(-45deg, rgba(30, 24, 10, 0.26) 0, rgba(30, 24, 10, 0.26) 1.4px, transparent 1.4px, transparent 14px)',
          backgroundSize: '28px 28px',
          opacity: 0.95,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255, 249, 145, 0.95) 0%, rgba(255, 249, 145, 0.45) 35%, transparent 72%)',
          opacity: 0.85,
          mixBlendMode: 'multiply',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255, 245, 170, 0.25) 0%, rgba(255, 245, 170, 0.12) 40%, transparent 70%)',
        }}
      />
    </div>
  );
}