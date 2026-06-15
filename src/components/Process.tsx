import Image from 'next/image';
import { Hammer } from 'lucide-react';
import type { Process as ProcessData } from '@/lib/process';
import RevealOnScroll from '@/components/RevealOnScroll';

interface ProcessProps {
  process: ProcessData;
}

export default function Process({ process }: ProcessProps) {
  if (process.steps.length === 0) return null;

  return (
    <section
      id="process"
      data-testid="process-section"
      className="py-24 px-6 bg-cream-100/75"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll repeat className="max-w-2xl mb-16">
          <p className="section-label mb-3">{process.label}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900">
            {process.title || 'How It Is Made'}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll repeat delay={150}>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {process.steps.map((step, i) => (
            <li
              key={step.title}
              data-testid={`process-step-${i}`}
              className="flex flex-col"
            >
              {step.image ? (
                <div className="relative aspect-video overflow-hidden rounded-lg mb-5 transition-shadow duration-300 hover:shadow-xl">
                  <Image
                    src={step.image}
                    alt={`${step.title} — Lukas Archery Works craftsmanship`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-[opacity,transform] duration-500 hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg mb-5 bg-forest-900/5 text-bark-500">
                  <Hammer size={40} aria-hidden="true" />
                </div>
              )}

              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl text-bark-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl text-forest-900">
                  {step.title}
                </h3>
              </div>
              <p className="mt-3 text-stone-dark leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        </RevealOnScroll>
      </div>
    </section>
  );
}
