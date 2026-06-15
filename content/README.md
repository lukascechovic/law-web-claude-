# Content Guide

**Rule: folder name = section name on the page.** Every top-level folder here maps 1-to-1 to a page section. No code changes are needed to update text, images, or products — edit the files and run `npm run dev`.

After adding or replacing any files, run the content audit to check for errors:

```bash
npm run check-content
```

---

## `hero/` — Hero section

| File | Purpose |
|---|---|
| `video.json` | Controls which video plays and its `objectPosition` CSS value |
| `hba_filip*.mp4` | Hero background video files |

`video.json` format:
```json
{ "src": "/hero/hba_filip1.mp4", "objectPosition": "50% 28%" }
```

---

## `about/` — About section

| File | Purpose |
|---|---|
| `background.md` | Body copy rendered as HTML prose |
| `about-01.webp` … | Section images, displayed automatically in alphabetical order |

`background.md` is plain Markdown. The `## Background` heading is stripped; the body renders inside a Tailwind `prose` block.

---

## `products/` — Products section

Each product is one Markdown file. The filename becomes the product ID (e.g. `wings.md` → product `wings`). Product images live in a subfolder with the same name (e.g. `wings/`).

**Required frontmatter fields:**

```yaml
---
title: WINGS — Arrow Nocking Aid
tagline: A short one-liner description
price: Price on request
techniques:
  - Slavic
  - Thumb
specs:
  - label: Material
    value: Renewable bioplastic
---

- First feature bullet
- Second feature bullet
```

**Images:** Place WebP files in `content/products/{id}/` named `{id}-01.webp`, `{id}-02.webp`, etc. They appear in the gallery automatically — sorted alphabetically, no code change needed.

**To add a new product:** create `content/products/{id}.md` and `content/products/{id}/`. Done.

---

## `process/` — Process section

| File | Purpose |
|---|---|
| `process.md` | Step definitions (YAML frontmatter only) |
| `process-01.webp` … | Step images, referenced by filename in frontmatter |

`process.md` format:

```yaml
---
title: How It Is Made
steps:
  - title: Design & CAD
    description: Full description of the step.
    image: process-01.webp
---
```

---

## `faq/` — FAQ section

`faq/faq.md` — Markdown with a YAML frontmatter title. Each `## Question` heading followed by a paragraph becomes one FAQ item.

```yaml
---
title: Frequently Asked Questions
---

## What materials are products made from?

Answer paragraph here.
```

---

## `gallery/` — Gallery section

Place WebP files named `gallery-01.webp`, `gallery-02.webp`, etc. They are sorted alphabetically and displayed automatically.

---

## `brand/` — Brand assets

| File | Purpose |
|---|---|
| `logo-dark.png` | Logo on light backgrounds |
| `logo-light.png` | Logo on dark backgrounds (navbar, footer) |
| `logo-vector.svg` | Vector logo |
| `favicon.svg` | Browser tab icon |

---

## `reviews/` — Reviews section

Each review is one Markdown file (e.g. `01-maria.md`). Filename prefix controls display order.

```yaml
---
author: Maria Kovac
role: Competitive horseback archer, Slovakia
---

The review text goes here as plain paragraph(s).
```

---

## `videos/` — YouTube links

`youtube-links.json` — flat array of YouTube video entries for the videos section:

```json
[
  {
    "title": "Video title",
    "description": "Short description",
    "embed_url": "https://www.youtube.com/watch?v=...",
    "thumbnail": "placeholder"
  }
]
```

---

## After editing content

Images and videos are synced to `public/` automatically when you run `npm run dev` or `npm run build`. Never edit files directly in `public/` — they are overwritten on every run.

Run `npm run check-content` at any point to verify all required fields are present.
