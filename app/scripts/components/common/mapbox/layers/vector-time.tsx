import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { format } from 'date-fns/esm';

import {
  ActionStatus,
} from '$utils/status';

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
        `https://firenrt.delta-backend.com/collections/public.${stacCol}/tiles/{z}/{x}/{y}`
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
