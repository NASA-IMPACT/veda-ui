/* eslint-disable prettier/prettier */

declare module 'delta/thematics' {
  import { MDXModule } from 'mdx/types';

  /**
   * Base structure for each of the data types in delta/thematics.
   */
  interface DeltaDatum<T> {
    [key: string]: {
      /**
       * Contains all the variables in the content's front matter.
       */
      data: T;
      /**
       * Promise to return the MDX content. Setup this way to allow dynamic
       * module loading.
       */
      content: Promise<MDXModule>;
    };
  }

  /**
   * Data structure for the Thematics frontmatter.
   */
  interface ThematicData {
    id: string;
    name: string;
  }

  interface DatasetSourceParams {
    colormap_name: string;
    rescale: number[];
  }
  
  type DatasetLayerType = 'raster' | 'vector';
  
  export interface DatasetDatumFnResolverBag {
    [key: string]: any;
  }
  
  type Primitives = string | number | boolean | null | undefined;
  export type DatasetDatumFn<T> = (bag: DatasetDatumFnResolverBag) => T;
  export type DatasetDatumReturnType = Primitives | Date;
  
  interface DatasetLayerCommonProps {
    zoomExtent: number[];
    sourceParams: DatasetSourceParams;
  }
  
  interface DatasetLayerCommonCompareProps extends DatasetLayerCommonProps {
    datetime?: string | (DatasetDatumFn<DatasetDatumReturnType>);
  }
  
  export interface DatasetLayerCompareSTAC extends DatasetLayerCommonCompareProps {
    stacCol: string;
    type: DatasetLayerType;
  }
  
  export interface DatasetLayerCompareInternal extends DatasetLayerCommonCompareProps {
    datasetId: string;
    layerId: string;
  }
  
  export interface DatasetLayer extends DatasetLayerCommonProps {
    id: string;
    name: string;
    description: string;
    type: DatasetLayerType;
    compare: DatasetLayerCompareSTAC | DatasetLayerCompareInternal;
  }
  
  
  export interface DatasetLayerCompareNormalized extends DatasetLayerCommonCompareProps {
    id: string;
    type: DatasetLayerType;
  } 

  /**
   * Data structure for the Datasets frontmatter.
   */
  interface DatasetData {
    id: string;
    name: string;
    thematics: string[];
    description: string;
    layers: DatasetLayer[];
  }

  /**
   * Data structure for the Discoveries frontmatter.
   */
  interface DiscoveryData {
    id: string;
    name: string;
    thematics: string[];
  }

  /**
   * Named exports: datasets.
   * Object with all the delta datasets keyed by the dataset id.
   */
  export const datasets: DeltaDatum<DatasetData>;

  /**
   * Named exports: discoveries.
   * Object with all the delta discoveries keyed by the discovery id.
   */
  export const discoveries: DeltaDatum<DiscoveryData>;

  /**
   * Named exports: thematics.
   * Object with all the delta thematics keyed by the thematic id.
   */
  export const thematics: DeltaDatum<ThematicData>;

  interface DeltaThematicListItem extends ThematicData {
    /**
     * Datasets that are related to this thematic area.
     */
    datasets: [DatasetData];
    /**
     * Discoveries that are related to this thematic area.
     */
    discoveries: [DiscoveryData];
  }

  /**
   * The default export is a list of all the thematic areas with their
   * respective datasets and discoveries. It contains no MDX content, just the
   * frontmatter data.
   */
  declare const _default: DeltaThematicListItem[];
  export default _default;
}
