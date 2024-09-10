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
import CatalogView from './components/common/catalog';
import { PageMainContent } from '$styles/page';
import PageHero from '$components/common/page-hero';
import StoriesHubContent from '$components/stories/hub/hub-content';
import { useFiltersWithQS } from '$components/common/catalog/controls/hooks/use-filters-with-query';
import PageHeader from '$components/common/page-header';
import LogoContainer from '$components/common/page-header/logo-container';
import type { NavItem, InternalNavLink, NavItemType } from '$components/common/page-header/types';

import ExplorationAndAnalysis from '$components/exploration';
import { timelineDatasetsAtom } from '$components/exploration/atoms/datasets';

export {
  // COMPONENTS
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
  CatalogView,
  DevseedUiThemeProvider,
  PageMainContent,
  PageHero,
  PageHeader,
  ReactQueryProvider,
  StoriesHubContent,
  LogoContainer,
  ExplorationAndAnalysis,

  // HOOKS and utility functions
  useFiltersWithQS,

  // TYPES
  NavItem,
  NavItemType,
  InternalNavLink,

  // STATE
  timelineDatasetsAtom
};
