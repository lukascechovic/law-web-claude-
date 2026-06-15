import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export interface AboutContentOptions {
  contentDir?: string;
}

export async function getAboutContent(
  opts: AboutContentOptions = {},
): Promise<{ label: string; title: string; htmlContent: string }> {
  const contentDir = opts.contentDir ?? path.join(process.cwd(), 'content/02-about');
  const filePath = path.join(contentDir, 'background.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const processed = await remark().use(html).process(content);
  return {
    label: typeof data.label === 'string' && data.label.trim() ? data.label.trim() : 'Our Story',
    title: (data.title as string) ?? 'Background',
    htmlContent: processed.toString(),
  };
}
