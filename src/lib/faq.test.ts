import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getFaq } from './faq';

let contentDir: string;

beforeEach(() => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'law-faq-'));
  contentDir = path.join(base, 'texts');
  fs.mkdirSync(contentDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(path.dirname(contentDir), { recursive: true, force: true });
});

function writeFaq(body: string) {
  fs.writeFileSync(path.join(contentDir, 'faq.md'), body, 'utf8');
}

describe('getFaq', () => {
  it('parses Q/A pairs in document order', () => {
    writeFaq(
      [
        '---',
        'title: Frequently Asked Questions',
        '---',
        '## What is WINGS?',
        '',
        'WINGS is the arrow nocking aid.',
        '',
        '## What is the ARC?',
        '',
        'ARC is a sideback quiver.',
        '',
      ].join('\n'),
    );

    const faq = getFaq({ contentDir });

    expect(faq.title).toBe('Frequently Asked Questions');
    expect(faq.items).toEqual([
      { question: 'What is WINGS?', answer: 'WINGS is the arrow nocking aid.' },
      { question: 'What is the ARC?', answer: 'ARC is a sideback quiver.' },
    ]);
  });

  it('returns an empty item list when the file is missing instead of throwing', () => {
    const faq = getFaq({ contentDir });
    expect(faq.items).toEqual([]);
    expect(typeof faq.title).toBe('string');
  });

  it('ignores a heading that has no answer body', () => {
    writeFaq(
      [
        '---',
        'title: FAQ',
        '---',
        '## A question with an answer',
        '',
        'Here is the answer.',
        '',
        '## A dangling question with no answer',
        '',
      ].join('\n'),
    );

    const faq = getFaq({ contentDir });

    expect(faq.items).toEqual([
      { question: 'A question with an answer', answer: 'Here is the answer.' },
    ]);
  });

  it('returns empty items (never throws) on malformed frontmatter', () => {
    // Unterminated quote => invalid YAML.
    writeFaq('---\ntitle: "unterminated\n---\n## Q\n\nA.');
    const faq = getFaq({ contentDir });
    expect(faq.items).toEqual([]);
  });

  it('joins a multi-paragraph answer into a single string', () => {
    writeFaq(
      [
        '---',
        'title: FAQ',
        '---',
        '## Do you take custom orders?',
        '',
        'Yes, every piece is made to order.',
        '',
        'Reach out via the contact form to discuss details.',
        '',
      ].join('\n'),
    );

    const faq = getFaq({ contentDir });

    expect(faq.items).toEqual([
      {
        question: 'Do you take custom orders?',
        answer:
          'Yes, every piece is made to order. Reach out via the contact form to discuss details.',
      },
    ]);
  });
});
