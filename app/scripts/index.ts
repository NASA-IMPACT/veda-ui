import DataCatalog from './components/common/catalog';

import Block from './components/common/blocks';
import Figure from './components/common/blocks/figure';
import { ContentBlockProse as Prose } from './styles/content-block';
import MDXImage, { Caption } from './components/common/blocks/images';
import { Chapter } from './components/common/blocks/scrollytelling/chapter';

import Chart from './components/common/chart/block';

import Table from './components/common/table';
import CompareImage from './components/common/blocks/images/compare';


import Embed from './components/common/blocks/embed';
import TProvider from './theme-provider';

import { LayoutRootContextProvider } from '$components/common/layout-root/context';
import { ReactQueryProvider } from '$context/react-query';

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
  TProvider,
  LayoutRootContextProvider,
  ReactQueryProvider
};
