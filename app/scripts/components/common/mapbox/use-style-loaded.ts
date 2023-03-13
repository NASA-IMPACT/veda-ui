import mapboxgl, { Style } from 'mapbox-gl';
import { useEffect, useState } from 'react';

export function useStyleLoaded(
  mapInstance: mapboxgl.Map | null,
  style: Style | string | undefined
) {
  const [styleLoaded, setStyleLoaded] = useState(false);

  // Listen to style reloads to set a state prop, which is then used as an useEffect dependency
  // to retrigger adding raster layers/markers, and to reapply options
  useEffect(() => {
    const onStyleDataLoading = () => {
      setStyleLoaded(false);
    };
    const onStyleData = () => {
      setStyleLoaded(true);
    };
    if (mapInstance) {
      mapInstance.on('styledataloading', onStyleDataLoading);
      mapInstance.on('styledata', onStyleData);
    }

    return () => {
      if (mapInstance) {
        mapInstance.off('styledataloading', onStyleDataLoading);
        mapInstance.off('styledata', onStyleData);
      }
    };
  }, [mapInstance]);

  // This is needed because the 'styledataloading' event is not always emitted, but raster layer needs to remounted, so we need
  // to reset styleLoaded to false before the 'styledata' is fired again
  useEffect(() => {
    setStyleLoaded(false);
  }, [style]);

  return styleLoaded;
}
