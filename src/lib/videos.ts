import fs from 'node:fs';
import path from 'node:path';

export interface Video {
  title: string;
  description: string;
  embedUrl: string;
}

export interface VideosResult {
  label: string;
  heading: string;
  videos: Video[];
}

export interface VideosOptions {
  contentDir?: string;
}

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content', 'videos');
const DEFAULT_LABEL = 'In Action';
const DEFAULT_HEADING = 'See It Ride';

function watchUrlToEmbedUrl(url: string): string | null {
  const match = url.match(/[?&]v=([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function parseItems(raw: unknown): Video[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((e): e is { title?: unknown; description?: unknown; url?: unknown } =>
      typeof e === 'object' && e !== null,
    )
    .flatMap(e => {
      const embedUrl = watchUrlToEmbedUrl(String(e.url ?? ''));
      if (!embedUrl) return [];
      return [{ title: String(e.title ?? '').trim(), description: String(e.description ?? '').trim(), embedUrl }];
    });
}

export function getVideos(opts: VideosOptions = {}): VideosResult {
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;
  const filePath = path.join(contentDir, 'youtube-links.json');

  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch {
    return { label: DEFAULT_LABEL, heading: DEFAULT_HEADING, videos: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { label: DEFAULT_LABEL, heading: DEFAULT_HEADING, videos: [] };
  }

  // Object wrapper shape: { label?, heading?, items: [...] }
  if (!Array.isArray(parsed) && typeof parsed === 'object' && parsed !== null) {
    const d = parsed as Record<string, unknown>;
    return {
      label: typeof d.label === 'string' ? d.label : DEFAULT_LABEL,
      heading: typeof d.heading === 'string' ? d.heading : DEFAULT_HEADING,
      videos: parseItems(d.items),
    };
  }

  // Flat array (legacy shape)
  return { label: DEFAULT_LABEL, heading: DEFAULT_HEADING, videos: parseItems(parsed) };
}
