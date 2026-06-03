import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Faq {
  title: string;
  items: FaqItem[];
}

export interface FaqOptions {
  /** Directory holding the FAQ Markdown file (`{contentDir}/faq.md`). */
  contentDir?: string;
}

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content', 'texts');
const DEFAULT_TITLE = 'Frequently Asked Questions';

/**
 * Parse the FAQ content file into ordered question/answer pairs.
 *
 * Schema: frontmatter `title`, then a body of `## Question` headings, each
 * followed by one or more paragraphs of answer text. Mirrors `products.ts`:
 * reads from `process.cwd()` by default, accepts `contentDir` for tests, and
 * degrades gracefully (empty items, never throws) on a missing/malformed file.
 */
export function getFaq(opts: FaqOptions = {}): Faq {
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;
  const filePath = path.join(contentDir, 'faq.md');

  let data: Record<string, unknown>;
  let content: string;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    data = parsed.data;
    content = parsed.content;
  } catch {
    // Missing file or malformed frontmatter — degrade gracefully.
    return { title: DEFAULT_TITLE, items: [] };
  }

  const title =
    typeof data.title === 'string' && data.title.trim()
      ? data.title.trim()
      : DEFAULT_TITLE;

  return { title, items: parseItems(content) };
}

function parseItems(body: string): FaqItem[] {
  const items: FaqItem[] = [];
  // Split on `##` headings (h2), keeping the heading text via capture group.
  const sections = body.split(/^##\s+(.+?)\s*$/m);
  // sections[0] is any preamble before the first heading; then pairs of
  // [question, answerBlock, question, answerBlock, ...].
  for (let i = 1; i < sections.length; i += 2) {
    const question = sections[i].trim();
    const answer = (sections[i + 1] ?? '')
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .join(' ')
      .trim();
    if (question && answer) {
      items.push({ question, answer });
    }
  }
  return items;
}
