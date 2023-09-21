import { AnyLayer, AnySourceImpl } from "mapbox-gl";

export type ExtendedLayer = AnyLayer & {
  metadata?: {
    layerOrderPosition?: LayerOrderPosition;
    [key: string]: any;
  };
};

export interface BaseGeneratorParams {
  hidden?: boolean;
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