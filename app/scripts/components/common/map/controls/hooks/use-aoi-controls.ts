import { RefObject, useCallback, useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import { Map as MapboxMap } from 'mapbox-gl';

import { AoiChangeListenerOverload, AoiState } from '../aoi/types';
import { makeFeatureCollection } from '../aoi/utils';

const DEFAULT_PARAMETERS = {
  drawing: false,
  selected: false,
  selectedContext: undefined,
  featureCollection: null,
  actionOrigin: null
};

export interface MapboxMapRef {
  resize: () => void;
  instance: MapboxMap | null;
  compareInstance: MapboxMap | null;
}

export function useAoiControls(
  mapRef: RefObject<MapboxMapRef>,
  initialState: Partial<AoiState> = {}
) {
  const [aoi, setAoi] = useState<AoiState>({
    ...DEFAULT_PARAMETERS,
    ...initialState
  });

  useDeepCompareEffect(() => {
    setAoi({
      ...DEFAULT_PARAMETERS,
      ...initialState
    });
  }, [initialState]);

  const onAoiEvent = useCallback((action, payload) => {
    switch (action) {
      case 'aoi.trash-click': {
        // We need to programmatically access the mapbox draw trash method which
        // will do different things depending on the selected mode.
        // @ts-expect-error _drawControl does exist but it is an internal
        // property.
        const mbDraw = mapRef.current?.instance?._drawControl;
        if (!mbDraw) return;
        mbDraw.trash();
        break;
      }
      case 'aoi.draw-click':
        setAoi(({ featureCollection }) => ({
          ...DEFAULT_PARAMETERS,
          featureCollection,
          drawing: true
        }));
        break;
      case 'aoi.select-click':
        setAoi(({ featureCollection }) => ({
          ...DEFAULT_PARAMETERS,
          featureCollection
        }));
        break;
      case 'aoi.set':
        setAoi(() => ({
          ...DEFAULT_PARAMETERS,
          featureCollection: payload.featureCollection
        }));
        break;
      case 'aoi.clear':
        setAoi({
          ...DEFAULT_PARAMETERS
        });
        break;
      case 'aoi.delete':
        setAoi((state) => ({
          ...DEFAULT_PARAMETERS,
          featureCollection: makeFeatureCollection(
            (state.featureCollection?.features ?? []).filter(
              (f) => !payload.ids.includes(f.id)
            )
          )
        }));
        break;
      case 'aoi.draw-finish':
        {
          setAoi(({ featureCollection }) => ({
            ...DEFAULT_PARAMETERS,
            featureCollection: makeFeatureCollection(
              (featureCollection?.features ?? []).concat(payload.feature)
            )
          }));
        }
        break;
      case 'aoi.selection':
        setAoi(({ featureCollection }) => ({
          ...DEFAULT_PARAMETERS,
          featureCollection,
          selected: payload.selected,
          selectedContext: payload.context
        }));
        break;
      case 'aoi.update':
        setAoi((state) => {
          // @ts-expect-error _drawControl does exist but it is an internal
          // property.
          const mbDraw = mapRef.current?.instance?._drawControl;

          // When a feature gets updated, if there was a selectedContext update
          // it. This is needed to reposition the popover.
          let selectedContext = state.selectedContext;
          if (mbDraw && selectedContext) {
            selectedContext = {
              features: mbDraw.getSelected().features,
              points: mbDraw.getSelectedPoints().features
            };
          }

          return {
            ...state,
            selectedContext,
            featureCollection: makeFeatureCollection(
              (state.featureCollection?.features ?? []).map((f) =>
                f.id === payload.feature.id ? payload.feature : f
              )
            )
          };
        });
        break;
    }
    // mapRef is a ref object.
  }, []);

  return { aoi, onAoiEvent: onAoiEvent as AoiChangeListenerOverload };
}
