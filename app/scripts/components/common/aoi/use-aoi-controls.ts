import { useCallback, useState } from 'react';
import { AoiChangeListenerOverload, AoiState } from './types';

export function useAoiControls() {
  const [aoi, setAoi] = useState<AoiState>({
    drawing: false,
    selected: false,
    feature: null,
    actionOrigin: null
  });

  const onAoiEvent = useCallback((action, payload) => {
    switch (action) {
      case 'aoi.draw-click':
        // There can only be one selection (feature) on the map
        // If there's a feature toggle the selection.
        // If there's no feature toggle the drawing.
        setAoi((state) => {
          const selected = !!state.feature && !state.selected;
          return {
            ...state,
            drawing: !state.feature && !state.drawing,
            selected,
            actionOrigin: selected ? 'panel' : null
          };
        });
        break;
      case 'aoi.set-feature':
        setAoi((state) => ({
          ...state,
          feature: payload.feature,
          actionOrigin: 'panel'
        }));
        break;
      case 'aoi.clear':
        setAoi({
          drawing: false,
          selected: false,
          feature: null,
          actionOrigin: null
        });
        break;
      case 'aoi.draw-finish':
        setAoi((state) => ({
          ...state,
          drawing: false,
          feature: payload.feature,
          actionOrigin: 'map'
        }));
        break;
      case 'aoi.selection':
        setAoi((state) => ({
          ...state,
          drawing: false,
          selected: payload.selected,
          actionOrigin: payload.selected ? 'map' : null
        }));
        break;
      case 'aoi.update':
        setAoi((state) => ({
          ...state,
          feature: payload.feature,
          actionOrigin: 'map'
        }));
        break;
    }
  }, []);

  return { aoi, onAoiEvent: onAoiEvent as AoiChangeListenerOverload };
}
