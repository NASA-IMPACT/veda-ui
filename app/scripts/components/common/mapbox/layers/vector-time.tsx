import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import qs from 'qs';
import mapboxgl, { LngLatBoundsLike } from 'mapbox-gl';

import {
  checkFitBoundsFromLayer,
  getFilterPayload,
  getMergedBBox,
  requestQuickCache
} from './utils';
import {
  ActionStatus,
  S_FAILED,
  S_IDLE,
  S_LOADING,
  S_SUCCEEDED
} from '$utils/status';
import { format } from 'date-fns/esm';

// Whether or not to print the request logs.
const LOG = true;

const FIT_BOUNDS_PADDING = 32;

interface MapLayerVectorProps {
  id: string;
  stacCol: string;
  date?: Date;
  mapInstance: mapboxgl.Map;
  sourceParams: object;
  zoomExtent?: [number, number];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden: boolean;
}

export interface StacFeature {
  bbox: [number, number, number, number];
}

enum STATUS_KEY {
  Global,
  Layer,
  StacSearch
}

interface Statuses {
  [STATUS_KEY.Global]: ActionStatus;
  [STATUS_KEY.Layer]: ActionStatus;
  [STATUS_KEY.StacSearch]: ActionStatus;
}

export function MapLayerVector(props: MapLayerVectorProps) {
  const {
    id,
    stacCol,
    date,
    mapInstance,
    sourceParams,
    zoomExtent,
    onStatusChange,
    isHidden
  } = props;
  console.log('🚀 ~ file: features.tsx:63 ~ MapLayerVector ~ props', props);

  const dateStr = date ? format(date, 'yyyy-MM-dd') : '';

  useEffect(() => {
    window.mapInstance = mapInstance;
    mapInstance.addSource(id, {
      type: 'vector',
      tiles: [
        `https://pzh7fedpc0.execute-api.us-west-2.amazonaws.com/collections/public.${stacCol}/tiles/{z}/{x}/{y}`
      ]
    });

    mapInstance.addLayer(
      {
        id: id,
        type: 'line',
        source: id,
        'source-layer': 'default',
        paint: {
          'line-color': '#FF0000',
          'line-width': 2
        },
        filter: ['in', dateStr, ['get', 't']]
      },
      'admin-0-boundary-bg'
    );

    return () => {
      mapInstance.removeLayer(id);
      mapInstance.removeSource(id);
    };
  }, []);

  useEffect(() => {
    mapInstance.setFilter(id, ['in', dateStr, ['get', 't']]);
  }, [dateStr]);

  return null;
}
