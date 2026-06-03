import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface Review {
  id: string;
  author: string;
  role?: string;
  quote: string;
  video?: string;
}

export interface ReviewsOptions {
  /** Directory holding per-testimonial Markdown files. */
  contentDir?: string;
}

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content', 'reviews');

export function getReviews(opts: ReviewsOptions = {}): Review[] {
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;

  let entries: string[] = [];
  try {
    entries = fs.readdirSync(contentDir);
  } catch {
    return [];
  }

  return entries
    .filter(name => name.toLowerCase().endsWith('.md'))
    .sort()
    .map(name => name.replace(/\.md$/i, ''))
    .map(id => getReview(id, contentDir))
    .filter((r): r is Review => r !== undefined);
}

function getReview(id: string, contentDir: string): Review | undefined {
  const filePath = path.join(contentDir, `${id}.md`);

  let data: Record<string, unknown>;
  let content: string;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    data = parsed.data;
    content = parsed.content;
  } catch {
    // Missing file or malformed frontmatter — omit rather than crash (mirrors ADR-0003).
    return undefined;
  }

  const author = typeof data.author === 'string' ? data.author.trim() : '';
  if (!author) return undefined;

  const role = typeof data.role === 'string' ? data.role.trim() : undefined;
  const video = typeof data.video === 'string' ? data.video.trim() : undefined;

  return {
    id,
    author,
    ...(role ? { role } : {}),
    quote: content.trim(),
    ...(video ? { video } : {}),
  };
}
