import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import astroExpressiveCode from 'astro-expressive-code';
import starlightBlog from 'starlight-blog';
import wikiLinkPlugin from 'remark-wiki-link';
import remarkSidenotes from './src/plugins/remark-sidenotes.js';
import rehypeExternalLinks from 'rehype-external-links';

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
      rehypePlugins: [
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
      ],
    }),
    starlight({
      plugins: [starlightBlog({
        rss: {
          title: 'Phenomenal Science',
          description: 'Scientific analysis and interpretation',
          customData: `<language>en</language>`,
          xmlns: {
            atom: true,
            dc: true,
            content: true
          }
        },
        tags: {
          path: 'tags'
        }
      })],
      title: 'Phenomenal Science',
      defaultLocale: 'en',
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3
      },
      favicon: '/favicon.svg',
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon.ico',
            sizes: '32x32',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        },
      ],
      components: {
        Head: './src/components/Head.astro',
        Header: './src/components/CustomHeader.astro',
        Sidebar: './src/components/CustomSidebar.astro',
        Footer: './src/components/EmptyFooter.astro'
      },
      customCss: [
        './src/styles/tufte.css',
        './src/styles/sidenote.css'
      ]
    })
  ],
  site: 'https://sci.phenomenal.ink',
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