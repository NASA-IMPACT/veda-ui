
import { Feature } from 'geojson';
import { Map as MapboxMap } from 'mapbox-gl';
import { useEffect } from 'react';

interface LayerInteractionHookOptions {
  layerId: string;
  mapInstance: MapboxMap;
  onClick: (features: Feature<any>[]) => void;
}
export default function useLayerInteraction({
  layerId,
  mapInstance,
  onClick
}: LayerInteractionHookOptions) {
  useEffect(() => {
    if (!mapInstance) return;
    const onPointsClick = (e) => {
      if (!e.features.length) return;
      onClick(e.features);
    };

    const onPointsEnter = () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    };

    const onPointsLeave = () => {
      mapInstance.getCanvas().style.cursor = '';
    };

    mapInstance.on('click', layerId, onPointsClick);
    mapInstance.on('mouseenter', layerId, onPointsEnter);
    mapInstance.on('mouseleave', layerId, onPointsLeave);

    return () => {
      mapInstance.off('click', layerId, onPointsClick);
      mapInstance.off('mouseenter', layerId, onPointsEnter);
      mapInstance.off('mouseleave', layerId, onPointsLeave);
    };
  }, [layerId, mapInstance, onClick]);
}