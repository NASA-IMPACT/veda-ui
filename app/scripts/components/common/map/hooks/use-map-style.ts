import { useContext } from 'react';
import { StylesContext, StylesContextType } from '../styles';
import useCustomMarker from './use-custom-marker';
import useMaps from './use-maps';

export function useStylesContext(): StylesContextType {
  return useContext(StylesContext);
}

export default function useMapStyle() {
  const { updateStyle, style } = useStylesContext();
  const { current } = useMaps();
  useCustomMarker(current);

  return { updateStyle, style };
}
