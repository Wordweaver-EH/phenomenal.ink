# Changelog

All notable changes to the `sci.phenomenal.ink` project will be documented in this file.

## [Unreleased] - 2025-12-17

### Added
- Created `CHANGELOG.md` to track project history.
- **Print Stylesheet & PDF Generation**:
    - Implemented comprehensive `@media print` styles in `tufte.css` for high-quality PDF export.
    - **Layout**: Asymmetric page layout with wide right margin for true sidenote positioning.
    - **UI**: Automatically hides header, sidebar, and navigation in print mode.
    - **Figures**: Optimized print layout for standard and full-width figures; prevented image clipping at page breaks.
    - **Tables**: Styled tables with Tufte/academic "booktabs" look in print (no vertical borders, heavy horizontal rules). optimized widths and border weights.
    - **Code Blocks**: Enabled page breaking for long code blocks; fixed border visibility and removed double borders; ensured inline code remains inline.
    - **Typography**: Adjusted font sizes and margins for print readability.
    - **Video**: Added print-only fallback showing poster, title, and URL instead of hidden interactive player.
    - **Header**: Replaced standard header with "Weaver's Journal" academic header in print (serif typography, Updock 'P', non-repeating).
    - **Print UI Clean-up**: Hidden lightbox expand icons and "skip to content" links in print output.
    - **Tables**: Added zebra striping to tables (subtle red in dark mode, gray in print).
    - **Print Contrast**: Increased contrast for print output (pure black headings, borders, and side notes).
- **Content**:
    - Updated site title and metadata to "Weaver's Journal of Phenomenal Science".
    - Removed legacy `figures-and-math.mdx` file.
- **Documentation**:
    - Created `formatting-guide.mdx` as a comprehensive reference for all styling features.
- **Sidebar & Navigation**:
    - Implemented `SidebarToggle` component to collapse/expand the sidebar.
    - Fixed sidebar TOC indentation for better hierarchy visibility.
- **Figure Improvements**:
    - **Unified Numbering**: Moved counter logic to `figure.css` so `MarginFigure` and `Figure` share continuous numbering.
    - **Layout Fixes**: Fixed float clearing issues where standard figures would drop below margin content.
    - **Margin Figures**: Added numbering to margin figure captions.
- **Figure Components**:
    - Implemented `<Figure>` component with margin caption support, `fullWidth`, and `captionBelow` options.
    - Implemented `<MarginFigure>` component for small figures in the margin.
    - Implemented `<FigureRef>` component for cross-referencing figures.
    - Added `figure.css` with Tufte-style layouts and mobile responsiveness.
    - Built-in lightbox for all figures with `noLightbox` opt-out.
- **KaTeX Math Support**:
    - Integrated `remark-math` and `rehype-katex` for LaTeX math rendering.
    - Added KaTeX CSS to site head for equation styling.
- **Table Styling**:
    - Added `table.css` with Tufte-style minimal lines, hover highlighting, and responsive scrolling.
- **Image Lightbox**:
    - Integrated lightbox into Figure component with caption display in overlay.
    - Added smooth zoom animation and keyboard/click dismiss.
- **Demo Content**:
    - Created `figures-and-math.mdx` showcasing all new features.

### Fixed
- **Figure Styling**:
    - Centered regular figures within text column for better alignment with justified text.
    - Full-width figures now properly extend into margin area with image filling container.
    - Full-width captions are left-aligned; regular captions are centered.
    - Margin captions now align with top of figure.
    - Mobile: captions appear below figures, not above.
    - Dark mode: removed colored background from margin figures.
    - Added `overflow: visible` to containers for proper full-width extension.
- **Sidebar**:
    - Restored custom `Sidebar` component (`src/components/CustomSidebar.astro`) to fix content isolation and prevent blog posts from appearing in the documentation sidebar.
- **Math Configuration**:
    - Adapted Next.js-style configuration:
        - Added KaTeX CSS via CDN in `astro.config.mjs` head.
        - Configured `remark-math` and `rehype-katex` plugins.
    - Fixed `MDXError` (Acorn parsing) by ensuring proper plugin ordering and configuration.
    - Verified rendering of inline, block, matrix, and numbered equations.

## [0.1.0] - 2025-12-16

### Added
- **Project Initialization**:
    - Initialized new `sci` workspace within the monorepo structure.
    - Set up Astro configuration with Starlight and React integrations.
    - Configured dependencies similar to the main blog.
- **Sidenote Component**:
    - Implemented `<Sidenote />` component for Tufte-style margin notes.
    - Added CSS styling (`sidenote.css`) for responsive margin notes (collapsing to inline on smaller screens).
- **Documentation**:
    - Created initial `index.mdx` and `physics-of-phosphenes.mdx` content.

### Fixed
- **Styling**:
    - Resolved CSS conflicts regarding sidenote positioning and margins.
    - Tuned font sizes and colors for sidenotes to ensure readability and visual hierarchy.
    - Fixed responsive behavior for mobile devices where sidenotes were not displaying correctly.

### Changed
- **Configuration**:
    - Updated `astro.config.mjs` to include custom integrations and remark/rehype plugins.
