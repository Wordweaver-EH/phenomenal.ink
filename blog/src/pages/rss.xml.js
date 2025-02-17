import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

// Function to clean MDX content for RSS
function cleanMDXContent(content) {
  // Remove import statements
  content = content.replace(/^import.*$/gm, '');
  
  // Convert sidenotes to parenthetical notes
  content = content.replace(/<Sidenote>(.*?)<\/Sidenote>/g, ' ($1)');
  
  // Remove any remaining JSX/component tags
  content = content.replace(/<[a-zA-Z].*?\/>/g, '');
  content = content.replace(/<[a-zA-Z].*?>.*?<\/[a-zA-Z].*?>/g, '');

  return content;
}

export async function GET(context) {
  const docs = await getCollection('docs', ({ id }) => {
    return !id.includes('/') && id !== 'index.mdx' && id.endsWith('.mdx');
  });

  // Sort by date
  const sortedDocs = docs.sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date) : new Date(0);
    const dateB = b.data.date ? new Date(b.data.date) : new Date(0);
    return dateB.valueOf() - dateA.valueOf();
  });

  return rss({
    title: 'Phenomenal Blog',
    description: 'Phenomenal Blogging',
    site: context.site,
    items: sortedDocs.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${post.slug}/`,
      content: sanitizeHtml(parser.render(cleanMDXContent(post.body)), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'title']
        }
      }),
    })),
    customData: `<language>en</language>`,
  });
} 