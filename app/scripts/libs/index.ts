import { PageHero } from '$components/common/page-hero';
import { GlobalStyles } from '$styles/legacy-global-styles';

const LegacyGlobalStyles = GlobalStyles;
// Include only the custom stylings for the VEDA components into the library build
import '$styles/veda-components.scss';

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

// Files with only named exports
export * from './types';

export { NavItemType } from './enum';
export {
  datasetLayersAtom,
  externalDatasetsAtom,
  timelineDatasetsAtom
} from './atoms';

export {
  DevseedUiThemeProvider,
  VedaUIProvider,
  ReactQueryProvider,
  useTimelineDatasetAtom,
  useFiltersWithQS,
  useAnalysisDataRequest,
  useAnalysisController
} from './hooks';

export {
  Block,
  Image,
  MapBlock,
  MultilayerMapBlock,
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
} from './mdx-components';

export {
  CatalogContent,
  ExplorationAndAnalysis,
  StoriesHubContent,
  DatasetSelectorModal
} from './page-components';

export {
  PageHeader,
  PageFooter,
  DefaultCard,
  FlagCard,
  Widget
} from './uswds-components';

export {
  ColormapSection as VEDALayerColormap,
  LayerMenuOptions as VEDALayerMenuOptions,
  DatasetLayerCard as VEDADatasetLayerCard,
  TimelineSingle as VEDADatasetTimeline,
  VEDABasemap,
  VEDAMap,
  VEDAMapControls
} from './components';

export { PageHero, LegacyGlobalStyles };
