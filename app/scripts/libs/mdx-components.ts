import BlockDefault from '$components/common/blocks';
import ImageDefault from '$components/common/blocks/images';
import { MapBlock } from '$components/common/blocks/block-map';
import { ScrollytellingBlock } from '$components/common/blocks/scrollytelling';
import FigureDefault from '$components/common/blocks/figure';
import { ContentBlockProse } from '$styles/content-block';
import MDXImageDefault, { Caption } from '$components/common/blocks/images';
import { Chapter } from '$components/common/blocks/scrollytelling/chapter';
import ChartDefault from '$components/common/chart/block';
import TableDefault from '$components/common/table';
import CompareImageDefault from '$components/common/blocks/images/compare';
import EmbedDefault from '$components/common/blocks/embed';

const Block = BlockDefault;
const Image = ImageDefault;
const Figure = FigureDefault;
const Prose = ContentBlockProse;
const MDXImage = MDXImageDefault;
const Chart = ChartDefault;
const Table = TableDefault;
const CompareImage = CompareImageDefault;
const Embed = EmbedDefault;

export {
  Block,
  Image,
  MapBlock,
  ScrollytellingBlock,
  Figure,
  Prose,
  MDXImage,
  Caption,
  Chapter,
  Chart,
  Table,
  CompareImage,
  Embed
};
