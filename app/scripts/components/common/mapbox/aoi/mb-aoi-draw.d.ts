import { MutableRefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import { AoiChangeListener, AoiState } from '$components/common/aoi/types';

export const aoiCursorStyles: FlattenInterpolation<ThemeProps<DefaultTheme>>;

type useMbDrawParams = {
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  theme: DefaultTheme;
  onChange?: AoiChangeListener;
} & Partial<Pick<AoiState, 'fc' | 'drawing' | 'selected'>>;

export const useMbDraw: (params: useMbDrawParams) => void;
