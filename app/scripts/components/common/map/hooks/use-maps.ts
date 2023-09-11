import { useContext } from 'react';
import { useMap } from 'react-map-gl';
import { MapsContext } from '../maps';

export function useMaps() {
  const { mainId, comparedId } = useContext(MapsContext);
  const maps = useMap();

  return {
    main: maps[mainId],
    compared: maps[comparedId]
  };
}
