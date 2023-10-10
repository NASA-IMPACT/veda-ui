
import { Feature } from 'geojson';
import { useEffect } from 'react';
import useMaps, { useMapsContext } from './use-maps';

interface LayerInteractionHookOptions {
  layerId: string;
  onClick: (features: Feature<any>[]) => void;
}
export default function useLayerInteraction({
  layerId,
  onClick
}: LayerInteractionHookOptions) {
  const { current: mapInstance } = useMaps();
  const { setCursor } = useMapsContext();
  useEffect(() => {
    if (!mapInstance) return;
    const onPointsClick = (e) => {
      if (!e.features.length) return;
      onClick(e.features);
    };

    const onPointsEnter = () => {
      setCursor('pointer');
    };

    const onPointsLeave = () => {
      setCursor('grab');
    };

    mapInstance.on('click', layerId, onPointsClick);
    mapInstance.on('mouseenter', layerId, onPointsEnter);
    mapInstance.on('mouseleave', layerId, onPointsLeave);

    return () => {
      mapInstance.off('click', layerId, onPointsClick);
      mapInstance.off('mouseenter', layerId, onPointsEnter);
      mapInstance.off('mouseleave', layerId, onPointsLeave);
    };
  }, [layerId, mapInstance, onClick, setCursor]);
}