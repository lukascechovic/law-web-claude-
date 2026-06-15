import { Quote } from 'lucide-react';
import type { ReviewsSection } from '@/lib/reviews';
import VideoPlayer from './VideoPlayer';
import RevealOnScroll from '@/components/RevealOnScroll';

type ReviewsProps = Omit<ReviewsSection, never>;

/** Convert a YouTube watch/share URL into a privacy-friendly embed URL, or null if not YouTube. */
function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

function ReviewMedia({ review }: { review: ReviewsSection['reviews'][number] }) {
  if (!review.video) return null;

  const embed = youtubeEmbedUrl(review.video);
  if (embed) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          src={embed}
          title={`Video testimonial from ${review.author}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  // Local mp4 (e.g. /videos/*.mp4).
  return (
    <VideoPlayer
      src={review.video}
      controls
      className="aspect-video w-full rounded-lg object-cover"
    />
  );
}

export default function Reviews({ label, heading, subheading, reviews }: ReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section
      id="reviews"
      data-testid="reviews-section"
      className="py-24 px-6 bg-cream-50/75"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <RevealOnScroll repeat className="text-center mb-20">
          <p className="section-label mb-3">{label}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900 leading-tight">
            {heading}
          </h2>
          <p className="mt-4 font-sans text-stone-mid max-w-xl mx-auto text-base leading-relaxed">
            {subheading}
          </p>
        </RevealOnScroll>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {reviews.map((review, i) => (
            <RevealOnScroll repeat key={review.id} delay={i * 100}>
            <figure
              data-testid={`review-${review.id}`}
              className="flex flex-col gap-5 rounded-xl bg-cream-100/80 p-8 shadow-sm"
            >
              <ReviewMedia review={review} />

              <Quote
                className="h-8 w-8 text-bark-500"
                aria-hidden="true"
              />

              <blockquote className="font-serif text-lg italic text-stone-dark leading-relaxed">
                {review.quote}
              </blockquote>

              <figcaption className="mt-auto">
                <p className="font-sans font-semibold text-forest-900">
                  {review.author}
                </p>
                {review.role && (
                  <p className="font-sans text-sm text-stone-mid">
                    {review.role}
                  </p>
                )}
              </figcaption>
            </figure>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
