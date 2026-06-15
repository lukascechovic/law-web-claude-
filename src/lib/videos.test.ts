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

describe('getVideos', () => {
  it('converts a watch URL to an embed URL', () => {
    writeJson([{ title: 'Test', description: 'Desc', url: 'https://www.youtube.com/watch?v=ABC123xyz' }]);
    const result = getVideos({ contentDir });
    expect(result).toHaveLength(1);
    expect(result[0].embedUrl).toBe('https://www.youtube.com/embed/ABC123xyz');
    expect(result[0].title).toBe('Test');
    expect(result[0].description).toBe('Desc');
  });

  it('strips extra query params (e.g. &t=) when converting to embed URL', () => {
    writeJson([{ title: 'T', description: 'D', url: 'https://www.youtube.com/watch?v=videoID123&t=410s' }]);
    const result = getVideos({ contentDir });
    expect(result[0].embedUrl).toBe('https://www.youtube.com/embed/videoID123');
  });

  it('returns [] when the file is absent', () => {
    expect(getVideos({ contentDir })).toEqual([]);
  });

  it('returns [] when the file contains invalid JSON', () => {
    fs.writeFileSync(path.join(contentDir, 'youtube-links.json'), 'not valid json', 'utf8');
    expect(getVideos({ contentDir })).toEqual([]);
  });
});
