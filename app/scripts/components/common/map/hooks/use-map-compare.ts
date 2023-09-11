import { useContext, useEffect } from "react";
import MapboxCompare from 'mapbox-gl-compare';
import { MapsContext } from "../maps";
import { useMaps } from "./use-maps";

export default function useMapCompare() {
  const maps = useMaps();
  const { containerId } = useContext(MapsContext);
  const hasMapCompare = !!maps.compared;
  useEffect(() => {
    if (!maps.main) return;

    if (maps.compared) {
      const compare = new MapboxCompare(
        maps.main,
        maps.compared,
        `#${containerId}`,
        {
          mousemove: false,
          orientation: 'vertical'
        }
      );

      return () => {
        compare.remove();
      };
    }
  }, [containerId, hasMapCompare]);
}