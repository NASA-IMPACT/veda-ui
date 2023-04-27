import { MutableRefObject } from 'react';
import { Map as MapboxMap } from 'mapbox-gl';
import {
  DefaultTheme,
  FlattenInterpolation,
  ThemeProps
} from 'styled-components';
import { AoiChangeListener, AoiState } from '$components/common/aoi/types';

export const aoiCursorStyles: FlattenInterpolation<ThemeProps<DefaultTheme>>;

type useMbDrawParams = {
  mapRef: MutableRefObject<MapboxMap | null>;
  theme: DefaultTheme;
  onChange?: AoiChangeListener;
} & Partial<Pick<AoiState, 'featureCollection' | 'drawing' | 'selectedContext'>>;

export const useMbDraw: (params: useMbDrawParams) => void;
