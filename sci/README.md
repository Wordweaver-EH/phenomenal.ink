# Weaver's Journal of Phenomenal Science

A Tufte-inspired documentation and article site built with Astro and Starlight.

## Quick Start

```bash
cd sci
npm install
npm run dev      # Start dev server at http://localhost:4321
npm run build    # Build for production (includes PDF generation)
```

## Directory Structure

```
sci/
├── public/
│   ├── fonts/           # Custom fonts (et-book)
│   ├── images/          # Site images (referenced as /images/...)
│   ├── pdfs/            # Pre-generated PDFs (committed to git)
│   └── styles/          # Additional public stylesheets
├── scripts/
│   └── generate-pdfs.js # PDF generation script (Puppeteer)
├── shared/              # Shared utilities and assets
├── src/
│   ├── components/      # Astro components (Figure, Sidenote, Video, etc.)
│   ├── config/          # Site configuration
│   ├── content/
│   │   ├── config.ts    # Content collection config
│   │   └── docs/        # Article content (MDX files)
│   │       ├── index.mdx            # Homepage
│   │       ├── formatting-guide.mdx # Style reference
│   │       └── drafts/              # Draft articles
│   ├── layouts/         # Page layouts
│   ├── pages/           # Additional pages (RSS, etc.)
│   ├── plugins/         # Remark/Rehype plugins
│   ├── styles/          # CSS (tufte.css, table.css)
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── astro.config.mjs     # Astro configuration
├── package.json
├── tsconfig.json
└── vercel.json          # Vercel deployment config
```

## Writing Articles

### Creating a New Article

1. Create a new `.mdx` file in `src/content/docs/`:

```mdx
---
title: "Article Title"
description: "Brief description for SEO and previews"
date: 2024-12-19
tags: ["topic1", "topic2"]
---

Your content here...
```

2. Import any components you need at the top (after frontmatter):

```mdx
import Figure from '../../components/Figure.astro';
import Sidenote from '../../components/Sidenote.astro';
import MarginFigure from '../../components/MarginFigure.astro';
import Video from '../../components/Video.astro';
```

### Draft Articles

Place drafts in `src/content/docs/drafts/` with `draft: true` in frontmatter:

```mdx
---
title: "Work in Progress"
draft: true
---
```

Drafts won't appear in production builds.

## Images

**Location**: All images go in `public/images/`

**Reference in MDX**:
```mdx
![Alt text](/images/my-image.png)
```

**In Figure components**:
```mdx
<Figure id="fig-1" caption="My caption">
  ![Alt text](/images/my-image.png)
</Figure>
```

## Components

### Sidenotes (Numbered)

Use standard Markdown footnotes:
```mdx
This is a claim [^1].

[^1]: This appears in the margin with a number.
```

### Margin Notes (Unnumbered)

```mdx
<Sidenote>
  Unnumbered note in the margin.
</Sidenote>
```

### Figures

**Standard (caption in margin)**:
```mdx
<Figure id="fig-1" caption="Description">
  ![Alt](/images/image.png)
</Figure>
```

**Caption below**:
```mdx
<Figure id="fig-2" captionBelow caption="Description">
  ![Alt](/images/image.png)
</Figure>
```

**Full width**:
```mdx
<Figure id="fig-3" fullWidth caption="Wide image">
  ![Alt](/images/panorama.png)
</Figure>
```

### Margin Figures

```mdx
<MarginFigure caption="Small diagram">
  ![Alt](/images/small.png)
</MarginFigure>
```

### Video

```mdx
<Video src="https://youtube.com/watch?v=..." type="youtube" title="Title" />
```

### Math (KaTeX)

**Inline**: `$E = mc^2$`

**Block**:
```mdx
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

## PDF Generation

PDFs are pre-generated at build time using Puppeteer.

### Workflow

1. **Build with PDFs locally**:
   ```bash
   npm run build
   ```
   This runs `astro build` then `generate-pdfs.js`

2. **PDFs are saved to**: `public/pdfs/[slug].pdf`

3. **Commit the PDFs**:
   ```bash
   git add public/pdfs/
   git commit -m "build: Regenerate PDFs"
   git push
   ```

### Important Notes

- PDFs must be regenerated locally whenever content changes
- Vercel uses `build:vercel` which skips Puppeteer (no Chrome on serverless)
- The PDFs in `public/pdfs/` are committed to git and served statically

### PDF Features

- Custom "Weaver's Journal" header
- Tufte-style typography
- Sidenotes positioned in margins
- Zebra-striped tables
- High-contrast black text

## Deployment (Vercel)

The site is configured for Vercel deployment:

- **Build command**: `npm run build:vercel` (skips PDF generation)
- **Output directory**: `sci/dist`
- **Framework**: Astro (auto-detected)

### Vercel Config

Root `vercel.json` handles:
- Clean URLs
- Cache headers for fonts/images
- Build settings

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build + generate PDFs |
| `npm run build:vercel` | Build only (no PDFs, for Vercel) |
| `npm run build:pdf` | Generate PDFs from existing build |
| `npm run preview` | Preview production build |

## Styling

- **Main styles**: `src/styles/tufte.css`
- **Table styles**: `src/styles/table.css`
- **Print styles**: Embedded in `tufte.css` within `@media print`

### Theme

- Light/dark mode supported
- Accent color: `#ff6b6b` (coral red)
- Fonts: et-book (body), Updock (decorative P)

## Tips

1. **Always build before pushing** to regenerate PDFs
2. **Check the dev server** before building to catch errors
3. **Use relative paths** for component imports in drafts folder:
   - From `docs/`: `../../components/`
   - From `docs/drafts/`: `../../../components/`
