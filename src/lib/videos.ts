import fs from 'node:fs';
import path from 'node:path';

export interface Video {
  title: string;
  description: string;
  embedUrl: string;
}

export interface VideosOptions {
  contentDir?: string;
}

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content', 'videos');

function watchUrlToEmbedUrl(url: string): string | null {
  const match = url.match(/[?&]v=([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function getVideos(opts: VideosOptions = {}): Video[] {
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;
  const filePath = path.join(contentDir, 'youtube-links.json');

  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch {
    return [];
  }

  let entries: unknown;
  try {
    entries = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(entries)) return [];

  return entries
    .filter((e): e is { title?: unknown; description?: unknown; url?: unknown } =>
      typeof e === 'object' && e !== null,
    )
    .flatMap(e => {
      const embedUrl = watchUrlToEmbedUrl(String(e.url ?? ''));
      if (!embedUrl) return [];
      return [{
        title: String(e.title ?? '').trim(),
        description: String(e.description ?? '').trim(),
        embedUrl,
      }];
    });
}
