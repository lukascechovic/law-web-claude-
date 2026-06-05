# Content Guide

Everything the site displays comes from files in this directory. No code changes are needed to update text, images, or products — edit the files here and run `npm run dev`.

After adding or replacing any files, run the content audit to check for errors:

```bash
npm run check-content
```

---

## Products (`content/products/`)

Each product is one Markdown file. The filename becomes the product ID (e.g. `wings.md` → `/products/wings`).

**Required frontmatter fields:**

```yaml
---
title: WINGS — Arrow Nocking Aid          # shown as the product heading
tagline: A short one-liner description    # shown below the title
price: Price on request                   # or e.g. "From €19"
techniques:                               # nocking techniques supported
  - Slavic
  - Thumb
specs:                                    # ordered list of spec rows
  - label: Material
    value: Renewable bioplastic
---

- First feature bullet
- Second feature bullet
```

**Images:** Place WebP files in `content/images/{id}/` named `{id}-01.webp`, `{id}-02.webp`, etc. They appear in the gallery automatically — sorted alphabetically, no code change needed.

**To add a new product:** create `content/products/{id}.md` and `content/images/{id}/`. Done.

---

## Reviews (`content/reviews/`)

Each review is one Markdown file (e.g. `01-maria.md`). Filename prefix controls display order.

**Required frontmatter fields:**

```yaml
---
author: Maria Kovac
role: Competitive horseback archer, Slovakia
---

The review text goes here as plain paragraph(s).
```

---

## About section (`content/texts/background.md`)

Plain Markdown. The `## Background` heading is stripped; the body is rendered as HTML inside a Tailwind `prose` block. Edit freely.

---

## FAQ (`content/texts/faq.md`)

Markdown with a YAML frontmatter title. Each `## Question` heading followed by a paragraph becomes one FAQ item.

```yaml
---
title: Frequently Asked Questions
---

## What materials are products made from?

Answer paragraph here.
```

---

## Process steps (`content/texts/process.md`)

YAML frontmatter only — the body is unused. Each step needs `title`, `description`, and `image` (filename relative to `content/images/process/`).

```yaml
---
title: How It Is Made
steps:
  - title: Design & CAD
    description: >-
      Full description of the step.
    image: process-01.webp
---
```

---

## Brand assets (`content/images/brand/`)

| File | Purpose |
|---|---|
| `logo-dark.png` | Logo on light backgrounds |
| `logo-light.png` | Logo on dark backgrounds |
| `logo-vector.svg` | Vector logo |
| `favicon.svg` | Browser tab icon |

---

## Videos (`content/videos/`)

Hero background video: `hba_filip1.mp4`. Replace this file to change the hero video.

YouTube embed links for future use are stored in `content/videos/youtube links.json`.

---

## Gallery (`content/images/gallery/`)

Place WebP files named `gallery-01.webp`, `gallery-02.webp`, etc. Sorted alphabetically.

---

## After editing content

Images and videos are synced to `public/` automatically when you run `npm run dev` or `npm run build`. Never edit files directly in `public/` — they are overwritten on every run.

Run `npm run check-content` at any point to verify all required fields are present.
