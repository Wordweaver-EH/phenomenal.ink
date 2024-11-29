import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date().optional(),
    author: z.string().optional(),
    template: z.string().optional(),
    hero: z.object({
      tagline: z.string(),
      actions: z.array(
        z.object({
          text: z.string(),
          link: z.string(),
          icon: z.string().optional(),
          variant: z.string().optional()
        })
      )
    }).optional(),
    sidebar: z.object({
      label: z.string()
    }).optional()
  })
});

export const collections = {
  docs
}; 