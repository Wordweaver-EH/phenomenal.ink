# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a **multi-workspace Astro monorepo** for the phenomenal.ink ecosystem - a sophisticated platform combining artistic essays, scientific analysis, and experimental psychology. The project uses a subdomain architecture with independent Astro applications sharing common components and design patterns.

### Subdomain & Workspace Structure
- **`phenomenal.ink`** - Main site (`/mainsite/`) introducing the "Three E's" framework
- **`blog.phenomenal.ink`** - E-Essay (`/blog/`) - artistic, contemplative writing (production-ready)
- **`sci.phenomenal.ink`** - E-Explication (`/sci/`) - scientific analysis and interpretation
  - `/reports/` - Data reanalysis, paper interpretations (blog-style format)
  - `/wiki/` - Reference material, interconnected scientific concepts
- **`exp.phenomenal.ink`** - E-Experiments (`/exp/`) - Interactive psychology experiments (JSPsych-based)

### Legacy/Development Folders
- **`/doc/`** - Documentation experiments (may be deprecated)
- **`/shared/`** - Shared components and styles across workspaces
- **Root level** - Base configuration (structure needs cleanup)

## Key Technologies & Integrations

- **Astro 4.x** with static site generation (`output: 'static'`)
- **Starlight** for documentation framework and theming
- **React 18** for interactive components (with `client:load` hydration)
- **TypeScript 5** with strict configuration
- **MDX** with custom remark/rehype plugins
- **Tufte CSS** for academic-style typography and layout

### Critical Custom Plugins
- **`remark-sidenotes`** - Converts `[^1]` footnote syntax to React sidenote components
- **`remark-wiki-link`** - Enables `[[Page Name]]` internal linking
- **`rehype-external-links`** - Adds `target="_blank"` to external links

## Development Commands

### Root Level
```bash
npm run dev     # Start development server
npm run build   # Build production site
npm run preview # Preview built site
```

### Blog Directory (Primary Application)
```bash
cd blog/
npm run dev     # Start blog dev server (port 4321)
npm run build   # Build blog for production
npm run preview # Preview blog build
```

Each workspace (`/mainsite/`, `/sci/`, etc.) has identical command structure.

## Sidenotes System Architecture

The sidenotes are this project's most complex feature, requiring coordination between:

1. **Markdown Processing**: `remark-sidenotes.js` transforms `[^1]` syntax to `<Sidenote>` components during build
2. **React Components**: `SidenoteReact.tsx` handles responsive behavior and interactivity
3. **State Management**: `noteState.ts` manages highlighting across all sidenotes
4. **CSS Styling**: `sidenote.css` provides desktop margin positioning and mobile responsive behavior

### Sidenote Behavior
- **Desktop**: Float in right margin with click-to-highlight
- **Mobile**: Hidden by default, appear inline when clicked, with toggle button for show/hide all
- **Responsive Breakpoint**: 760px width

## Theme System

Uses CSS custom properties for comprehensive light/dark theme support:

```css
/* Key theme variables */
--background-color
--text-color  
--accent-color
--side-note-color
--link-color
--highlight-color
```

Theme switching handled by `ThemeToggle.astro` with localStorage persistence and system preference detection.

## Content Structure

### Blog Content Location
- **Posts**: `/blog/src/content/docs/` (not `/blog/src/content/blog/`)
- **Drafts**: `/blog/src/content/docs/drafts/`
- **Index**: `/blog/src/content/docs/index.mdx`

### Frontmatter Requirements
```yaml
title: "Post Title"
description: "Post description" 
date: 2024-01-01
tags: ["tag1", "tag2"]
```

## Component Architecture

### Custom Starlight Components
- **`CustomHeader.astro`** - Navigation with phenomenal.ink branding
- **`CustomSidebar.astro`** - Recent posts, tags, and TOC
- **`Head.astro`** - Custom head with analytics and theme detection
- **`EmptyFooter.astro`** - Removes default Starlight footer

### Interactive Components
- **`SidenoteReact.tsx`** - Main sidenote component with mobile/desktop logic
- **`SidenoteToggle.tsx`** - Mobile-only toggle for showing/hiding all sidenotes
- **`ThemeToggle.astro`** - Light/dark theme switcher

## Responsive Design Breakpoints

```css
/* Desktop */   > 1400px - Full sidebar, margin sidenotes
/* Laptop */    1200px-1400px - Adjusted content width (75%)
/* Tablet */    768px-1200px - Narrower content (70%)
/* Mobile */    < 768px - Full width, inline sidenotes
```

## Styling Architecture

- **`tufte.css`** - Base typography and academic styling
- **`sidenote.css`** - Sidenote positioning and responsive behavior
- **CSS Variables** - Comprehensive theming system
- **Starlight Integration** - Custom CSS overrides for Starlight components

## Build & Deployment

- **Static Generation**: All sites built to `/dist/`
- **GitHub Actions**: Automated deployment via `.github/workflows/deploy.yml`
- **Vercel**: Alternative deployment with `vercel.json` configuration
- **Site URL**: `https://blog.phenomenal.ink`

## Development Guidelines

1. **Multi-workspace Development**: Each workspace is independent but shares design patterns
2. **Sidenote Usage**: Use standard footnote syntax `[^1]` - never manually write `<Sidenote>` components
3. **Theme Consistency**: Always use CSS custom properties, never hardcoded colors
4. **Responsive Testing**: Test sidenote behavior at 760px breakpoint
5. **Component Patterns**: Follow existing patterns for Astro/React integration with `client:load`

## Common Tasks

- **Add New Post**: Create `.mdx` file in `/blog/src/content/docs/`
- **Add Sidenote**: Use `[^1]: Sidenote content` syntax in Markdown
- **Modify Theme**: Edit CSS custom properties in `tufte.css`
- **Test Responsive**: Check sidenote behavior below 760px width
- **Deploy**: Push to main branch triggers GitHub Actions deployment

## Configuration Files

- **`astro.config.mjs`** - Main configuration with integrations and plugins
- **`tsconfig.json`** - TypeScript configuration extending Astro strict
- **`package.json`** - Dependencies and scripts for each workspace