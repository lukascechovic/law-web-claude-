---
name: codebase-architecture
description: Architecture of this Next.js portfolio site — data flow from content/ to public/, server vs client component boundaries, product catalog API, and Tailwind design tokens. Use when working on components, data flow, API modules (src/lib/), or styling.
---

# Codebase Architecture

## Data flow

Content originates in `content/` (markdown, WebP images, MP4 videos). `scripts/copy-assets.mjs` mirrors it into `public/` at dev/build time via `predev`/`prebuild` hooks. **Never edit files directly in `public/`** — they are overwritten on every run.

```
content/texts/background.md → src/lib/markdown.ts  → page.tsx (About)
content/products/{id}.md    → src/lib/products.ts  → page.tsx (Products)
content/images/{id}/        → public/images/{id}/  → <Image src="/images/{id}/..." />
content/videos/             → public/videos/       → <video src="/videos/..." />
```

## Server vs client boundary

- `src/app/page.tsx` — async server component; calls markdown parsers, passes data as props
- `src/components/About.tsx`, `Products.tsx`, `Hero.tsx`, `Footer.tsx` — server components, no interactivity
- `src/components/Navbar.tsx` — `'use client'` (scroll listener + hamburger state)
- `src/components/VideoPlayer.tsx` — `'use client'` (wraps `<video>`)
- `src/components/ProductCard.tsx` — `'use client'` (image gallery `activeImage` state)

## About content (`src/lib/markdown.ts`)

`getAboutContent()` reads `content/texts/background.md`, converts to HTML via `remark → remark-html`, returns `{ title, htmlContent }`. Rendered with `dangerouslySetInnerHTML` inside a Tailwind `prose` wrapper.

## Product catalog (`src/lib/products.ts`)

Single source of truth per **ADR-0003**. `getProducts()` / `getProduct(id)` discover products dynamically from `content/products/*.md` — id is the filename, **no hardcoded allowlist** (do not reintroduce one). Frontmatter: `title`, `tagline`, `price`, `specs: [{label, value}]`, `techniques[]`. Body `-` bullets become `features[]`. Images collected and sorted from `public/images/{id}/`. Malformed files omitted gracefully. Both functions accept `{ contentDir, imagesDir }` for testability.

## Tailwind design tokens

Defined in `tailwind.config.ts`:

| Token | Use |
|---|---|
| `forest-950` / `forest-900` | Dark backgrounds (navbar, footer, hero overlay) |
| `forest-600` / `forest-700` | Primary green accents, CTA buttons |
| `bark-500` / `bark-600` | Section labels, icon accents |
| `cream-50` / `cream-100` | Page background |
| `stone-dark` | Body text (`#4a3f35`) |

Font variables: `--font-playfair` (serif headings) and `--font-inter` (body), loaded via `next/font/google` in `layout.tsx`, applied via `font-serif` / `font-sans`.

Utility classes in `globals.css`: `.btn-primary`, `.section-label`.
