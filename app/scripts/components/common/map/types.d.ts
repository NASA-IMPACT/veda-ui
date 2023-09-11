import { AnyLayer, AnySourceImpl } from "mapbox-gl";

export type ExtendedLayer = AnyLayer & {
  metadata?: {
    layerOrderPosition?: LayerOrderPosition;
    [key: string]: any;
  };
};
export interface GeneratorParams {
  generatorId: string;
  layers: ExtendedLayer[];
  sources: Record<string, AnySourceImpl>;
  metadata?: Record<string, unknown>;
}

export type LayerOrderPosition =
  | 'basemap-background'
  | 'raster'
  | 'markers'
  | 'vector'
  | 'basemap-foreground';

export type MapId = 'main' | 'compared'