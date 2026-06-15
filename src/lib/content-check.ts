import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface ContentIssue {
  file: string;
  errors: string[];
}

export interface ContentReport {
  ok: boolean;
  issues: ContentIssue[];
}

export function validateProduct(id: string, raw: string): string[] {
  const errors: string[] = [];

  let data: Record<string, unknown>;
  let content: string;
  try {
    const parsed = matter(raw);
    data = parsed.data;
    content = parsed.content;
  } catch (e) {
    return [`parse error: ${(e as Error).message}`];
  }

  if (!data.title || String(data.title).trim() === '') errors.push('missing required field: title');
  if (!data.tagline || String(data.tagline).trim() === '') errors.push('missing required field: tagline');
  if (!data.price || String(data.price).trim() === '') errors.push('missing required field: price');

  const features = content
    .split('\n')
    .filter(line => /^\s*-\s+/.test(line))
    .map(line => line.replace(/^\s*-\s+/, '').trim())
    .filter(Boolean);

  if (features.length === 0) errors.push(`no feature bullets found (add at least one "- ..." line)`);

  return errors;
}

export function validateReview(id: string, raw: string): string[] {
  const errors: string[] = [];

  let data: Record<string, unknown>;
  let content: string;
  try {
    const parsed = matter(raw);
    data = parsed.data;
    content = parsed.content;
  } catch (e) {
    return [`parse error: ${(e as Error).message}`];
  }

  if (!data.author || String(data.author).trim() === '') errors.push('missing required field: author');
  if (!data.role || String(data.role).trim() === '') errors.push('missing required field: role');
  if (content.trim() === '') errors.push('review body is empty');

  return errors;
}

const IMAGE_EXTENSIONS = /\.(webp|jpg|jpeg|png)$/i;

function countImages(dir: string): number {
  try {
    return fs.readdirSync(dir).filter(f => IMAGE_EXTENSIONS.test(f)).length;
  } catch {
    return -1; // folder missing
  }
}

export function checkContent(rootDir: string): ContentReport {
  const issues: ContentIssue[] = [];

  // ── products ──────────────────────────────────────────────────────────────
  const productsDir = path.join(rootDir, 'products');
  let productFiles: string[] = [];
  try {
    productFiles = fs.readdirSync(productsDir).filter(f => f.endsWith('.md'));
  } catch {
    // no products directory — nothing to validate
  }

  for (const file of productFiles) {
    const id = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(productsDir, file), 'utf8');
    const errors = validateProduct(id, raw);

    // check image gallery
    const imageDir = path.join(rootDir, 'products', id);
    const imageCount = countImages(imageDir);
    if (imageCount === -1) {
      errors.push(`no image folder found at products/${id}/`);
    } else if (imageCount === 0) {
      errors.push(`image folder products/${id}/ exists but contains no images`);
    }

    if (errors.length > 0) issues.push({ file: `products/${file}`, errors });
  }

  // ── reviews ───────────────────────────────────────────────────────────────
  const reviewsDir = path.join(rootDir, 'reviews');
  let reviewFiles: string[] = [];
  try {
    reviewFiles = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'));
  } catch {
    // no reviews directory — nothing to validate
  }

  for (const file of reviewFiles) {
    const id = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(reviewsDir, file), 'utf8');
    const errors = validateReview(id, raw);
    if (errors.length > 0) issues.push({ file: `reviews/${file}`, errors });
  }

  return { ok: issues.length === 0, issues };
}
