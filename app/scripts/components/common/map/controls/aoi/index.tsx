import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';
import { useControl } from 'react-map-gl';
import { aoisFeaturesAtom } from './atoms';

type DrawControlProps = {
  onCreate?: (evt: { features: object[] }) => void;
  onUpdate?: (evt: { features: object[]; action: string }) => void;
  onDelete?: (evt: { features: object[] }) => void;
  onSelectionChange?: (evt: { selectedFeatures: object[] }) => void;
} & MapboxDraw.DrawOptions;

export default function DrawControl(props: DrawControlProps) {
  const control = useRef<MapboxDraw>();
  const aoisFeatures = useAtomValue(aoisFeaturesAtom);

  useControl<MapboxDraw>(
    () => {
      control.current = new MapboxDraw(props);
      return control.current;
    },
    ({ map }: { map: any }) => {
      map.on('draw.create', props.onCreate);
      map.on('draw.update', props.onUpdate);
      map.on('draw.delete', props.onDelete);
      map.on('draw.selectionchange', props.onSelectionChange);
      map.on('load', () => {
        control.current?.set({
          type: 'FeatureCollection',
          features: aoisFeatures
        });
      });
    },
    ({ map }: { map: any }) => {
      map.off('draw.create', props.onCreate);
      map.off('draw.update', props.onUpdate);
      map.off('draw.delete', props.onDelete);
      map.off('draw.selectionchange', props.onSelectionChange);
    },
    {
      position: 'top-left'
    }
  );

  return null;
}
