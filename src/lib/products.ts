import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  tagline: string;
  price: string;
  specs: ProductSpec[];
  techniques: string[];
  features: string[];
  images: string[];
}

export interface CatalogOptions {
  /** Directory holding per-product Markdown files. */
  contentDir?: string;
  /** Directory holding per-product image folders (`{imagesDir}/{id}/`). */
  imagesDir?: string;
}

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content', 'products');
const DEFAULT_IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

function parseSpecs(raw: unknown): ProductSpec[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((entry): entry is { label?: unknown; value?: unknown } =>
      typeof entry === 'object' && entry !== null,
    )
    .map(entry => ({
      label: String(entry.label ?? '').trim(),
      value: String(entry.value ?? '').trim(),
    }))
    .filter(spec => spec.label !== '');
}

function parseStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(item => String(item).trim()).filter(Boolean);
}

const IMAGE_EXTENSIONS = /\.(webp|jpg|jpeg|png)$/i;

function collectImages(id: string, imagesDir: string): string[] {
  const dir = path.join(imagesDir, id);
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter(file => IMAGE_EXTENSIONS.test(file))
    .sort()
    .map(file => `/images/${id}/${file}`);
}

function parseFeatures(body: string): string[] {
  return body
    .split('\n')
    .filter(line => /^\s*-\s+/.test(line))
    .map(line => line.replace(/^\s*-\s+/, '').trim())
    .filter(Boolean);
}

export function getProducts(opts: CatalogOptions = {}): Product[] {
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;

  let entries: string[] = [];
  try {
    entries = fs.readdirSync(contentDir);
  } catch {
    return [];
  }

  return entries
    .filter(name => name.toLowerCase().endsWith('.md'))
    .map(name => name.replace(/\.md$/i, ''))
    .map(id => getProduct(id, opts))
    .filter((p): p is Product => p !== undefined);
}

export function getProduct(id: string, opts: CatalogOptions = {}): Product | undefined {
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;
  const imagesDir = opts.imagesDir ?? DEFAULT_IMAGES_DIR;
  const filePath = path.join(contentDir, `${id}.md`);

  let data: Record<string, unknown>;
  let content: string;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    data = parsed.data;
    content = parsed.content;
  } catch {
    // Missing file or malformed frontmatter — omit rather than crash (ADR-0003).
    return undefined;
  }

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  if (!title) return undefined;

  return {
    id,
    title,
    tagline: (data.tagline as string) ?? '',
    price: (data.price as string) ?? '',
    specs: parseSpecs(data.specs),
    techniques: parseStringList(data.techniques),
    features: parseFeatures(content),
    images: collectImages(id, imagesDir),
  };
}
