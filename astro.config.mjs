import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    react(),
    mdx()
  ],
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [],
    rehypePlugins: [],
  },
  srcDir: './src',
  outDir: './dist',
  publicDir: './public',
  site: 'http://localhost:4321',
  base: '/',
  trailingSlash: 'always'
}); 