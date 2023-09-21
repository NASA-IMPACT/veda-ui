import { useEffect } from 'react';
import MapboxCompare from 'mapbox-gl-compare';
import useMaps, { useMapsContext } from './use-maps';

export default function useMapCompare() {
  const { main, compared } = useMaps();
  const { containerId } = useMapsContext();
  const hasMapCompare = !!compared;
  useEffect(() => {
    if (!main) return;

    if (compared) {
      const compare = new MapboxCompare(main, compared, `#${containerId}`, {
        mousemove: false,
        orientation: 'vertical'
      });

      return () => {
        compare.remove();
      };
    }
    // main should be stable, while we are only interested here in the absence or presence of compared
  }, [containerId, hasMapCompare]);
}
