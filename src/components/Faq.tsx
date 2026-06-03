import { ChevronDown } from 'lucide-react';
import type { Faq as FaqData } from '@/lib/faq';

interface FaqProps {
  faq: FaqData;
}

export default function Faq({ faq }: FaqProps) {
  if (faq.items.length === 0) return null;

  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="py-24 px-6 bg-cream-50/75"
    >
      <div className="mx-auto max-w-3xl">
        <p className="section-label mb-3">Questions &amp; Answers</p>
        <h2 className="font-serif text-3xl md:text-4xl text-forest-900 mb-10">
          {faq.title}
        </h2>

        <dl className="space-y-4">
          {faq.items.map((item, index) => (
            <details
              key={index}
              data-testid={`faq-item-${index}`}
              className="group rounded-lg border border-bark-500/20 bg-cream-50 px-5 py-4 shadow-sm transition-colors hover:border-bark-500/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-forest-900 marker:content-none">
                <dt>{item.question}</dt>
                <ChevronDown
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-bark-600 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <dd className="mt-3 leading-relaxed text-stone-dark">
                {item.answer}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
