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

export interface ReviewsSection {
  label: string;
  heading: string;
  subheading: string;
  reviews: Review[];
}

export interface ReviewsOptions {
  /** Directory holding per-testimonial Markdown files and `section.json`. */
  contentDir?: string;
}

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content', '07-reviews');

const DEFAULTS = {
  label: 'From the Saddle',
  heading: 'What Riders Say',
  subheading: 'Real feedback from horseback archers riding with Lukas Archery Works gear.',
};

function readSection(contentDir: string): Pick<ReviewsSection, 'label' | 'heading' | 'subheading'> {
  const filePath = path.join(contentDir, 'section.json');
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch {
    return { ...DEFAULTS };
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ...DEFAULTS };
  }

  if (typeof data !== 'object' || data === null) return { ...DEFAULTS };
  const d = data as Record<string, unknown>;

  return {
    label: typeof d.label === 'string' ? d.label : DEFAULTS.label,
    heading: typeof d.heading === 'string' ? d.heading : DEFAULTS.heading,
    subheading: typeof d.subheading === 'string' ? d.subheading : DEFAULTS.subheading,
  };
}

export function getReviews(opts: ReviewsOptions = {}): ReviewsSection {
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;

  let entries: string[] = [];
  try {
    entries = fs.readdirSync(contentDir);
  } catch {
    return { ...DEFAULTS, reviews: [] };
  }

  const reviews = entries
    .filter(name => name.toLowerCase().endsWith('.md'))
    .sort()
    .map(name => name.replace(/\.md$/i, ''))
    .map(id => getReview(id, contentDir))
    .filter((r): r is Review => r !== undefined);

  return { ...readSection(contentDir), reviews };
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
