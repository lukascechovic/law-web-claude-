import fs from 'node:fs';
import path from 'node:path';

export interface HeroContent {
  label: string;
  heading: string;
  subheading: string;
  cta: string;
}

export interface HeroContentOptions {
  contentDir?: string;
}

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content', '01-hero');

const DEFAULTS: HeroContent = {
  label: 'Horseback Archery Equipment',
  heading: 'Lukas Archery Works',
  subheading:
    'Precision-crafted gear for horseback archery and speed shooting — built in Slovakia for riders who demand more.',
  cta: 'View Products',
};

export function getHeroContent(opts: HeroContentOptions = {}): HeroContent {
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;
  const filePath = path.join(contentDir, 'hero.json');

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
    cta: typeof d.cta === 'string' ? d.cta : DEFAULTS.cta,
  };
}
