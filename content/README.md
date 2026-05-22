# Content Directory

This directory contains all content for the LAW (Lukas Archery Works) website.

## Structure

```
content/
├── README.md              # This file
├── texts/                 # Text content (JSON format for easy editing)
│   ├── about.json         # About section text
│   ├── products.json      # Product descriptions
│   ├── testimonials.json  # User testimonials
│   └── footer.json        # Footer content
├── images/
│   ├── brand/             # Logo, favicon, brand assets
│   │   └── README.md      # Image requirements
│   ├── wings/             # WINGS product images
│   │   └── README.md      # Image requirements
│   ├── arc/               # ARC product images
│   │   └── README.md      # Image requirements
│   ├── horizon/           # HORIZON product images
│   │   └── README.md      # Image requirements
│   └── about/             # About section images
│       └── README.md      # Image requirements
└── videos/                # Review video metadata
    └── reviews.json       # YouTube video URLs and descriptions
```

## How to Add Content

### 1. Product Images

Place images in the corresponding product folder:
- `content/images/wings/` - WINGS product images
- `content/images/arc/` - ARC product images
- `content/images/horizon/` - HORIZON product images

**Requirements:**
- Format: WebP (preferred) or optimized JPG
- Minimum width: 1200px
- Naming: `{product}-01.webp`, `{product}-02.webp`, etc.
- Recommended size: < 500KB per image for fast loading

### 2. Brand Assets

Place logo and favicon in `content/images/brand/`:
- `logo-dark.png` - Logo on light background (transparent PNG)
- `logo-light.png` - Logo on dark background (transparent PNG)
- `logo-vector.svg` - Vector logo for scalability
- `favicon.svg` - Favicon

### 3. About Section Images

Place workshop/craftsmanship images in `content/images/about/`:
- Format: WebP or JPG, min 800px width
- Naming: `about-01.webp`, `about-02.webp`, etc.

### 4. Text Content

Edit JSON files in `content/texts/`:
- `about.json` - Company history and craftsmanship story
- `products.json` - Product descriptions (EN + SK)
- `testimonials.json` - User testimonials (EN + SK)

See each file for format details.

### 5. Video Reviews

Edit `content/videos/reviews.json` with YouTube video URLs:
- Use embed format: `https://www.youtube.com/embed/[VIDEO_ID]`

## After Adding Content

Images will be symlinked/copied to `frontend/public/images/` during build.
Text content is loaded at runtime from the backend.