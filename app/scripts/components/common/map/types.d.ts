import { Feature, Polygon } from 'geojson';
import { LayerSpecification, SourceSpecification } from 'mapbox-gl';
import { ActionStatus } from '$utils/status';

export interface ExtendedMetadata {
  layerOrderPosition?: LayerOrderPosition;
  generatorId: string;
  [key: string]: any;
}

export type ExtendedLayer = LayerSpecification & {
  metadata?: ExtendedMetadata | unknown;
};

export interface BaseGeneratorParams {
  hidden?: boolean;
  generatorOrder?: number;
  opacity?: number;
}
export interface GeneratorStyleParams {
  generatorId: string;
  layers: ExtendedLayer[];
  sources: Record<string, SourceSpecification>;
  metadata?: Record<string, unknown>;
  params?: BaseGeneratorParams;
}

export type LayerOrderPosition =
  | 'basemap-background'
  | 'raster'
  | 'markers'
  | 'vector'
  | 'basemap-foreground';

export type MapId = 'main' | 'compared';

export interface StacFeature {
  bbox: [number, number, number, number];
}

export type OptionalBbox = number[] | undefined | null;

export type AoIFeature = Feature<Polygon> & {
  selected: boolean;
  id: string;
};

export interface BaseTimeseriesProps extends BaseGeneratorParams {
  id: string;
  stacCol: string;
  date: Date;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  colorMap?: string;
  reScale?: { min: number; max: number };
  envApiStacEndpoint: string;
  envApiRasterEndpoint: string;
}

// export interface ZarrTimeseriesProps extends BaseTimeseriesProps {
//   // No additional properties, using BaseTimeseriesProps as is
// }

export interface RasterTimeseriesProps extends BaseTimeseriesProps {
  bounds?: number[];
  isPositionSet?: boolean;
  envApiStacEndpoint: string;
}

interface AssetUrlReplacement {
  from: string;
  to: string;
}

export interface CMRTimeseriesProps extends BaseTimeseriesProps {
  assetUrlReplacements?: AssetUrlReplacement;
}
