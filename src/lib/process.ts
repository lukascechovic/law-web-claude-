import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface ProcessStep {
  title: string;
  description: string;
  image?: string;
}

export interface Process {
  label: string;
  title: string;
  steps: ProcessStep[];
}

export interface ProcessOptions {
  /** Directory holding `process.md`. */
  contentDir?: string;
  /** Directory holding the `process/` image folder (`{imagesDir}/process/`). */
  imagesDir?: string;
}

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content', 'process');
const DEFAULT_IMAGES_DIR = path.join(process.cwd(), 'public');

const IMAGES_SUBDIR = 'process';

/**
 * Resolves a step's image filename to a public URL, returning undefined when
 * no image is referenced or the file does not exist on disk.
 */
function resolveImage(filename: string, imagesDir: string): string | undefined {
  const name = filename.trim();
  if (!name) return undefined;
  try {
    fs.accessSync(path.join(imagesDir, IMAGES_SUBDIR, name));
  } catch {
    return undefined;
  }
  return `/${IMAGES_SUBDIR}/${name}`;
}

function parseSteps(raw: unknown, imagesDir: string): ProcessStep[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((entry): entry is { title?: unknown; description?: unknown; image?: unknown } =>
      typeof entry === 'object' && entry !== null,
    )
    .map(entry => {
      const step: ProcessStep = {
        title: String(entry.title ?? '').trim(),
        description: String(entry.description ?? '').trim(),
      };
      const image = resolveImage(String(entry.image ?? ''), imagesDir);
      if (image) step.image = image;
      return step;
    })
    .filter(step => step.title !== '');
}

export function getProcess(opts: ProcessOptions = {}): Process {
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;
  const imagesDir = opts.imagesDir ?? DEFAULT_IMAGES_DIR;
  const filePath = path.join(contentDir, 'process.md');

  let data: Record<string, unknown>;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    data = matter(raw).data;
  } catch {
    // Missing file or malformed frontmatter — render nothing rather than crash.
    return { label: 'The Craft', title: '', steps: [] };
  }

  const label = typeof data.label === 'string' && data.label.trim() ? data.label.trim() : 'The Craft';
  const title = typeof data.title === 'string' ? data.title.trim() : '';

  return {
    label,
    title,
    steps: parseSteps(data.steps, imagesDir),
  };
}
