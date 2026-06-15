import fs from 'node:fs';
import path from 'node:path';

export interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
}

export interface GallerySection {
  label: string;
  heading: string;
  subheading: string;
  items: GalleryItem[];
}

export interface GalleryOptions {
  /** Directory holding section image/video folders (`{imagesDir}/gallery/`). */
  imagesDir?: string;
  /** Directory holding `section.json`. Defaults to `content/gallery/`. */
  contentDir?: string;
}

const DEFAULT_IMAGES_DIR = path.join(process.cwd(), 'public');
const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content', '06-gallery');

const DEFAULTS = {
  label: 'In Action',
  heading: 'The Gear at Full Gallop',
  subheading:
    'Riders and their kit on the field — quivers, nocking aids, and bows where they belong.',
};

const GALLERY_ALT = 'Gear in action — horseback archery';

const IMAGE_EXTENSIONS = /\.(webp|jpg|jpeg|png)$/i;
const VIDEO_EXTENSIONS = /\.(mp4|webm|mov)$/i;

function buildItem(file: string): GalleryItem {
  return {
    type: VIDEO_EXTENSIONS.test(file) ? 'video' : 'image',
    src: `/gallery/${file}`,
    alt: GALLERY_ALT,
  };
}

function readSection(contentDir: string): Pick<GallerySection, 'label' | 'heading' | 'subheading'> {
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

export function getGallery(opts: GalleryOptions = {}): GallerySection {
  const imagesDir = opts.imagesDir ?? DEFAULT_IMAGES_DIR;
  const contentDir = opts.contentDir ?? DEFAULT_CONTENT_DIR;
  const dir = path.join(imagesDir, 'gallery');

  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    // missing gallery folder — return section metadata with empty items
  }

  const items = files
    .filter(file => IMAGE_EXTENSIONS.test(file) || VIDEO_EXTENSIONS.test(file))
    .sort()
    .map(buildItem);

  return { ...readSection(contentDir), items };
}
