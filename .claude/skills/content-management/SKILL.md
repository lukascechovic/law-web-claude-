---
name: content-management
description: Workflows for managing site content on this Next.js portfolio — adding products, replacing images, editing text sections, and adding video. Use when the user wants to add or edit products, images, video, or the About section text.
---

# Content Management

## Add a new product

1. Create `content/products/{id}.md` with frontmatter:
   ```yaml
   title: Product Name
   tagline: Short tagline
   price: "€X.XX"
   specs:
     - label: Material
       value: Oak
   techniques:
     - Slavic
   ```
2. Add `-` bullet lines in the body for features.
3. Create `content/images/{id}/` with WebP images named `{id}-01.webp`, `{id}-02.webp`, etc.

Product appears on site and in chatbot grounding with **zero code changes** — id is the filename (ADR-0003).

## Add/replace product images

Drop WebP files into `content/images/{id}/` using the naming convention `{id}-NN.webp`. They appear automatically after the next `dev`/`build` — `getProduct()` reads the directory at build time and sorts alphabetically. No code change needed for a new folder.

## Edit section text

- **About section**: edit `content/texts/background.md`
- **Product copy, price, specs, techniques, features**: edit `content/products/{id}.md`

## Add video content

- Hero background: `content/videos/hba_filip1.mp4` (copied to `public/videos/` by copy-assets)
- YouTube links for future embeds: `content/videos/youtube links.json`
