export { default as Block } from '$components/common/blocks';
export { default as MapBlock } from '$components/common/blocks/block-map';
export { default as Chart } from '$components/common/chart/block';
export { default as Table } from '$components/common/table';
export { default as Embed } from '$components/common/blocks/embed';
import Image from '$components/common/blocks/images';
import CompareImage from '$components/common/blocks/images/compare';
import Figure from '$components/common/blocks/figure';
import MDXImage, { Caption } from '$components/common/blocks/images';
import { ScrollytellingBlock } from '$components/common/blocks/scrollytelling';
import { ContentBlockProse as Prose } from '$styles/content-block';
import { Chapter } from '$components/common/blocks/scrollytelling/chapter';

export {
  Image,
  ScrollytellingBlock,
  Figure,
  Prose,
  MDXImage,
  Caption,
  Chapter,
  CompareImage
};
