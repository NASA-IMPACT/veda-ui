import { useEffect, useRef } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { css } from 'styled-components';

import * as RestrictedRectangleMode from './restricted-rect-mode';

const modes = RestrictedRectangleMode.enable(MapboxDraw.modes);

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

const computeDrawStyles = (theme) => [
  {
    id: 'gl-draw-polygon-fill-inactive',
    type: 'fill',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    paint: {
      'fill-color': theme.color.primary,
      'fill-outline-color': theme.color.primary,
      'fill-opacity': 0.16
    }
  },
  {
    id: 'gl-draw-polygon-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': theme.color.primary,
      'fill-outline-color': theme.color.primary,
      'fill-opacity': 0.16
    }
  },
  {
    id: 'gl-draw-polygon-stroke-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': theme.color.primary,
      'line-width': 2
    }
  },
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': theme.color.primary,
      'line-dasharray': [0.64, 2],
      'line-width': 2
    }
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    paint: {
      'circle-radius': 6,
      'circle-color': '#fff'
    }
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    paint: {
      'circle-radius': 4,
      'circle-color': theme.color.primary
    }
  },
  {
    id: 'gl-draw-point-stroke-active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'active', 'true'],
      ['!=', 'meta', 'midpoint']
    ],
    paint: {
      'circle-radius': 8,
      'circle-color': '#fff'
    }
  },
  {
    id: 'gl-draw-point-active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'midpoint'],
      ['==', 'active', 'true']
    ],
    paint: {
      'circle-radius': 6,
      'circle-color': theme.color.primary
    }
  }
];

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
      modes: modes,
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

    mbMap
      .on('draw.create', drawCreateListener)
      .on('draw.selectionchange', drawSelectionListener)
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
    return mbDraw.changeMode(drawing ? 'draw_rectangle' : 'simple_select');
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
      } else {
        mbDraw.changeMode('simple_select');
      }
    }
  }, [selected, feature]);
}
