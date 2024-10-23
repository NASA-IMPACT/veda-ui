import MapboxDraw from '@mapbox/mapbox-gl-draw';
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
import { useTheme } from 'styled-components';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';
import { useControl } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import useAois from '../hooks/use-aois';
import { aoisFeaturesAtom } from './atoms';
import { computeDrawStyles } from './style';

type DrawControlProps = MapboxDraw.DrawOptions;

interface ExtendedMapRef extends MapRef {
  _drawControl?: MapboxDraw;
}

export const STATIC_MODE = 'static_mode';
export const SIMPLE_SELECT = 'simple_select';
export const DIRECT_SELECT = 'direct_select';
export const DRAW_POLYGON = 'draw_polygon';

// Overriding the dragMove and dragFeature methods of the
// 'simple_select' and the 'direct_select' modes to avoid
// accidentally dragging the selected or hand-drawn AOIs
const customSimpleSelect = {
  ...MapboxDraw.modes.simple_select,
  dragMove() { return; }
};

const customDirectSelect = {
  ...MapboxDraw.modes.direct_select,
  dragFeature() { return; },
};

export default function DrawControl(props: DrawControlProps) {
  const theme = useTheme();
  const aoisFeatures = useAtomValue(aoisFeaturesAtom);
  const { onUpdate, onDelete, onSelectionChange, onDrawModeChange } = useAois();
  const mapRef = useRef<ExtendedMapRef | null>(null);

  const drawControl = useControl<MapboxDraw>(
    () => {
      const control = new MapboxDraw({
        displayControlsDefault: false,
        styles: computeDrawStyles(theme),
        modes: {
          ...MapboxDraw.modes,
          [STATIC_MODE]: StaticMode,
          [SIMPLE_SELECT]: customSimpleSelect,
          [DIRECT_SELECT]: customDirectSelect
        },
        ...props
      });
      return control;
    },
    ({ map }) => {
      mapRef.current = map as ExtendedMapRef;
      const extendedMap = map as ExtendedMapRef;
      // We're making the controls available on the map instance for later use throughout
      // the app (e.g in the CustomAoIControl)
      extendedMap._drawControl = drawControl;
      map.on('draw.create', onUpdate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);
      map.on('draw.selectionchange', onSelectionChange);
      map.on('draw.modechange', onDrawModeChange);
      map.on('load', () => {
        drawControl.set({
          type: 'FeatureCollection',
          features: aoisFeatures
        });
      });
    },
    ({ map }) => {
      map.off('draw.create', onUpdate);
      map.off('draw.update', onUpdate);
      map.off('draw.delete', onDelete);
      map.off('draw.selectionchange', onSelectionChange);
      map.off('draw.modechange', onDrawModeChange);
      mapRef.current = null;
    },
    {
      position: 'top-left'
    }
  );

  return null;
}