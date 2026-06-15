import fs from 'fs';
import path from 'path';

export interface HeroVideoConfig {
  src: string;
  objectPosition: string;
}

const DEFAULT_HERO_VIDEO_CONFIG: HeroVideoConfig = {
  src: '/hero/hba_filip1.mp4',
  objectPosition: '50% 28%',
};

export function getHeroVideoConfig(): HeroVideoConfig {
  const configPath = path.join(process.cwd(), 'content/hero/video.json');

  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const parsed = JSON.parse(fileContents) as Partial<HeroVideoConfig>;

    return {
      src: typeof parsed.src === 'string' && parsed.src.trim().length > 0
        ? parsed.src
        : DEFAULT_HERO_VIDEO_CONFIG.src,
      objectPosition: typeof parsed.objectPosition === 'string' && parsed.objectPosition.trim().length > 0
        ? parsed.objectPosition
        : DEFAULT_HERO_VIDEO_CONFIG.objectPosition,
    };
  } catch {
    return DEFAULT_HERO_VIDEO_CONFIG;
  }
}