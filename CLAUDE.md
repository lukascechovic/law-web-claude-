# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (also runs copy-assets first)
npm run build        # Production build (also runs copy-assets first)
npm run lint         # ESLint via Next.js

npm test                          # Run full Playwright suite
npx playwright test --grep "hero" # Run tests matching a section name
npx playwright show-report        # Open HTML test report after a run

node scripts/copy-assets.mjs      # Manually sync content/ -> public/
```

Dev server must be running (or Playwright starts it automatically via `webServer` config) before tests execute.

## Architecture

### Data flow

Content originates in `content/` (markdown text, WebP images, MP4 videos). The `scripts/copy-assets.mjs` script mirrors it into `public/` so Next.js `<Image>` optimization can serve it. This runs automatically via `predev`/`prebuild` npm hooks. **Never edit files directly in `public/`** — they are overwritten on every run.

```
content/texts/*.md      → src/lib/markdown.ts → page.tsx (server component)
content/images/{id}/    → public/images/{id}/ → <Image src="/images/{id}/..." />
content/videos/         → public/videos/      → <video src="/videos/..." />
```

### Server vs client boundary

- `src/app/page.tsx` — async server component; calls markdown parsers, passes data as props
- `src/components/About.tsx`, `Products.tsx`, `Hero.tsx`, `Footer.tsx` — server components, no interactivity
- `src/components/Navbar.tsx` — `'use client'` (scroll listener + hamburger state)
- `src/components/VideoPlayer.tsx` — `'use client'` (wraps `<video>`)
- `src/components/ProductCard.tsx` — `'use client'` (image gallery `activeImage` state)

### Markdown parsing (`src/lib/markdown.ts`)

`getAboutContent()` — reads `content/texts/background.md`, converts to HTML via `remark → remark-html`, returns `{ title, htmlContent }`. Rendered with `dangerouslySetInnerHTML` inside a Tailwind `prose` wrapper.

`getProductsContent()` — reads `content/texts/products.md`. Splits on `## ` headings to extract product sections, matches each to a known id (`wings` | `arc` | `horizon`) via regex, parses bullet lines as `features[]`, and reads `public/images/{id}/` to build `images[]`. Returns `Product[]`.

### Tailwind design tokens

Custom palette defined in `tailwind.config.ts`:

| Token | Use |
|---|---|
| `forest-950` / `forest-900` | Dark backgrounds (navbar, footer, hero overlay) |
| `forest-600` / `forest-700` | Primary green accents, CTA buttons |
| `bark-500` / `bark-600` | Section labels, icon accents |
| `cream-50` / `cream-100` | Page background |
| `stone-dark` | Body text (`#4a3f35`) |

Font variables: `--font-playfair` (serif headings) and `--font-inter` (body), loaded via `next/font/google` in `layout.tsx` and applied via `font-serif` / `font-sans` Tailwind classes.

Utility classes defined in `globals.css`: `.btn-primary`, `.section-label`.

### Testing conventions

Playwright tests are in `tests/homepage.spec.ts`. All assertions use:
- `data-testid` attributes for section and card targeting (`[data-testid="hero-section"]`, `[data-testid="product-card-{id}"]`)
- ARIA roles for interactive elements (`getByRole('navigation')`, `getByRole('img')`, etc.)
- Tests scoped to `getByRole('navigation')` when checking navbar-specific elements to avoid conflicts with identical elements in the footer

All decorative lucide-react SVG icons must have `aria-hidden="true"` — Chromium assigns SVGs an implicit `role="img"` in its accessibility tree, which breaks `getByRole('img')` assertions.

## Content management

### Adding/replacing product images

Drop WebP files into `content/images/{wings|arc|horizon}/` following the naming convention `{product}-NN.webp`. They appear in the gallery automatically after the next `dev`/`build` — `getProductsContent()` reads the directory at build time and sorts alphabetically.

### Editing section text

Edit `content/texts/background.md` (About section) or `content/texts/products.md` (product features). The markdown parser expects the products file to use `## N.\t Title containing PRODUCTNAME` headings and `-` bullet lists.

### Adding video content

The hero background is `public/videos/hba_filip1.mp4` (sourced from `content/videos/`). YouTube links for future embeds are in `content/videos/youtube links.json`.

## Agent skills

### Issue tracker

Issues are tracked in this repo's GitHub Issues, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage vocabulary (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
