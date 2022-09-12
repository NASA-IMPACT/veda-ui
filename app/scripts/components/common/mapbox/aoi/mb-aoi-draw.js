import { useEffect, useRef } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { css } from 'styled-components';

import { computeDrawStyles } from './style';

export const aoiCursorStyles = css`
  &.mouse-add .mapboxgl-canvas-container {
    cursor: crosshair;
  }
  &.mouse-pointer .mapboxgl-canvas-container {
    cursor: pointer;
  }
  &.mouse-move .mapboxgl-canvas-container {
    cursor: move;
  }
`;

export function useMbDraw({
  mapRef,
  theme,
  onChange,
  drawing,
  selected,
  feature
}) {
  const mbDrawRef = useRef();

  useEffect(() => {
    const mbMap = mapRef.current;
    if (!mbMap) return;

    const newMbDraw = new MapboxDraw({
      modes: MapboxDraw.modes,
      displayControlsDefault: false,
      styles: computeDrawStyles(theme)
    });

    mbDrawRef.current = newMbDraw;

    mbMap.addControl(newMbDraw, 'top-left');

    const drawCreateListener = (e) =>
      onChange?.('aoi.draw-finish', { feature: e.features[0] });

    const drawSelectionListener = (e) =>
      onChange?.('aoi.selection', { selected: !!e.features.length });

    const drawUpdateListener = (e) =>
      onChange?.('aoi.update', { feature: e.features[0] });

    const drawModeListener = (e) =>
      e.mode === 'simple_select' &&
      onChange?.('aoi.selection', { selected: false });

    mbMap
      .on('draw.create', drawCreateListener)
      .on('draw.selectionchange', drawSelectionListener)
      .on('draw.modechange', drawModeListener)
      .on('draw.update', drawUpdateListener);

    return () => {
      if (!mbMap || !newMbDraw) return;

      mbMap
        .off('draw.create', drawCreateListener)
        .off('draw.selectionchange', drawSelectionListener)
        .off('draw.update', drawUpdateListener);

      mbMap.hasControl(newMbDraw) && mbMap.removeControl(newMbDraw);
    };
  }, [mapRef, theme, onChange]);

  // Start/stop the drawing.
  useEffect(() => {
    const mbDraw = mbDrawRef.current;
    if (!mbDraw) return;
    return mbDraw.changeMode(drawing ? 'draw_polygon' : 'simple_select');
  }, [drawing]);

  // Set / delete the feature.
  useEffect(() => {
    const mbDraw = mbDrawRef.current;
    if (!mbDraw) return;

    if (feature) {
      mbDraw.set({
        type: 'FeatureCollection',
        features: [feature]
      });
    } else {
      mbDraw.deleteAll();
    }
  }, [feature]);

  // Select the feature if the state changed.
  useEffect(() => {
    const mbDraw = mbDrawRef.current;
    if (!mbDraw) return;

    if (selected) {
      if (feature) {
        mbDraw.changeMode('direct_select', {
          featureId: feature.id
        });
      }
    } else {
      mbDraw.changeMode('simple_select');
    }
  }, [selected, feature]);
}
