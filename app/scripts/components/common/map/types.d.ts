import { AnyLayer, AnySourceImpl } from "mapbox-gl";

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

export type MapId = 'main' | 'compared'

export interface StacFeature {
  bbox: [number, number, number, number];
}

export type OptionalBbox = number[] | undefined | null;