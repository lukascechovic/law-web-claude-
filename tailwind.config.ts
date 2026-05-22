import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0a1409',
          900: '#132112',
          800: '#1e3a1f',
          700: '#2d5230',
          600: '#3d6e42',
          DEFAULT: '#3d6e42',
        },
        bark: {
          950: '#1c1007',
          900: '#2e1a0a',
          800: '#4a2c10',
          700: '#6b3f18',
          600: '#8b5428',
          500: '#a8692f',
          DEFAULT: '#8b5428',
        },
        cream: {
          50: '#faf8f2',
          100: '#f4f0e4',
          200: '#ebe2cc',
          300: '#ddd0b0',
          DEFAULT: '#f4f0e4',
        },
        stone: {
          warm: '#c4b8a4',
          mid: '#8c7d6e',
          dark: '#4a3f35',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#4a3f35',
            h2: { color: '#132112', fontFamily: 'var(--font-playfair)' },
            h3: { color: '#132112', fontFamily: 'var(--font-playfair)' },
          },
        },
        cream: {
          css: {
            '--tw-prose-body': '#4a3f35',
            '--tw-prose-headings': '#132112',
            '--tw-prose-bold': '#2e1a0a',
            '--tw-prose-links': '#3d6e42',
            '--tw-prose-bullets': '#8b5428',
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
