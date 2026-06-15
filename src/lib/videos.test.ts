import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getVideos } from './videos';

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), 'law-videos-'));
});

afterEach(() => {
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function writeJson(data: unknown) {
  fs.writeFileSync(path.join(contentDir, 'youtube-links.json'), JSON.stringify(data), 'utf8');
}

describe('getVideos — flat array (legacy shape)', () => {
  it('converts a watch URL to an embed URL', () => {
    writeJson([{ title: 'Test', description: 'Desc', url: 'https://www.youtube.com/watch?v=ABC123xyz' }]);
    const { videos } = getVideos({ contentDir });
    expect(videos).toHaveLength(1);
    expect(videos[0].embedUrl).toBe('https://www.youtube.com/embed/ABC123xyz');
    expect(videos[0].title).toBe('Test');
    expect(videos[0].description).toBe('Desc');
  });

  it('strips extra query params (e.g. &t=) when converting to embed URL', () => {
    writeJson([{ title: 'T', description: 'D', url: 'https://www.youtube.com/watch?v=videoID123&t=410s' }]);
    const { videos } = getVideos({ contentDir });
    expect(videos[0].embedUrl).toBe('https://www.youtube.com/embed/videoID123');
  });

  it('returns default label and heading for flat array', () => {
    writeJson([]);
    const { label, heading } = getVideos({ contentDir });
    expect(label).toBe('In Action');
    expect(heading).toBe('See It Ride');
  });

  it('returns empty videos when the file is absent', () => {
    const { videos } = getVideos({ contentDir });
    expect(videos).toEqual([]);
  });

  it('returns empty videos when the file contains invalid JSON', () => {
    fs.writeFileSync(path.join(contentDir, 'youtube-links.json'), 'not valid json', 'utf8');
    expect(getVideos({ contentDir }).videos).toEqual([]);
  });
});

describe('getVideos — object wrapper shape', () => {
  it('reads label and heading from the wrapper', () => {
    writeJson({ label: 'Custom Label', heading: 'Custom Heading', items: [] });
    const { label, heading } = getVideos({ contentDir });
    expect(label).toBe('Custom Label');
    expect(heading).toBe('Custom Heading');
  });

  it('converts watch URLs inside items[]', () => {
    writeJson({
      label: 'L', heading: 'H',
      items: [{ title: 'T', description: 'D', url: 'https://www.youtube.com/watch?v=XYZ' }],
    });
    const { videos } = getVideos({ contentDir });
    expect(videos[0].embedUrl).toBe('https://www.youtube.com/embed/XYZ');
  });

  it('defaults label and heading when omitted from wrapper', () => {
    writeJson({ items: [] });
    const { label, heading } = getVideos({ contentDir });
    expect(label).toBe('In Action');
    expect(heading).toBe('See It Ride');
  });
});
