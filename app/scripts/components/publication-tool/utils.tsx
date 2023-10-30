import { dump, load } from 'js-yaml';
import { StoryData } from 'veda';
import { EditorStory, EditorStoryBlock } from './types';

export function toMDXBlock(block: EditorStoryBlock): string {
  const type = block.blockType ? ` type=${block.blockType}` : '';
  return `<Block${type}>
  ${block.mdx}
</Block>`;
}

export function toMDXDocument(dataStory: EditorStory): string {
  const frontmatter = dump(dataStory.frontmatter);
  const doc = `---
${frontmatter}
---

${dataStory.blocks.map((block) => toMDXBlock(block)).join('\n\n')}
`;

  return doc;
}

export function toEditorDataStory(mdxDocument: string): EditorStory {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)/;

  const matches = mdxDocument.match(frontmatterRegex);

  if (!matches) {
    throw new Error('Frontmatter not found in the Markdown document.');
  }

  const rawFrontmatter = matches[1];
  const rawContent = matches[2];

  const frontmatter = load(rawFrontmatter) as StoryData;

  const blockRegex = /<Block\s*(?:type=['"](.+?)['"])?\s*>([\s\S]*?)<\/Block>/g;
  let blocks: EditorStoryBlock[] = [];
  let match;
  let id = 0;
  while ((match = blockRegex.exec(rawContent)) !== null) {
    const blockType = match[1];
    const mdx = match[2].trim();
    blocks = [...blocks, { tag: 'Block', blockType, mdx, id: `${id++}` }];
  }

  return {
    frontmatter,
    blocks
  };
}