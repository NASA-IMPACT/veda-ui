import { DiscoveryData } from "veda";

export interface DataStoryBlock {
  id: string;
  tag: 'Block' | 'ScrollyTellingBlock';
  blockType?: 'wide' | 'full'; 
  mdx: string;
}

export interface DataStory {
  frontmatter: DiscoveryData;
  blocks: DataStoryBlock[];
  currentBlockId?: string;
}