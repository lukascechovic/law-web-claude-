'use client';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  className?: string;
}

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  controls = true,
  loop = false,
  className = '',
}: VideoPlayerProps) {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      muted={autoPlay}
      loop={loop}
      playsInline
      controls={controls}
      className={className}
    />
  );
}
