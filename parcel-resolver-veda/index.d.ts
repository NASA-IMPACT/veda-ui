declare module 'veda' {
  import * as dateFns from 'date-fns';
  import mapboxgl from 'mapbox-gl';
  import { MDXModule } from 'mdx/types';
  import { DefaultTheme } from 'styled-components';

  // ///////////////////////////////////////////////////////////////////////////
  //  Datasets                                                                //
  // ///////////////////////////////////////////////////////////////////////////
  type DatasetLayerType = 'raster' | 'vector';

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

  interface DatasetLayerCommonProps {
    zoomExtent?: number[];
    sourceParams?: Record<string, any>;
  }

  export type DatasetDatumFn<T> = (bag: DatasetDatumFnResolverBag) => T;
  export type DatasetDatumReturnType = Primitives | Date;
  interface DatasetLayerCommonCompareProps extends DatasetLayerCommonProps {
    mapLabel?: string | DatasetDatumFn<DatasetDatumReturnType>;
  }

  export interface DatasetLayerCompareSTAC
    extends DatasetLayerCommonCompareProps {
    stacCol: string;
    type: DatasetLayerType;
  }

  export interface DatasetLayerCompareInternal
    extends DatasetLayerCommonCompareProps {
    datasetId: string;
    layerId: string;
  }

  export interface DatasetLayer extends DatasetLayerCommonProps {
    id: string;
    stacCol: string;
    name: string;
    description: string;
    initialDatetime?: 'newest' | 'oldest' | string;
    projection?: ProjectionOptions;
    type: DatasetLayerType;
    compare: DatasetLayerCompareSTAC | DatasetLayerCompareInternal | null;
    legend?: LayerLegendCategorical | LayerLegendGradient;
  }

  // A normalized compare layer is the result after the compare definition is
  // resolved from DatasetLayerCompareSTAC or DatasetLayerCompareInternal. The
  // difference with a "base" dataset layer is not having a name and
  // description.
  export interface DatasetLayerCompareNormalized
    extends DatasetLayerCommonCompareProps {
    id: string;
    name: string;
    description: string;
    stacCol: string;
    type: DatasetLayerType;
    legend?: LayerLegendCategorical | LayerLegendGradient;
  }

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
    type: 'dataset' | 'discovery';
    id: string;
    thematic?: string;
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
    id: string;
    name: string;
    thematics: TaxonomyItem[];
    sources: TaxonomyItem[];
    description: string;
    usage?: DatasetUsage[];
    media?: Media;
    layers: DatasetLayer[];
    related?: RelatedContentData[];
  }

  // ///////////////////////////////////////////////////////////////////////////
  //  Discoveries                                                             //
  // ///////////////////////////////////////////////////////////////////////////

  /**
   * Data structure for the Discoveries frontmatter.
   */
  export interface DiscoveryData {
    featured?: boolean;
    id: string;
    name: string;
    description: string;
    pubDate: string;
    media?: Media;
    thematics: TaxonomyItem[];
    sources: TaxonomyItem[];
    related?: RelatedContentData[];
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
  type VedaData<T> = Record<string, VedaDatum<T> | undefined>;

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

  interface TaxonomyItem {
    id: string;
    name: string;
  }

  /**
   * Named exports: datasets.
   * Object with all the veda datasets keyed by the dataset id.
   */
  export const datasets: VedaData<DatasetData>;

  /**
   * Named exports: discoveries.
   * Object with all the veda discoveries keyed by the discovery id.
   */
  export const discoveries: VedaData<DiscoveryData>;

  /**
   * Named exports: taxonomies.
   * Object with all the veda taxonomies keyed by the taxonomy id.
   */
  export const taxonomies: {
    sources: TaxonomyItem[];
    thematics: TaxonomyItem[];
  };

  export type PageOverrides =
    | 'aboutContent'
    | 'homeContent'
    | 'sandbox-override'
    | 'pageFooter'
    | 'headerBrand';
  /**
   * Configuration export for specific overrides.
   */
  export const getOverride: (key: PageOverrides) => VedaDatum<any> | undefined;

  export const theme: DefaultTheme | null;
}
