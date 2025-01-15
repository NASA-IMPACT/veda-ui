import Block from './components/common/blocks';
import Image from './components/common/blocks/images';
import MapBlock from './components/common/blocks/block-map';
import { ScrollytellingBlock } from './components/common/blocks/scrollytelling';
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
import PageFooter from '$components/common/page-footer';
import type {
  NavItem,
  NavItemType
} from '$components/common/page-header/types';

import type { InternalNavLink } from '$components/common/types';
import type { DatasetData, StoryData, VedaData } from '$types/veda';


import ExplorationAndAnalysis from '$components/exploration';
import useTimelineDatasetAtom from '$components/exploration/hooks/use-timeline-dataset-atom';
import { timelineDatasetsAtom } from '$components/exploration/atoms/datasets';
import { DatasetSelectorModal } from '$components/exploration/components/dataset-selector-modal';
import { VedaUIProvider } from '$context/veda-ui-provider';
import {
  datasetLayersAtom,
  externalDatasetsAtom
} from '$components/exploration/atoms/datasetLayers';

// Include only the custom stylings for the VEDA components into the library build
import './styles/veda-components.scss';

// Adding .last property to array
/* eslint-disable-next-line fp/no-mutating-methods */
Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  configurable: true,
  get: function () {
    return this[this.length - 1];
  },
  set: undefined
});

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
  ScrollytellingBlock,
  Table,
  Embed,
  MapBlock,
  Image,
  CatalogView,
  DevseedUiThemeProvider,
  PageMainContent,
  PageHero,
  PageHeader,
  PageFooter,
  ReactQueryProvider,
  VedaUIProvider,
  StoriesHubContent,
  ExplorationAndAnalysis,
  DatasetSelectorModal,

  // HOOKS
  useTimelineDatasetAtom,
  useFiltersWithQS,

  // TYPES
  NavItem,
  NavItemType,
  InternalNavLink,
  DatasetData,
  StoryData,
  VedaData,

  // STATE
  timelineDatasetsAtom,
  externalDatasetsAtom,
  datasetLayersAtom
};
