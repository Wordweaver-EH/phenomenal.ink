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