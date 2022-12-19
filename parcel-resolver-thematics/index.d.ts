declare module 'veda/thematics' {
  import * as dateFns from 'date-fns';
  import mapboxgl from 'mapbox-gl';
  import { MDXModule } from 'mdx/types';

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
    stacCol: string;
    type: DatasetLayerType;
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
    label: string
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
    type: 'dataset' | 'discovery' | 'thematic';
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
    featuredOn?: string[];
    id: string;
    name: string;
    thematics: string[];
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
    featuredOn?: string[];
    id: string;
    name: string;
    description: string;
    pubDate: string;
    media?: Media;
    thematics: string[];
    related?: RelatedContentData[];
  }

  // ///////////////////////////////////////////////////////////////////////////
  //  Thematic areas                                                          //
  // ///////////////////////////////////////////////////////////////////////////

  /**
   * Data structure for the Thematics frontmatter.
   */
  export interface ThematicData {
    id: string;
    name: string;
    description: string;
    media?: Media;
    related?: RelatedContentData[];
    about?: {
      title: string
      description: string
    }
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
   * Base structure for each of the data types in veda/thematics.
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
   * Named exports: thematics.
   * Object with all the veda thematics keyed by the thematic id.
   */
  export const thematics: VedaData<ThematicData>;

  interface VedaThematicListItem extends ThematicData {
    /**
     * Datasets that are related to this thematic area.
     */
    datasets: DatasetData[];
    /**
     * Discoveries that are related to this thematic area.
     */
    discoveries: DiscoveryData[];
  }

  /**
   * The default export is a list of all the thematic areas with their
   * respective datasets and discoveries. It contains no MDX content, just the
   * frontmatter data.
   */
  const _default: VedaThematicListItem[];
  export default _default;

  export type PageOverrides = 'aboutContent' | 'sandbox-override';
  /**
   * Configuration export for specific overrides.
   */
  export const getOverride: (key: PageOverrides) => VedaDatum<any> | undefined;
}
