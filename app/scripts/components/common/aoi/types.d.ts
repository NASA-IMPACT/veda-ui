import { Feature, Polygon } from 'geojson';

export type AoiFeature = Feature<Polygon>;

export interface AoiBounds {
  ne: [number, number];
  sw: [number, number];
}

export interface AoiBoundsUnset {
  ne: [];
  sw: [];
}

export interface AoiState {
  drawing: boolean;
  selected: boolean;
  feature: AoiFeature | null;
  actionOrigin: null | 'panel' | 'map';
}

export type AoiChangeEvent =
  | 'aoi.draw-click'
  | 'aoi.set-feature'
  | 'aoi.clear'
  | 'aoi.draw-finish'
  | 'aoi.selection'
  | 'aoi.update';

export type AoiChangeListener = (
  event: AoiChangeEvent,
  payload?: {
    [key: string]: any;
  }
) => void;

export interface AoiChangeListenerOverload {
  (action: 'aoi.draw-click' | 'aoi.clear', payload?: never): void;
  (
    action: 'aoi.draw-finish' | 'aoi.set-feature' | 'aoi.update',
    payload: { feature: AoiFeature }
  ): void;
  (action: 'aoi.selection', payload: { selected: boolean }): void;
}
