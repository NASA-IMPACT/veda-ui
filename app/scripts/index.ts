import DataCatalog from './components/common/catalog';

import Block from './components/common/blocks';
import Image from './components/common/blocks/images';
import MapBlock from './components/common/blocks/block-map';
import Figure from './components/common/blocks/figure';
import { ContentBlockProse as Prose } from './styles/content-block';
import MDXImage, { Caption } from './components/common/blocks/images';
import { Chapter } from './components/common/blocks/scrollytelling/chapter';
import Chart from './components/common/chart/block';
import Table from './components/common/table';
import CompareImage from './components/common/blocks/images/compare';
import ReactQueryProvider from './context/react-query';
import Embed from './components/common/blocks/embed';
import DevseedUiThemeProvider from './theme-provider';
import { PageMainContent } from '$styles/page';
import PageHero from '$components/common/page-hero';

export {
  DataCatalog,
  Block,
  Figure,
  Prose,
  CompareImage,
  MDXImage,
  Caption,
  Chapter,
  Chart,
  Table,
  Embed,
  MapBlock,
  Image,
  DevseedUiThemeProvider,
  PageMainContent,
  PageHero,
  ReactQueryProvider,
};
