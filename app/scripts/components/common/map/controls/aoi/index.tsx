import React, { useEffect } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { createGlobalStyle } from 'styled-components';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';
import { useControl } from 'react-map-gl';
import { Feature, Polygon } from 'geojson';
import useAois from '../hooks/use-aois';
import { aoisFeaturesAtom } from './atoms';
import { encodeAois } from '$utils/polygon-url';

type DrawControlProps = {
  customFeatures: Feature<Polygon>[];
} & MapboxDraw.DrawOptions;

const Css = createGlobalStyle`
.mapbox-gl-draw_trash {
  opacity: .5;
  pointer-events: none !important;
}
`;

export default function DrawControl(props: DrawControlProps) {
  const control = useRef<MapboxDraw>();
  const aoisFeatures = useAtomValue(aoisFeaturesAtom);
  const { customFeatures } = props;

  const { onUpdate, onDelete, onSelectionChange } = useAois();

  const serializedCustomFeatures = encodeAois(customFeatures);
  useEffect(() => {
    if (!customFeatures.length) return;
    control.current?.add({
      type: 'FeatureCollection',
      features: customFeatures
    });
    // Look at serialized version to only update when the features change
  }, [serializedCustomFeatures]);

  useControl<MapboxDraw>(
    () => {
      control.current = new MapboxDraw(props);
      return control.current;
    },
    ({ map }: { map: any }) => {
      map.on('draw.create', onUpdate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);
      map.on('draw.selectionchange', onSelectionChange);
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
    },
    {
      position: 'top-left'
    }
  );

  return aoisFeatures.length ? null : <Css />;
}
