import DataCatalog from './components/common/catalog';

import Block from './components/common/blocks';
import ContentBlockFigure from './components/common/blocks/figure';
import { ContentBlockProse } from './styles/content-block';
import Image, { Caption } from './components/common/blocks/images';
import { Chapter } from './components/common/blocks/scrollytelling/chapter';

import BlockChart from './components/common/chart/block'

import Table from './components/common/table';
import CompareImage from './components/common/blocks/images/compare';


import Embed from './components/common/blocks/embed';


export default {
  DataCatalog,
  Block,
  Figure: ContentBlockFigure,
  Prose: ContentBlockProse,
  CompareImage,
  MDXImage: Image,
  Caption: Caption,
  Chapter,
  Chart: BlockChart,
  Table,
  Embed
};
