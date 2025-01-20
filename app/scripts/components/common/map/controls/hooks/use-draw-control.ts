import { useState, useEffect, useRef } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Feature } from 'geojson';

interface DrawAOIProps {
  mapboxMap: mapboxgl.Map | null;
  isDrawing: boolean;
}

interface DrawControlState {
  drawing: Feature | Feature[] | null;
  isValid: boolean;
}

/**
 * Custom hook to manage drawing control on a Mapbox GL map.
 *
 * @param {mapboxgl.Map | null} props.mapboxMap - The Mapbox GL map instance.
 * @param {boolean} props.isDrawing - Flag indicating whether drawing mode is active.
 * @returns {[Feature | Feature[] | null, boolean]} - An array containing the current drawing and its validity.
 *
 * @example
 * const [drawing, isValid] = useDrawControl({ mapboxMap, isDrawing });
 */
export const useDrawControl = ({
  mapboxMap,
  isDrawing
}: DrawAOIProps): [Feature | Feature[] | null, boolean] => {
  const [{ drawing, isValid }, setDrawing] = useState<DrawControlState>({
    drawing: null,
    isValid: false
  });
  const drawControl = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (mapboxMap === null) return;

    if (isDrawing) {
      // we only need the drawControl when drawing
      // and it is not yet initialized

      drawControl.current = new MapboxDraw({
        displayControlsDefault: false,
        defaultMode: 'draw_polygon'
        // styles: props.styles, // TODO
      }); // init drawControl

      mapboxMap.addControl(drawControl.current);

      mapboxMap.on('draw.create', (e: { features: Feature }) => {
        // Fired when a feature is created.
        // https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#drawcreate
        setDrawing({ drawing: e.features, isValid: true });
      });
      mapboxMap.on('draw.update', (e: { features: Feature }) => {
        // Fired when one or more features are updated.
        // https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#drawupdate
        setDrawing({ drawing: e.features, isValid: true });
      });
      mapboxMap.on('draw.delete', () => {
        // Fired when one or more features are deleted.
        // https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#drawdelete
        setDrawing({ drawing: null, isValid: false });
      });
    }

    return () => {
      // clean up ...
      if (!!drawControl.current && !!drawControl.current.onRemove) {
        // removeControl() Argument must be a control with onAdd and onRemove methods.
        mapboxMap.removeControl(drawControl.current);
        drawControl.current = null;
      }
      setDrawing({ drawing: null, isValid: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing]); // only run when drawing mode changes

  return [drawing, isValid];
};
