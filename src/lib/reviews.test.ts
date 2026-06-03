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

describe('getReviews', () => {
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

    const reviews = getReviews({ contentDir });

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

    const reviews = getReviews({ contentDir });

    expect(reviews[0].video).toBe('https://www.youtube.com/watch?v=TIoF_qppVlk');
    expect(reviews[0].quote).toBe('My ARC quiver review — see it in action.');
    expect(reviews[0].role).toBeUndefined();
  });

  it('supports a text-only testimonial with no role and no video', () => {
    writeReview('ana', '---\nauthor: Ana Horvat\n---\nHORIZON is the fastest quiver I have ridden with.');

    const reviews = getReviews({ contentDir });

    expect(reviews[0]).toEqual({
      id: 'ana',
      author: 'Ana Horvat',
      quote: 'HORIZON is the fastest quiver I have ridden with.',
    });
  });
});

describe('dynamic discovery', () => {
  it('discovers every testimonial file, deriving the id from the filename', () => {
    writeReview('maria', '---\nauthor: Maria\n---\nGreat.');
    writeReview('tomas', '---\nauthor: Tomas\n---\nExcellent.');

    const reviews = getReviews({ contentDir });

    expect(reviews.map(r => r.id).sort()).toEqual(['maria', 'tomas']);
  });
});

describe('malformed / missing input', () => {
  it('returns an empty array when the reviews directory is missing', () => {
    expect(getReviews({ contentDir: path.join(contentDir, 'nope') })).toEqual([]);
  });

  it('omits a file with malformed frontmatter but keeps the valid ones', () => {
    writeReview('maria', '---\nauthor: Maria\n---\nGreat.');
    // Unterminated quote => invalid YAML.
    writeReview('broken', '---\nauthor: "unterminated\n---\nbody');

    const reviews = getReviews({ contentDir });

    expect(reviews.map(r => r.id)).toEqual(['maria']);
  });

  it('omits a file with no author', () => {
    writeReview('maria', '---\nauthor: Maria\n---\nGreat.');
    writeReview('untitled', '---\nrole: rider\n---\nno author here');

    const reviews = getReviews({ contentDir });

    expect(reviews.map(r => r.id)).toEqual(['maria']);
  });
});
