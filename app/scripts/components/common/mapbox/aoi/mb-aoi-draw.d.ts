import { DefaultTheme } from 'styled-components';

export type Aoi = {
  drawing: boolean;
  selected: boolean;
  feature: {
    [key: string]: any;
  };
  actionOrigin: null | 'panel' | 'map';
};

type AoiChangeEvent = 'aoi.draw-finish' | 'aoi.selection' | 'aoi.update';

export type AoiChangeListener = (
  event: AoiChangeEvent,
  payload: {
    [key: string]: any;
  }
) => void;

export const aoiCursorStyles: FlattenInterpolation<ThemeProps>;

type useMbDrawParams = {
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  theme: DefaultTheme;
  onChange?: AoiChangeListener;
} & Partial<Pick<Aoi, 'feature' | 'drawing' | 'selected'>>;

export const useMbDraw: (params: useMbDrawParams) => void;
