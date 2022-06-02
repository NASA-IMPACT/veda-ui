export interface RectPolygon {
  type: 'Polygon';
  coordinates: [
    [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
      [number, number]
    ]
  ];
}

export interface AoiFeature {
  type: 'Feature';
  id?: string;
  properties?: {
    [key: string]: any;
  };
  geometry: RectPolygon;
}

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

export type AoiChangeEvent = 'aoi.draw-click' | 'aoi.set-feature' | 'aoi.clear' | 'aoi.draw-finish' | 'aoi.selection' | 'aoi.update'

export type AoiChangeListener = (
  event: AoiChangeEvent,
  payload?: {
    [key: string]: any;
  }
) => void;

export type AoiChangeListenerOverload = {
  (action: 'aoi.draw-click', payload?: never): void;
  (action: 'aoi.set-feature', payload: { feature: AoiFeature }): void;
  (action: 'aoi.clear', payload?: never): void;
  (action: 'aoi.draw-finish', payload: { feature: AoiFeature }): void;
  (action: 'aoi.selection', payload: { selected: boolean }): void;
  (action: 'aoi.update', payload: { feature: AoiFeature }): void;
};