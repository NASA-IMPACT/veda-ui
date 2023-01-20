import { useCallback, useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

import { MapboxMapRef } from '../mapbox';
import { AoiChangeListenerOverload, AoiState } from './types';
import { featureCollection } from './utils';

export function useAoiControls(
  mapRef: React.RefObject<MapboxMapRef>,
  initialState: Partial<AoiState> = {}
) {
  const [aoi, setAoi] = useState<AoiState>({
    drawing: false,
    selected: false,
    fc: null,
    actionOrigin: null,
    ...initialState
  });

  useDeepCompareEffect(() => {
    setAoi({
      drawing: false,
      selected: false,
      fc: null,
      actionOrigin: null,
      ...initialState
    });
  }, [initialState]);

  const onAoiEvent = useCallback((action, payload) => {
    switch (action) {
      case 'aoi.trash-click': {
        // Find the mapDraw control by checking for properties.
        // We need to programmatically access the mapbox draw trash method which
        // will do different things depending on the selected mode.
        // @ts-expect-error _controls does exist but it is an internal property.
        const mbDraw = mapRef.current?.instance?._controls.find(
          (c) => c.modes && typeof c.trash === 'function'
        );
        if (!mbDraw) return;

        setAoi((state) => {
          if (state.selected) {
            mbDraw.trash();
            return state;
          }

          mbDraw.deleteAll();
          return {
            ...state,
            drawing: false,
            selected: false,
            fc: null,
            actionOrigin: null
          };
        });

        break;
      }
      case 'aoi.draw-click':
        setAoi((state) => {
          return {
            ...state,
            drawing: !state.drawing,
            selected: false,
            actionOrigin: null
          };
        });
        break;
      case 'aoi.set':
        setAoi((state) => ({
          ...state,
          drawing: false,
          fc: payload.fc,
          actionOrigin: 'panel'
        }));
        break;
      case 'aoi.clear':
        setAoi({
          drawing: false,
          selected: false,
          fc: null,
          actionOrigin: null
        });
        break;
      case 'aoi.delete':
        setAoi((state) => ({
          drawing: false,
          selected: false,
          fc: featureCollection(
            (state.fc?.features ?? []).filter(
              (f) => !payload.ids.includes(f.id)
            )
          ),
          actionOrigin: null
        }));
        break;
      case 'aoi.draw-finish':
        setAoi((state) => ({
          ...state,
          drawing: false,
          fc: featureCollection(
            (state.fc?.features ?? []).concat(payload.feature)
          ),
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
          fc: featureCollection(
            (state.fc?.features ?? []).map((f) =>
              f.id === payload.feature.id ? payload.feature : f
            )
          ),
          actionOrigin: 'map'
        }));
        break;
    }
    // mapRef is a ref object.
  }, []);

  return { aoi, onAoiEvent: onAoiEvent as AoiChangeListenerOverload };
}
