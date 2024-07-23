import { useContext } from 'react';
import { useMap } from 'react-map-gl';
import { MapsContext, MapsContextType } from '../maps';
import { useStylesContext } from './use-map-style';

export function useMapsContext(): MapsContextType {
  return useContext(MapsContext);
}

export default function useMaps() {
  const { mainId, comparedId } = useMapsContext();
  const { isCompared } = useStylesContext();
  const maps = useMap();
  const main = maps?.[mainId];
  const compared = maps[comparedId];
  const current = isCompared ? compared : main;

  return {
    main,
    compared,
    current,
  };
}
