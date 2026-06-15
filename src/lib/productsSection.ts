import fs from 'node:fs';
import path from 'node:path';

export interface ProductsSection {
  label: string;
  heading: string;
  subheading: string;
}

export interface ProductsSectionOptions {
  contentDir?: string;
}

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content', 'products');

const DEFAULTS: ProductsSection = {
  label: 'The Collection',
  heading: 'Gear Built for Riders',
  subheading:
    'Each piece is engineered for horseback archery — functional, personal, and ready to perform.',
};

export function getProductsSection(opts: ProductsSectionOptions = {}): ProductsSection {
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;
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
