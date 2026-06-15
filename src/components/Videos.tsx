import type { Video } from '@/lib/videos';
import RevealOnScroll from '@/components/RevealOnScroll';

interface VideosProps {
  videos: Video[];
}

export default function Videos({ videos }: VideosProps) {
  if (videos.length === 0) return null;

  return (
    <section
      id="videos"
      data-testid="videos-section"
      className="py-24 px-6 bg-cream-50/75"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll repeat className="text-center mb-20">
          <p className="section-label mb-3">In Action</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900 leading-tight">
            See It Ride
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {videos.map((video, i) => (
            <RevealOnScroll repeat key={video.embedUrl} delay={i * 100}>
              <article
                data-testid={`video-card-${i}`}
                className="flex flex-col gap-4 rounded-xl bg-cream-100/80 p-6 shadow-sm"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <h3 className="font-serif text-xl text-forest-900">{video.title}</h3>
                <p className="font-sans text-stone-dark leading-relaxed text-sm">
                  {video.description}
                </p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
