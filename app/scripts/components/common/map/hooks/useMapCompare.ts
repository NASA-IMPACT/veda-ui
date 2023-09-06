import { useEffect } from "react";
import { useMap } from "react-map-gl";
import MapboxCompare from 'mapbox-gl-compare';

export default function useMapCompare() {
  const { main, compared } = useMap();
  useEffect(() => {
    if (!main) return;

    if (compared) {
      const compare = new MapboxCompare(
        main,
        compared,
        '#comparison-container',
        {
          mousemove: false,
          orientation: 'vertical'
        }
      );

      return () => {
        compare.remove();
      };
    }
  }, [main, compared]);
}