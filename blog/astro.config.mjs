import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import astroExpressiveCode from 'astro-expressive-code';

export default defineConfig({
  integrations: [
    react(),
    astroExpressiveCode(),
    mdx({
      smartypants: true,
      gfm: true,
    }),
    starlight({
      title: 'Phenomenal Blog',
      defaultLocale: 'en',
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3
      },
      social: {
        github: 'https://github.com/yourusername'
      },
      sidebar: [
        {
          label: 'Blog Posts',
          autogenerate: { directory: '.' }
        },
        {
          label: 'Current Post',
          collapsed: false,
          items: [
            { label: 'Introduction', link: '/ai-alignment#introduction' },
            { label: 'The Specification Problem', link: '/ai-alignment#the-specification-problem' },
            { label: 'Current Approaches', link: '/ai-alignment#current-approaches' },
            { label: 'Looking Forward', link: '/ai-alignment#looking-forward' }
          ]
        }
      ],
      customCss: [
        './src/styles/tufte.css',
        './src/styles/sidenote.css'
      ],
      components: {
        Head: './src/components/Head.astro',
        Header: './src/components/CustomHeader.astro'
      }
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