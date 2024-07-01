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

export enum STATUS_KEY {
  Global = 'Global',
  Layer = 'Layer',
  StacSearch = 'StacSearch'
}

export interface Statuses {
  [STATUS_KEY.Global]: ActionStatus;
  [STATUS_KEY.Layer]: ActionStatus;
  [STATUS_KEY.StacSearch]: ActionStatus;
}

export interface StatusData {
  status: ActionStatus;
  context?: string;
  id?: string;
}

export interface AssetUrlReplacement {
  from: string;
  to: string;
}

export interface ZarrResponseData {
  assets: {
    zarr: {
      href: string
    }
  },
}

export interface CMRResponseData {
  features: {
    assets: {
      data: {
        href: string
      }
    }
  }[]
}

export interface STACforCMRResponseData {
  collection_concept_id: string;
  renders: Record<string, any>;
}
