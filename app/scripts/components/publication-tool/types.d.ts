import { StoryData } from "veda";

export interface EditorStoryBlock {
  id: string;
  tag: 'Block' | 'ScrollyTellingBlock';
  blockType?: 'wide' | 'full'; 
  mdx: string;
}

export interface EditorStory {
  frontmatter: StoryData;
  blocks: EditorStoryBlock[];
  currentBlockId?: string;
}