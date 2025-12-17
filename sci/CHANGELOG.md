# Changelog

All notable changes to the `sci.phenomenal.ink` project will be documented in this file.

## [Unreleased] - 2025-12-17

### Added
- Created `CHANGELOG.md` to track project history.
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
