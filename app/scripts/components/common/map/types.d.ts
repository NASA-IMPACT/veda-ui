import { Feature, Polygon } from 'geojson';
import { AnyLayer, AnySourceImpl } from 'mapbox-gl';
import { ActionStatus } from '$utils/status';

export interface ExtendedMetadata {
  layerOrderPosition?: LayerOrderPosition;
  [key: string]: any;
}

export type ExtendedLayer = AnyLayer & {
  metadata?: ExtendedMetadata;
};

export interface BaseGeneratorParams {
  hidden?: boolean;
  generatorOrder?: number;
  opacity?: number;
}
export interface GeneratorStyleParams {
  generatorId: string;
  layers: ExtendedLayer[];
  sources: Record<string, AnySourceImpl>;
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
  date: Date;
  sourceParams?: Record<string, any>;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
}

export interface StacTimeseriesProps extends BaseTimeseriesProps {
  stacCol: string;
  stacApiEndpoint?: string; // default will be process.env.API_STAC_ENDPOINT, the VEDA STAC endpoint
}

export interface RasterTimeseriesProps extends StacTimeseriesProps {
  bounds?: number[];
  isPositionSet?: boolean;
}

