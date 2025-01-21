import { Feature } from 'geojson';
import { useEffect } from 'react';
import useMaps from './use-maps';

interface LayerInteractionHookOptions {
  layerId: string;
  onClick: (features: Feature<any>[]) => void;
}
export default function useLayerInteraction({
  layerId,
  onClick
}: LayerInteractionHookOptions) {
  const { current: mapInstance } = useMaps();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerId]); // do not include mapInstance to avoid unintended re-renders
}
