# Phenomenal Blog Documentation

Welcome to the comprehensive documentation for the Phenomenal Blog. This guide covers all aspects of the blog's architecture, including **sidenotes**, **sidebar**, **header bar**, **margin notes**, **images**, **text**, **theme management**, **CSS styling**, **React integration**, and more. Whether you're a developer looking to understand the implementation details or a contributor aiming to extend the blog's functionality, this documentation will provide the necessary insights.

## Table of Contents

Overview
Project Structure
Sidenotes
Implementation
Usage
Customization
Sidebar
Components
Data Handling
Header Bar
Margin Notes
Images and Text Handling
Theme Management
Components
CSS Variables
CSS Styling
Tufte CSS
Custom Styles
React Integration
MDX Integration
Remark Plugins
Astro Configuration
Additional Components
Testing and Usage
---

Overview
The Phenomenal Blog is built using Astro with MDX support, enabling a seamless blend of Markdown and React components. The blog leverages a custom remark plugin to transform Markdown footnotes into interactive sidenotes, enhancing the readability and interactivity of the content. Styling is primarily handled using Tufte CSS with additional customizations to support responsive design and theme toggling.
---
Project Structure
Here's an overview of the project's directory structure:

├── blog/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContentWrapper.astro
│   │   │   ├── CustomHeader.astro
│   │   │   ├── CustomSidebar.astro
│   │   │   ├── Head.astro
│   │   │   ├── MarginNote.astro
│   │   │   ├── MarginNoteReact.tsx
│   │   │   ├── noteState.ts
│   │   │   ├── Sidenote.astro
│   │   │   ├── SidenoteReact.tsx
│   │   │   ├── SidenoteToggle.tsx
│   │   │   ├── SimpleThemeToggle.astro
│   │   │   └── ThemeToggle.astro
│   │   ├── content/
│   │   │   ├── blog/
│   │   │   └── docs/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── styles/
│   │       ├── sidenote.css
│   │       └── tufte.css
├── public/
├── src/
├── astro.config.mjs
└── package.json

Sidenotes
Sidenotes enhance the reading experience by providing supplementary information without disrupting the main content flow. In the Phenomenal Blog, sidenotes are implemented by converting Markdown footnotes into interactive React components.
Implementation
Markdown Footnote Syntax: Instead of manually typing out <Sidenote> components, standard Markdown footnote syntax ([^1]) is used.
Custom Remark Plugin: A custom Remark plugin (remark-sidenotes.js) transforms footnote references into <Sidenote> React components during the Markdown processing phase.
React Component: The SidenoteReact.tsx component handles the display and interactivity of sidenotes.
CSS Styling: Custom CSS (sidenote.css) ensures sidenotes are styled appropriately across different devices and themes.
Remark Plugin (src/plugins/remark-sidenotes.js)

import { visit } from 'unist-util-visit';

export default function remarkSidenotes() {
  return transformer;

  function transformer(tree) {
    const footnotes = {};

    // Collect all footnote definitions
    visit(tree, 'footnoteDefinition', (node) => {
      footnotes[node.identifier] = node;
    });

    // Replace footnote references with Sidenote components
    visit(tree, 'footnoteReference', (node, index, parent) => {
      const identifier = node.identifier;
      const footnote = footnotes[identifier];
      if (footnote) {
        const number = parseInt(identifier.replace(/\D/g, ''), 10);

        // Replace the footnote reference with a JSX Sidenote component
        parent.children[index] = {
          type: 'mdxJsxTextElement',
          name: 'Sidenote',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'number',
              value: number.toString()
            }
          ],
          children: processChildren(footnote.children)
        };
      }
    });

    // Remove the footnote definitions since we've converted them to sidenotes
    tree.children = tree.children.filter(node => node.type !== 'footnoteDefinition');
  }
}

// Process children nodes to maintain their structure
function processChildren(nodes) {
  return nodes.flatMap(node => {
    if (node.type === 'paragraph') {
      const children = processChildren(node.children);
      // If paragraph contains only an image, return the image directly
      if (children.length === 1 && children[0].type === 'mdxJsxFlowElement' && children[0].name === 'img') {
        return children;
      }
      return [{
        type: 'mdxJsxTextElement',
        name: 'span',
        attributes: [],
        children: children
      }];
    }
    if (node.type === 'text') {
      return [{ type: 'text', value: node.value }];
    }
    if (node.type === 'strong') {
      return [{
        type: 'mdxJsxTextElement',
        name: 'strong',
        attributes: [],
        children: processChildren(node.children)
      }];
    }
    if (node.type === 'emphasis') {
      return [{
        type: 'mdxJsxTextElement',
        name: 'em',
        attributes: [],
        children: processChildren(node.children)
      }];
    }
    if (node.type === 'inlineCode') {
      return [{
        type: 'mdxJsxTextElement',
        name: 'code',
        attributes: [],
        children: [{ type: 'text', value: node.value }]
      }];
    }
    if (node.type === 'image') {
      return [{
        type: 'mdxJsxFlowElement',
        name: 'img',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'src',
            value: node.url
          },
          {
            type: 'mdxJsxAttribute',
            name: 'alt',
            value: node.alt || ''
          }
        ]
      }];
    }
    // Handle more node types as needed
    return [];
  });
}

Usage
To add a sidenote in your Markdown or MDX content, use the standard footnote syntax:
This is a paragraph with a simple sidenote[^1].

[^1]: This is a basic **sidenote** that demonstrates the conversion from footnote syntax to sidenote component.

The custom Remark plugin will automatically convert [^1] into the Sidenote React component during the build process.
Customization
Sidenote Component: The Sidenote.astro component wraps the SidenoteReact component to integrate with Astro.

  ---
  import '../styles/sidenote.css';
  import SidenoteReact from './SidenoteReact';
  
  interface Props {
    number: number;
    id?: string;
  }
  
  const { number, id } = Astro.props;
  ---
  
  <SidenoteReact number={number} id={id} client:load>
    <slot />
  </SidenoteReact> 

React Component (SidenoteReact.tsx): Manages interactivity such as highlighting and responsiveness.
  import React, { useState, useEffect, useRef } from 'react';
  import { subscribeToHighlight, setHighlightedNote, subscribeToVisibility } from './noteState';

  interface SidenoteProps {
    children: React.ReactNode;
    number: number;
    id?: string;
  }

  export default function SidenoteReact({ children, number, id = `sn-${number}` }: SidenoteProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const noteRef = useRef<HTMLSpanElement>(null);
    const numberRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const checkMobile = () => {
        const isMobileView = window.innerWidth < 760;
        setIsMobile(isMobileView);
        
        if (noteRef.current && numberRef.current) {
          if (isMobileView) {
            // Find the parent paragraph
            let parentParagraph = numberRef.current.closest('p');
            if (!parentParagraph) return;

            // Move the note (but not the number) to the end of the paragraph
            parentParagraph.appendChild(noteRef.current);
            
            noteRef.current.classList.add('mobile-block');
            noteRef.current.classList.remove('mobile');
          } else {
            // In desktop view, move the note right after the number
            if (numberRef.current.nextSibling !== noteRef.current) {
              numberRef.current.after(noteRef.current);
            }
            noteRef.current.classList.remove('mobile-block');
            noteRef.current.classList.add('mobile');
          }
        }
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
      const unsubscribe = subscribeToHighlight((highlightedId) => {
        setIsHighlighted(highlightedId === id);
      });
      return unsubscribe;
    }, [id]);

    useEffect(() => {
      const unsubscribe = subscribeToVisibility((visible) => {
        setIsVisible(visible);
      });
      return unsubscribe;
    }, []);

    const handleClick = () => {
      if (isMobile) {
        // Mobile behavior
        if (!isVisible) {
          // If sidenotes are hidden, clicking shows this specific note
          setHighlightedNote(id);
          setIsVisible(true);
        } else if (isHighlighted) {
          setHighlightedNote(null);
        } else {
          setHighlightedNote(id);
          const element = document.getElementById(id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Desktop behavior - just toggle highlight
        if (isHighlighted) {
          setHighlightedNote(null);
        } else {
          setHighlightedNote(id);
        }
      }
    };

    return (
      <>
        <sup
          ref={numberRef}
          className="sidenote-number"
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        >
          {number}
        </sup>
        <span
          ref={noteRef}
          id={id}
          className={`sidenote ${isHighlighted ? 'highlighted' : ''} ${isMobile ? 'mobile' : ''} ${isMobile && !isVisible && !isHighlighted ? 'hidden' : ''}`}
        >
          {number}. {children}
        </span>
      </>
    );
  }

CSS Styling (public/styles/sidenote.css and src/styles/sidenote.css): Ensures sidenotes are appropriately styled across devices and themes.

  /* Sidenote styles with dark mode support */
  .sidenote-number {
    counter-increment: sidenote-counter;
    color: var(--accent-color);
    font-size: 1rem;
    vertical-align: super;
    cursor: pointer;
    user-select: none;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .sidenote-number:hover {
    color: var(--link-color);
  }

  /* Desktop styles (default) */
  .sidenote, .margin-note {
    float: right;
    clear: right;
    margin-right: -350px;
    width: 300px;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1.1rem;
    line-height: 1.3;
    vertical-align: baseline;
    color: var(--side-note-color);
    transition: all 0.2s ease;
    visibility: visible;
    position: relative;
  }

  .sidenote.highlighted, .margin-note.highlighted {
    color: var(--accent-color);
    background-color: var(--highlight-color);
    padding: 0.2em 0.5em;
    border-radius: 2px;
  }

  /* Mobile styles */
  @media screen and (max-width: 760px) {
    .sidenote-number {
      font-size: 0.8rem;
      vertical-align: super;
    }

    .sidenote, .margin-note {
      visibility: hidden;
      position: absolute;
      float: none;
      display: block;
      margin: 1rem 0;
      width: 95%;
      padding: 0.5em 1em;
      border-left: 3px solid var(--accent-color);
      background-color: var(--background-color);
    }

    .sidenote.mobile, 
    .margin-note.mobile,
    .sidenote.mobile-block,
    .margin-note.mobile-block {
      visibility: visible;
      position: relative;
    }

    .sidenote.hidden {
      display: none;
    }

    .margin-note.mobile-block {
      display: block;
      clear: both;
      float: none;
      width: 95%;
      margin: 1rem 0;
      margin-right: 0;
      padding: 0.5em 1em;
      border-left: 3px solid var(--accent-color);
      background-color: var(--background-color);
    }

    .sidenote.highlighted, .margin-note.highlighted {
      background-color: var(--highlight-dark);
    }
  }

  /* Sidenote toggle button */
  .sidenote-toggle {
    display: none; /* Hidden by default on desktop */
    position: fixed;
    bottom: 3.5rem; /* Position above theme toggle */
    right: 1.25rem; /* Same right alignment as theme toggle */
    background: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    padding: 0.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
    transform-origin: center;
  }

  /* Only show toggle in mobile view */
  @media screen and (max-width: 760px) {
    .sidenote-toggle {
      display: flex;
    }
  }

  .sidenote-toggle:hover {
    transform: scale(1.1);
    border-color: var(--accent-color);
  }

  .sidenote-toggle svg {
    color: var(--text-color);
    width: 18px;
    height: 18px;
  }

  Usage
Include sidenotes in your MDX or Markdown files using the standard footnote syntax. The custom Remark plugin will handle the transformation automatically.
This is a paragraph with a simple sidenote[^1]. You can keep writing after the sidenote reference.

[^1]: This is a basic **sidenote** that demonstrates the conversion from footnote syntax to sidenote component.


### Customization

Styling: Modify sidenote.css to adjust the appearance of sidenotes, including colors, fonts, and responsive behavior.
Behavior: The SidenoteReact.tsx component handles interactivity. You can extend its functionality by modifying event handlers or adding new features.

Sidebar
The sidebar provides navigation links, recent posts, and tags, enhancing the user's ability to traverse the blog content.
Components
CustomSidebar.astro: Handles the rendering of recent posts, tags, and the table of contents (TOC).

  ---
  import { getCollection } from 'astro:content';
  import type { Props } from '@astrojs/starlight/props';

  const { hasSidebar, ...props } = Astro.props;

  const posts = await getCollection('docs', ({ id }) => {
    return id.startsWith('blog/') && id !== 'blog/index.mdx';
  });

  const sortedPosts = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  // Get unique tags
  const allTags = [...new Set(posts.flatMap(post => post.data.tags || []))];

  // Get current page info
  const currentPage = props.entry;
  ---

  <nav aria-label="Primary">
    <div class="sidebar-content">
      <div id="toc-section">
        {currentPage?.data?.description && (
          <p class="page-description">{currentPage.data.description}</p>
        )}
        {props.headings && props.headings.length > 0 && (
          <>
            <h2>Table of Contents</h2>
            <ul class="toc-list">
              {props.headings.map((heading) => (
                <li>
                  <a href={`#${heading.slug}`} class={`toc-level-${heading.depth}`}>
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <h2>Recent Posts</h2>
      <ul>
        {sortedPosts.map(post => (
          <li>
            <a href={`/${post.slug}`}>{post.data.title}</a>
          </li>
        ))}
      </ul>

      <h2>Tags</h2>
      <ul class="tags">
        {allTags.map(tag => (
          <li>
            <a href={`/tags/${tag.toLowerCase()}`}>{tag}</a>
          </li>
        ))}
      </ul>
    </div>
  </nav>

  <style>
    .sidebar-content {
      padding: 1rem;
    }

    h2 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
    }

    li {
      margin-bottom: 0.5rem;
    }

    a {
      color: var(--text-color);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    a:hover {
      color: var(--accent-color);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tags a {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      background-color: var(--highlight-color);
      border-radius: 0.25rem;
      font-size: 0.9rem;
    }

    .toc-list {
      margin: 0;
      padding: 0;
    }

    .toc-list li {
      position: relative;
      padding-left: 1.5em;
    }

    .toc-list li::before {
      content: "—";
      position: absolute;
      left: 0;
      color: var(--text-color);
      opacity: 0.6;
    }

    .toc-level-2 {
      font-size: 0.9rem;
    }

    .toc-level-3 {
      padding-left: 2rem;
      font-size: 0.85rem;
    }

    .page-description {
      font-size: 1.3rem;
      line-height: 1.5;
      color: var(--text-color);
      opacity: 1;
      margin: -1.5rem 0 2rem 0;
      font-style: italic;
    }
  </style>

  Data Handling
Recent Posts: Retrieved using getCollection from the docs collection, filtered to include only blog posts excluding the index page.
Tags: Extracted by aggregating tags from all blog posts and ensuring uniqueness.
Table of Contents (TOC): Generated dynamically based on the headings present in the current page.
---
Header Bar
The header bar provides navigation links to different sections of the blog, ensuring easy access to content like the blog, documentation, and experiments.
Components
Header.astro: Custom header component implementing navigation links.

  ---
  import ThemeToggle from '../components/ThemeToggle.astro';
  import SidenoteToggle from '../components/SidenoteToggle';
  ---

  <nav class="nav-header">
    <div class="nav-content">
      <a href="/" class="home">phenomenal.ink</a>
      <div class="nav-links">
        <a href="/blog">blog</a>
        <a href="/doc">doc</a>
        <a href="/exp">exp</a>
      </div>
    </div>
  </nav>

  Styling
The header is styled to blend seamlessly with the blog's theme and ensure responsiveness across devices.
---
Margin Notes
Margin notes provide additional contextual information alongside the main content, similar to sidenotes but positioned in the margins.
Implementation
React Components: MarginNote.astro and SidenoteReact.tsx manage the rendering and behavior of margin notes.
CSS Styling: Managed via sidenote.css to ensure proper positioning and responsiveness.
Usage

<p>
  This is a test<MarginNote number={1}>
    Test margin note
  </MarginNote>
</p>

Images and Text Handling
Images and text within the blog are managed to ensure clarity, responsiveness, and adherence to the overall design aesthetic.
Images
Syntax: Standard Markdown image syntax is used.
  ![Alt text](./path/to/image)

  Rendering: Images are rendered using the <img> tag with appropriate src and alt attributes.
Styling: Images are styled for responsiveness and consistency using CSS.
Text
Markdown & MDX: Supports a wide range of Markdown features, extended by MDX for embedding React components.
Typography: Defined using CSS variables and responsive units to ensure readability across devices.
---
Theme Management
The blog supports both light and dark themes, allowing users to toggle between them seamlessly.
Components
ThemeToggle.astro: Provides a button for users to switch themes.
  ---
  // ThemeToggle.astro
  ---
  <button class="theme-toggle" onClick={toggleTheme}>
    Toggle Theme
  </button>

  <script>
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
  </script>

  <style>
    .theme-toggle {
      /* Styling for the toggle button */
    }
  </style>

  SidenoteToggle.astro: Allows users to toggle the visibility of sidenotes in mobile view.
CSS Variables
The blog uses CSS variables for theming and consistent styling across components. These variables are defined in the root scope and modified for dark theme:

```css
/* Light theme (default) */
:root {
  /* Core theme colors */
  --background-color: #faf8f1;
  --text-color: #222;
  --accent-color: #a00000;
  --side-note-color: #666;
  --link-color: #a00000;
  --border-color: #ddd;
  --highlight-color: rgba(160, 0, 0, 0.1);
  --highlight-dark: rgba(160, 0, 0, 0.15);
  --code-bg: #f3f1ea;

  /* Starlight integration */
  --sl-color-text-accent: var(--accent-color);
  --sl-color-text: var(--text-color);
  --sl-color-text-sidebar: var(--text-color);
  --sl-color-bg: var(--background-color);
  --sl-color-bg-sidebar: var(--background-color);
  --sl-color-bg-inline-code: var(--code-bg);
  --sl-color-text-inline-code: var(--text-color);
  --sl-color-bg-nav: var(--background-color);
  
  /* Layout */
  --sl-content-width: 100%;
  --sl-sidebar-width: 16rem;
  --sl-content-margin-inline: 0;
}

/* Dark theme */
[data-theme="dark"] {
  --background-color: #1a1a1a;
  --text-color: #e6e6e6;
  --accent-color: #ff6b6b;
  --side-note-color: #a0a0a0;
  --link-color: #ff6b6b;
  --border-color: #333;
  --highlight-color: rgba(255, 107, 107, 0.2);
  --highlight-dark: rgba(255, 107, 107, 0.25);
  --code-bg: #252525;
}
```

These variables are used throughout the codebase to maintain consistent styling and enable smooth theme transitions. The variables are organized into three main categories:

1. **Core Theme Colors**
   - `--background-color`: Main background color
   - `--text-color`: Primary text color
   - `--accent-color`: Accent color for highlights and important elements
   - `--side-note-color`: Color for sidenotes and margin notes
   - `--link-color`: Color for links and interactive elements
   - `--border-color`: Color for borders and dividers
   - `--highlight-color`: Background color for highlighted elements
   - `--highlight-dark`: Darker version of highlight color
   - `--code-bg`: Background color for code blocks

2. **Starlight Integration**
   - Variables prefixed with `--sl-` integrate with the Starlight theme
   - Map our custom theme colors to Starlight's variables
   - Ensure consistent styling across Starlight components

3. **Layout Settings**
   - `--sl-content-width`: Controls main content width
   - `--sl-sidebar-width`: Sets sidebar width
   - `--sl-content-margin-inline`: Controls content margins

The dark theme overrides only the color variables while maintaining the same layout settings. All color transitions are smooth thanks to CSS transitions defined in the base styles.
---
CSS Styling
Tufte CSS
The blog utilizes Tufte CSS as a base for styling, known for its elegant and minimalistic design inspired by Edward Tufte's principles.
Sidenote Positioning: Customized to align with the blog's layout and responsive design.

  /* Sidenote positioning */
  .sidenote, .marginnote {
    float: right !important;
    clear: right !important;
    margin-right: -24rem !important;
    width: 20rem !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    font-size: 0.9rem !important;
    line-height: 1.4 !important;
    vertical-align: baseline !important;
    position: relative !important;
    color: var(--side-note-color) !important;
    text-align: justify !important;
    hyphens: auto !important;
  }

  /* Hide right sidebar */
  .right-sidebar {
    display: none !important;
  }

  /* Responsive adjustments */
  @media screen and (max-width: 1400px) {
    .sl-markdown-content {
      width: 75% !important;
      max-width: 75% !important;
    }
    .sidenote, .marginnote {
      margin-right: -28% !important;
      width: 23% !important;
    }
  }

  @media screen and (max-width: 1200px) {
    .sl-markdown-content {
      width: 70% !important;
      max-width: 70% !important;
    }
    .sidenote, .marginnote {
      margin-right: -25% !important;
      width: 20% !important;
    }
  }

Custom Styles
Additional CSS files (sidenote.css) provide further customization to support features like sidenote toggling, mobile responsiveness, and theme-specific styles.
Responsive Design: Ensures the blog looks good on various screen sizes, adjusting sidenotes and layouts accordingly.
Theme Support: CSS variables facilitate easy switching between light and dark themes.
---
React Integration
React is integrated into the blog to handle interactive components like sidenotes and margin notes.
Component Rendering: React components are rendered using Astro's React integration.
State Management
The blog uses a simple state management system for sidenotes and margin notes through `noteState.ts`:

```typescript
type Listener = (highlightedId: string | null) => void;
const listeners: Listener[] = [];
let currentHighlightedId: string | null = null;

export const subscribeToHighlight = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

export const setHighlightedNote = (id: string | null) => {
State Management: Features like highlighting sidenotes are managed using React's state and effect hooks.
Interactivity: Components respond to user interactions, such as clicking to highlight or toggle visibility.
Example: SidenoteReact Component

import React, { useState, useEffect, useRef } from 'react';
import { subscribeToHighlight, setHighlightedNote, subscribeToVisibility } from './noteState';

interface SidenoteProps {
  children: React.ReactNode;
  number: number;
  id?: string;
}

export default function SidenoteReact({ children, number, id = `sn-${number}` }: SidenoteProps) {
  // Component logic handling interactivity and responsiveness
  // ...
  
  return (
    <>
      <sup
        ref={numberRef}
        className="sidenote-number"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        {number}
      </sup>
      <span
        ref={noteRef}
        id={id}
        className={`sidenote ${isHighlighted ? 'highlighted' : ''} ${isMobile ? 'mobile' : ''} ${isMobile && !isVisible && !isHighlighted ? 'hidden' : ''}`}
      >
        {number}. {children}
      </span>
    </>
  );
}

---
MDX Integration
MDX allows embedding React components within Markdown content, enabling dynamic and interactive blog posts.
Configuration
MDX is configured in astro.config.mjs with support for smartypants, GitHub Flavored Markdown (GFM), and custom remark plugins like remark-sidenotes and remark-wiki-link.

import mdx from '@astrojs/mdx';
import remarkSidenotes from './src/plugins/remark-sidenotes.js';
import wikiLinkPlugin from 'remark-wiki-link';

export default defineConfig({
  integrations: [
    mdx({
      smartypants: true,
      gfm: true,
      remarkPlugins: [
        remarkSidenotes,
        [wikiLinkPlugin, {
          pageResolver: name => [name.replace(/\s+/g, '-').toLowerCase()],
          hrefTemplate: permalink => `/${permalink}`,
          aliasDivider: '|'
        }]
      ],
    }),
    // ... other integrations
  ],
  // ... other configurations
});

Usage
Embed React components directly within your Markdown or MDX files.

import HeaderLink from '../../components/HeaderLink.astro';

<HeaderLink href="#" onClick="alert('clicked!')">
  Embedded component in MDX
</HeaderLink>

---
Astro Configuration
The astro.config.mjs file orchestrates the integrations and settings for the Phenomenal Blog.

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import astroExpressiveCode from 'astro-expressive-code';
import starlightBlog from 'starlight-blog';
import wikiLinkPlugin from 'remark-wiki-link';
import remarkSidenotes from './src/plugins/remark-sidenotes.js';

export default defineConfig({
  integrations: [
    react(),
    astroExpressiveCode(),
    mdx({
      smartypants: true,
      gfm: true,
      remarkPlugins: [
        remarkSidenotes,
        [wikiLinkPlugin, {
          pageResolver: name => [name.replace(/\s+/g, '-').toLowerCase()],
          hrefTemplate: permalink => `/${permalink}`,
          aliasDivider: '|'
        }]
      ],
    }),
    starlight({
      plugins: [starlightBlog({
        rss: false
      })],
      title: 'Phenomenal Blog',
      defaultLocale: 'en',
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3
      },
      social: {
        github: 'https://github.com/yourusername'
      },
      components: {
        Head: './src/components/Head.astro',
        Header: './src/components/CustomHeader.astro',
        Sidebar: './src/components/CustomSidebar.astro'
      },
      customCss: [
        './src/styles/tufte.css',
        './src/styles/sidenote.css'
      ]
    })
  ],
  site: 'https://blog.phenomenal.ink',
  base: '/',
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  },
  vite: {
    ssr: {
      noExternal: ['react-icons']
    }
  }
});

Key Settings
Integrations: Configured to include React, MDX with custom plugins, Starlight for theming, and others.
Site Metadata: Defines the website URL and base path.
Markdown Settings: Configures syntax highlighting with Shiki.
Vite Configuration: Ensures certain packages are not externalized during SSR.
---
Additional Components
ContentWrapper.astro
Handles the layout of content and the dynamic generation of the Table of Contents (TOC).

---
---
<div class="toc-wrapper">
  <div class="toc">
    <h2>Table of Contents</h2>
    <div id="toc-content"></div>
  </div>
</div>
<div class="article-wrapper">
  <slot />
</div>

<script>
  // Generate TOC from headers
  const headers = document.querySelectorAll('.article-wrapper h1, .article-wrapper h2');
  const tocContent = document.getElementById('toc-content');
  
  if (tocContent) {
    let lastLevel = 0;
    headers.forEach(header => {
      const link = document.createElement('a');
      const id = header.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      header.id = id;
      link.href = `#${id}`;
      
      // Add line breaks between sections
      const currentLevel = parseInt(header.tagName[1]);
      if (lastLevel > currentLevel) {
        tocContent.appendChild(document.createElement('br'));
      }
      lastLevel = currentLevel;

      // Format text with line breaks
      const text = header.textContent || '';
      const words = text.split(/(?=[A-Z])/);
      link.textContent = words.join(' ');
      
      link.className = header.tagName.toLowerCase();
      tocContent.appendChild(link);
    });
  }
</script>

<style>
  .article-wrapper {
    max-width: 650px;
    margin: 0 auto;
    padding: 0 1.5rem;
    position: relative;
    color: var(--text-color);
  }

  .toc-wrapper {
    position: fixed;
    top: 8rem;
    left: 2rem;
    width: 250px;
  }

  .toc {
    padding: 1rem;
  }

  .toc h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--text-color);
  }

  .toc a {
    display: block;
    color: var(--accent-color);
    text-decoration: none;
    margin-bottom: 0.8rem;
    font-size: 1rem;
    line-height: 1.4;
    transition: color 0.2s ease;
  }

  .toc a:hover {
    color: var(--link-color);
  }

  .toc a.h1 {
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .toc a.h2 {
    padding-left: 1rem;
    margin-bottom: 0.6rem;
  }

  .toc br {
    display: block;
    content: "";
    margin-bottom: 0.8rem;
  }

  .article-wrapper :global(h1) {
    font-size: 3.2rem;
    font-style: italic;
    font-weight: normal;
    margin-top: 2rem;
    margin-bottom: 2rem;
    line-height: 1;
    color: var(--accent-color);
  }

  .article-wrapper :global(h2) {
    font-size: 2.2rem;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    color: var(--accent-color);
  }

  .article-wrapper :global(p) {
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
    line-height: 2;
    color: var(--text-color);
  }

  .article-wrapper :global(ul) {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .article-wrapper :global(li) {
    margin-bottom: 1.5rem;
    line-height: 1.6;
    font-size: 1.4rem;
  }

  .article-wrapper :global(a) {
    color: var(--accent-color);
    font-weight: normal;
  }

  .article-wrapper :global(a:hover) {
    color: var(--link-color);
  }

  @media (max-width: 1280px) {
    .toc-wrapper {
      display: none;
    }
  }

  @media (max-width: 760px) {
    .article-wrapper {
      padding: 1rem 2rem;
      width: 100%;
      box-sizing: border-box;
    }
    
    .article-wrapper :global(h1) {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      margin-top: calc(var(--sl-nav-height) + 1rem);
      padding: 0;
    }

    .article-wrapper :global(h2) {
      font-size: 1.8rem;
      padding: 0;
    }

    .article-wrapper :global(p) {
      padding: 0;
    }
  }
</style>

Testing and Usage
Ensure that all components render correctly and interactivity features like sidenotes and theme toggling work as expected across different devices and browsers.
Development Server
Run the development server to preview changes in real-time:
npm run dev

Mobile Responsiveness
The blog is fully responsive, adapting its layout and functionality across different screen sizes. Here's how different components behave:

1. **Breakpoints**
```css
/* Desktop: > 1400px */
/* Laptop: 1200px - 1400px */
/* Tablet: 768px - 1200px */
/* Mobile: < 768px */
```

2. **Content Layout**
- **Desktop** (>1400px)
  - Main content: 75% width
  - Sidenotes: Right margin with 20rem width
  - Full sidebar visible

- **Laptop** (1200px-1400px)
  ```css
  .sl-markdown-content {
    width: 75% !important;
    max-width: 75% !important;
  }
  .sidenote, .marginnote {
    margin-right: -28% !important;
    width: 23% !important;
  }
  ```

- **Tablet** (768px-1200px)
  ```css
  .sl-markdown-content {
    width: 70% !important;
    max-width: 70% !important;
  }
  .sidenote, .marginnote {
    margin-right: -25% !important;
    width: 20% !important;
  }
  ```

- **Mobile** (<768px)
  ```css
  :root {
    --sl-sidebar-width: 0 !important;
    --sl-content-margin-inline: 0 !important;
  }
  .sl-markdown-content {
    width: 100% !important;
    max-width: 100% !important;
    padding: 2rem 1rem 1rem 1rem !important;
  }
  ```

3. **Sidenotes Behavior**
- **Desktop/Laptop**: Displayed in margins
- **Mobile**: 
  ```css
  .sidenote, .marginnote {
    display: none !important;
    position: relative !important;
    width: calc(100% - 2rem) !important;
    margin: 1rem !important;
    padding: 1rem !important;
    background-color: var(--highlight-color) !important;
    border-radius: 0.5rem !important;
  }
  .sidenote.mobile-active,
  .marginnote.mobile-active {
    display: block !important;
  }
  ```

4. **Header Adjustments**
```css
@media screen and (max-width: 50rem) {
  .header {
    position: fixed;
    margin: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100vw;
    box-sizing: border-box;
  }
}
```

5. **Typography Scaling**
```css
@media screen and (max-width: 768px) {
  h1 {
    font-size: 2rem !important;
    line-height: 1.2 !important;
    margin-top: 0 !important;
    margin-bottom: 1rem !important;
  }
}
```

6. **Interactive Features**
- **Sidenote Toggle**: Only appears on mobile
  ```css
  .sidenote-toggle {
    display: none; /* Hidden by default on desktop */
  }
  @media screen and (max-width: 760px) {
    .sidenote-toggle {
      display: flex;
      position: fixed;
      bottom: 3.5rem;
      right: 1.25rem;
    }
  }
  ```
- **Theme Toggle**: Repositions on mobile
- **Search**: Adapts to available width

7. **Performance Considerations**
- CSS transitions are maintained for smooth theme switching
- Images are responsive with max-width constraints
- Font sizes use relative units (rem) for consistent scaling
- Layout shifts are minimized during transitions

8. **Accessibility**
- Touch targets are increased on mobile (minimum 44px)
- Text remains readable with minimum 16px font size
- Color contrast is maintained across screen sizes
- Interactive elements have proper hover/focus states

This responsive design ensures a consistent and user-friendly experience across all devices while maintaining the blog's distinctive style and functionality.