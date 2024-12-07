import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

// Extend the docs schema with blog schema
const docs = defineCollection({
  schema: docsSchema({
    extend: blogSchema
  })
});

export const collections = {
  docs
}; 