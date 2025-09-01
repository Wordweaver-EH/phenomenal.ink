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
    // Return unchanged if no special handling needed
    return [node];
  });
} 