import MapboxDraw from '@mapbox/mapbox-gl-draw';
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';
import { useTheme } from 'styled-components';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';
import { useControl } from 'react-map-gl';
import useAois from '../hooks/use-aois';
import { aoisFeaturesAtom } from './atoms';
import { computeDrawStyles } from './style';

type DrawControlProps = MapboxDraw.DrawOptions;

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
  const control = useRef<MapboxDraw>();
  const aoisFeatures = useAtomValue(aoisFeaturesAtom);
  const { onUpdate, onDelete, onSelectionChange, onDrawModeChange } = useAois();

  useControl<MapboxDraw>(
    () => {
      control.current = new MapboxDraw({
        displayControlsDefault: false,
        styles: computeDrawStyles(theme),
        modes: {
          ...MapboxDraw.modes,
          static_mode: StaticMode,
          simple_select: customSimpleSelect,
          direct_select: customDirectSelect
        },
        ...props
      });
      return control.current;
    },
    ({ map }: { map: any }) => {
      map._drawControl = control.current;
      map.on('draw.create', onUpdate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);
      map.on('draw.selectionchange', onSelectionChange);
      map.on('draw.modechange', onDrawModeChange);
      map.on('load', () => {
        control.current?.set({
          type: 'FeatureCollection',
          features: aoisFeatures
        });
      });
    },
    ({ map }: { map: any }) => {
      map.off('draw.create', onUpdate);
      map.off('draw.update', onUpdate);
      map.off('draw.delete', onDelete);
      map.off('draw.selectionchange', onSelectionChange);
      map.off('draw.modechange', onDrawModeChange);
    },
    {
      position: 'top-left'
    }
  );

  return null;
}
