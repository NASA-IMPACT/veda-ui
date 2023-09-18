import { useContext } from 'react';
import { useMap } from 'react-map-gl';
import { MapsContext } from '../maps';
import { StylesContext } from '../styles';

export default function useMaps() {
  const { mainId, comparedId } = useContext(MapsContext);
  const { isCompared } = useContext(StylesContext);
  const maps = useMap();
  const main = maps[mainId];
  const compared = maps[comparedId];
  const current = isCompared ? compared : main;

  return {
    main,
    compared,
    current
  };
}
