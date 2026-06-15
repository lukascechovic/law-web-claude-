import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export async function getAboutContent(): Promise<{ title: string; htmlContent: string }> {
  const filePath = path.join(process.cwd(), 'content/about/background.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const processed = await remark().use(html).process(content);
  return {
    title: (data.title as string) ?? 'Background',
    htmlContent: processed.toString(),
  };
}
