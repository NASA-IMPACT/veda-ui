import { Feature, FeatureCollection, Polygon, Point } from 'geojson';

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
  selectedContext?: {
    features: Feature<Polygon>[];
    points: Feature<Point>[];
  };
  featureCollection: FeatureCollection<Polygon> | null;
  actionOrigin: null | 'panel' | 'map';
}

export type AoiChangeEvent =
  | 'aoi.draw-click'
  | 'aoi.trash-click'
  | 'aoi.select-click'
  | 'aoi.set'
  | 'aoi.clear'
  | 'aoi.draw-finish'
  | 'aoi.selection'
  | 'aoi.update';

export type AoiChangeListener = (
  event: AoiChangeEvent,
  payload?: Record<string, any>
) => void;

export interface AoiChangeListenerOverload {
  (
    action:
      | 'aoi.draw-click'
      | 'aoi.select-click'
      | 'aoi.trash-click'
      | 'aoi.clear',
    payload?: never
  ): void;
  (
    action: 'aoi.draw-finish' | 'aoi.update',
    payload: { feature: AoiFeature }
  ): void;
  (
    action: 'aoi.set',
    payload: { featureCollection: FeatureCollection<Polygon> }
  ): void;
  (
    action: 'aoi.selection',
    payload: { selected: boolean; context: AoiState['selectedContext'] }
  ): void;
  (action: 'aoi.delete', payload: { ids: string[] }): void;
}
