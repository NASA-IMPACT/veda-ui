import * as dateFns from 'date-fns';
import mapboxgl from 'mapbox-gl';
import { MDXModule } from 'mdx/types';

// ///////////////////////////////////////////////////////////////////////////
//  Datasets                                                                //
// ///////////////////////////////////////////////////////////////////////////
export type DatasetLayerType = 'raster' | 'vector' | 'zarr'| 'cmr';

//
// Dataset Layers
//
export type MbProjectionOptions = Exclude<
  mapboxgl.MapboxOptions['projection'],
  undefined
>;

export type ProjectionOptions = Pick<
  MbProjectionOptions,
  'parallels' | 'center'
> & {
  id: MbProjectionOptions['name'] | 'polarNorth' | 'polarSouth';
};

interface DatasetLayerCommonCompareProps {
  mapLabel?: string | DatasetDatumFn<DatasetDatumReturnType>;
}

interface DatasetLayerCommonProps extends DatasetLayerCommonCompareProps{
  zoomExtent?: number[];
  bounds?: number[];
  sourceParams?: Record<string, any>;
}

export type DatasetDatumFn<T> = (bag: DatasetDatumFnResolverBag) => T;
export type DatasetDatumReturnType = Primitives | Date;

export interface DatasetLayerCompareSTAC
  extends DatasetLayerCommonProps {
  stacCol: string;
  type: DatasetLayerType;
  name: string;
  description: string;
  legend?: LayerLegendCategorical | LayerLegendGradient;
}

export interface DatasetLayerCompareInternal
  extends DatasetLayerCommonProps {
  datasetId: string;
  layerId: string;
}

export enum TimeDensity {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}
export interface LayerInfo {
source: string;
spatialExtent: string;
temporalResolution: string;
unit: string;
}
export interface DatasetLayer extends DatasetLayerCommonProps {
  id: string;
  stacCol: string;
  media?: Media;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
  name: string;
  description: string;
  initialDatetime?: 'newest' | 'oldest' | string;
  projection?: ProjectionOptions;
  basemapId?: 'dark' | 'light' | 'satellite' | 'topo';
  type: DatasetLayerType;
  compare: DatasetLayerCompareSTAC | DatasetLayerCompareInternal | null;
  legend?: LayerLegendCategorical | LayerLegendGradient;
  analysis?: {
    metrics: string[];
    exclude: boolean;
    sourceParams?: Record<string, any>;
  };
  assetUrlReplacements?: {
    from: string;
    to: string;
  },
  time_density?: TimeDensity;
  info?: LayerInfo;
}
// A normalized compare layer is the result after the compare definition is
// resolved from DatasetLayerCompareSTAC or DatasetLayerCompareInternal. The
// difference with a "base" dataset layer is not having a name and
// description.
export interface DatasetLayerCompareBase
  extends DatasetLayerCommonProps {
  id: string;
  stacCol: string;
  type: DatasetLayerType;
}
export interface DatasetLayerCompareNormalized
  extends DatasetLayerCommonProps {
  id: string;
  name: string;
  description: string;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
  time_density?: 'day' | 'month' | 'year';
  stacCol: string;
  type: DatasetLayerType;
  legend?: LayerLegendCategorical | LayerLegendGradient;
}

// export type DatasetLayerCompareNormalized = DatasetLayerCompareNoLegend | DatasetLayerCompareWLegend

// TODO: Complete once known
export interface DatasetDatumFnResolverBag {
  /* The date selected by the user */
  datetime?: Date;

  /*
    The date to use for the comparison if the user defined one.
  */
  compareDatetime?: Date;

  /* functions from date-fns package */
  dateFns: typeof dateFns;
}

interface LayerLegendUnit {
  label: string;
}


export interface LayerLegendGradient {
  type: 'gradient';
  unit?: LayerLegendUnit;
  min: string | number;
  max: string | number;
  stops: string[];
}

interface CategoricalStop {
  color: string;
  label: string;
}

export interface LayerLegendCategorical {
  type: 'categorical';
  unit?: LayerLegendUnit;
  stops: CategoricalStop[];
}

/**
 * Related Contents
 * editors can curate contents per each category with their ids
 */
export interface RelatedContentData {
  type: 'dataset' | 'story';
  id: string;
  thematic?: string;
}
/**
 * Link  Content
 * When the story is a link out to the external/internal content
 */

export interface LinkContentData {
  url: string;
}

export interface DatasetUsage {
  url: string;
  label: string;
  title: string;
}
/**
 * Data structure for the Datasets frontmatter.
 */
export interface DatasetData {
  featured?: boolean;
  sourceExclusive?: string;
  id: string;
  name: string;
  infoDescription?: string;
  taxonomy: Taxonomy[];
  description: string;
  usage?: DatasetUsage[];
  media?: Media;
  layers: DatasetLayer[];
  related?: RelatedContentData[];
  disableExplore?: boolean;
}

// ///////////////////////////////////////////////////////////////////////////
//  Stories                                                             //
// ///////////////////////////////////////////////////////////////////////////

/**
 * Data structure for the Stories frontmatter.
 */
export interface StoryData {
  featured?: boolean;
  id: string;
  name: string;
  description: string;
  pubDate: string;
  media?: Media;
  taxonomy: Taxonomy[];
  related?: RelatedContentData[];
  asLink?: LinkContentData;
}

// ///////////////////////////////////////////////////////////////////////////
//  General interfaces and types                                            //
// ///////////////////////////////////////////////////////////////////////////
type Primitives = string | number | boolean | null | undefined;

export interface Media {
  src: string;
  alt: string;
  author?: {
    name: string;
    url: string;
  };
}

/**
 * Base structure for each of the data types in veda.
 */
export type VedaData<T> = Record<string, VedaDatum<T> | undefined>;

export interface VedaDatum<T> {
  /**
   * Contains all the variables in the content's front matter.
   */
  data: T;
  /**
   * Promise to return the MDX content. Setup this way to allow dynamic
   * module loading.
   */
  content: () => Promise<MDXModule>;
}

export interface Taxonomy {
  name: string;
  values: TaxonomyItem[];
}

export interface TaxonomyItem {
  id: string;
  name: string;
}

export type PageOverrides =
  | 'developmentContent'
  | 'aboutContent'
  | 'homeContent'
  | 'storiesHubContent'
  | 'storiesHubHero'
  | 'sandbox-override'
  | 'pageFooter'
  | 'headerBrand'
  | 'homeHero';

export interface ParentDatset {
  id: string;
  name: string;
}
export interface EnhancedDatasetLayer extends DatasetLayer {
  id: string;
  parentDataset: ParentDatset;
}

export interface DatasetDataWithEnhancedLayers extends DatasetData {
  layers: EnhancedDatasetLayer[];
}
