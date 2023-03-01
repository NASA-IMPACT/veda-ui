import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';

export function useBasemap(mapInstance: mapboxgl.Map | null) {
  const [styleLoaded, setStyleLoaded] = useState(true);
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
  return { styleLoaded };
}
