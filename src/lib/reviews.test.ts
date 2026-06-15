import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getReviews } from './reviews';

let contentDir: string;

beforeEach(() => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'law-reviews-'));
  contentDir = path.join(base, 'reviews');
  fs.mkdirSync(contentDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(path.dirname(contentDir), { recursive: true, force: true });
});

function writeReview(id: string, body: string) {
  fs.writeFileSync(path.join(contentDir, `${id}.md`), body, 'utf8');
}

function writeSectionJson(data: unknown) {
  fs.writeFileSync(path.join(contentDir, 'section.json'), JSON.stringify(data), 'utf8');
}

describe('getReviews — review items', () => {
  it('parses a testimonial into id, author, role, and quote', () => {
    writeReview(
      'maria',
      [
        '---',
        'author: Maria Kovac',
        'role: Competitive horseback archer, Slovakia',
        '---',
        'The ARC quiver transformed my track runs.',
      ].join('\n'),
    );

    const { reviews } = getReviews({ contentDir });

    expect(reviews).toHaveLength(1);
    expect(reviews[0].id).toBe('maria');
    expect(reviews[0].author).toBe('Maria Kovac');
    expect(reviews[0].role).toBe('Competitive horseback archer, Slovakia');
    expect(reviews[0].quote).toBe('The ARC quiver transformed my track runs.');
    expect(reviews[0].video).toBeUndefined();
  });

  it('supports a video testimonial (YouTube URL) alongside the quote', () => {
    writeReview(
      'tomas',
      [
        '---',
        'author: Tomas Novak',
        'video: https://www.youtube.com/watch?v=TIoF_qppVlk',
        '---',
        'My ARC quiver review — see it in action.',
      ].join('\n'),
    );

    const { reviews } = getReviews({ contentDir });

    expect(reviews[0].video).toBe('https://www.youtube.com/watch?v=TIoF_qppVlk');
    expect(reviews[0].quote).toBe('My ARC quiver review — see it in action.');
    expect(reviews[0].role).toBeUndefined();
  });

  it('supports a text-only testimonial with no role and no video', () => {
    writeReview('ana', '---\nauthor: Ana Horvat\n---\nHORIZON is the fastest quiver I have ridden with.');

    const { reviews } = getReviews({ contentDir });

    expect(reviews[0]).toEqual({
      id: 'ana',
      author: 'Ana Horvat',
      quote: 'HORIZON is the fastest quiver I have ridden with.',
    });
  });
});

describe('getReviews — dynamic discovery', () => {
  it('discovers every testimonial file, deriving the id from the filename', () => {
    writeReview('maria', '---\nauthor: Maria\n---\nGreat.');
    writeReview('tomas', '---\nauthor: Tomas\n---\nExcellent.');

    const { reviews } = getReviews({ contentDir });

    expect(reviews.map(r => r.id).sort()).toEqual(['maria', 'tomas']);
  });
});

describe('getReviews — malformed / missing input', () => {
  it('returns an empty reviews array when the reviews directory is missing', () => {
    const { reviews } = getReviews({ contentDir: path.join(contentDir, 'nope') });
    expect(reviews).toEqual([]);
  });

  it('omits a file with malformed frontmatter but keeps the valid ones', () => {
    writeReview('maria', '---\nauthor: Maria\n---\nGreat.');
    writeReview('broken', '---\nauthor: "unterminated\n---\nbody');

    const { reviews } = getReviews({ contentDir });

    expect(reviews.map(r => r.id)).toEqual(['maria']);
  });

  it('omits a file with no author', () => {
    writeReview('maria', '---\nauthor: Maria\n---\nGreat.');
    writeReview('untitled', '---\nrole: rider\n---\nno author here');

    const { reviews } = getReviews({ contentDir });

    expect(reviews.map(r => r.id)).toEqual(['maria']);
  });
});

describe('getReviews — section metadata', () => {
  it('reads label, heading, and subheading from section.json', () => {
    writeSectionJson({ label: 'Custom Label', heading: 'Custom Heading', subheading: 'Custom sub' });

    const { label, heading, subheading } = getReviews({ contentDir });
    expect(label).toBe('Custom Label');
    expect(heading).toBe('Custom Heading');
    expect(subheading).toBe('Custom sub');
  });

  it('falls back to defaults when section.json is absent', () => {
    const { label, heading, subheading } = getReviews({ contentDir });
    expect(label).toBe('From the Saddle');
    expect(heading).toBe('What Riders Say');
    expect(subheading).toBe('Real feedback from horseback archers riding with Lukas Archery Works gear.');
  });

  it('falls back to defaults for individual missing fields', () => {
    writeSectionJson({ label: 'My Label' });

    const { label, heading } = getReviews({ contentDir });
    expect(label).toBe('My Label');
    expect(heading).toBe('What Riders Say');
  });

  it('falls back to defaults when section.json contains invalid JSON', () => {
    fs.writeFileSync(path.join(contentDir, 'section.json'), 'bad json', 'utf8');

    const { label } = getReviews({ contentDir });
    expect(label).toBe('From the Saddle');
  });
});
