import { DiscoveryData } from "veda";

export interface DataStoryBlock {
  tag: 'Block' | 'ScrollyTellingBlock';
  blockType?: 'wide' | 'full'; 
  mdx: string;
}

export interface DataStory {
  frontmatter: DiscoveryData;
  blocks: DataStoryBlock[];
}