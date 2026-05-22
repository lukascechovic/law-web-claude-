import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export interface Product {
  id: string;
  title: string;
  features: string[];
  images: string[];
}

export async function getAboutContent(): Promise<{ title: string; htmlContent: string }> {
  const filePath = path.join(process.cwd(), 'content/texts/background.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const processed = await remark().use(html).process(content);
  return {
    title: (data.title as string) ?? 'Background',
    htmlContent: processed.toString(),
  };
}

export async function getProductsContent(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'content/texts/products.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);

  const PRODUCT_IDS = ['wings', 'arc', 'horizon'] as const;

  // Split on ## headings
  const sections = content.split(/^##\s+/m).slice(1);

  return sections
    .map((section): Product | null => {
      const lines = section.trim().split('\n');
      const headingLine = lines[0].trim();

      const id = PRODUCT_IDS.find(p => new RegExp(p, 'i').test(headingLine));
      if (!id) return null;

      // Strip leading "N. \t " from heading
      const titleMatch = headingLine.match(/^\d+\.\s+(.+)$/);
      const title = titleMatch ? titleMatch[1].trim() : headingLine;

      const features = lines
        .slice(1)
        .filter(l => /^\s*-/.test(l))
        .map(l => l.replace(/^\s*-\s*/, '').trim())
        .filter(Boolean);

      const imagesDir = path.join(process.cwd(), 'public', 'images', id);
      let images: string[] = [];
      try {
        images = fs
          .readdirSync(imagesDir)
          .filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f))
          .sort()
          .map(f => `/images/${id}/${f}`);
      } catch {
        // directory not yet populated
      }

      return { id, title, features, images };
    })
    .filter((p): p is Product => p !== null);
}
