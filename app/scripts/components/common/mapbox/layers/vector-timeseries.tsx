import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { format } from 'date-fns/esm';

import { ActionStatus } from '$utils/status';
import axios from 'axios';
import { requestQuickCache } from './utils';
import { endOfDay, startOfDay } from 'date-fns';
import { userTzDate2utcString } from '$utils/date';

// Whether or not to print the request logs.
const LOG = true;

const FIT_BOUNDS_PADDING = 32;

interface MapLayerVectorTimeseriesProps {
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

export function MapLayerVectorTimeseries(props: MapLayerVectorTimeseriesProps) {
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
  console.log(
    '🚀 ~ file: features.tsx:63 ~ MapLayerVectorTimeseries ~ props',
    props
  );

  useEffect(() => {
    // Let's create some closure.
    const _id = id;

    async function load() {
      if (!date) return;

      const { data } = await axios.get(
        `${process.env.API_DEV_STAC_ENDPOINT}/collections/${stacCol}`
      );

      const tilesEndpoint = data.links.find((l) => l.rel === 'child').href;

      const start = userTzDate2utcString(startOfDay(date));
      const end = userTzDate2utcString(endOfDay(date));

      mapInstance.addSource(_id, {
        type: 'vector',
        tiles: [`${tilesEndpoint}/tiles/{z}/{x}/{y}?datetime=${start}/${end}`]
      });

      mapInstance.addLayer(
        {
          id: _id,
          type: 'line',
          source: _id,
          'source-layer': 'default',
          paint: {
            'line-color': '#FF0000',
            'line-width': 2
          }
        },
        'admin-0-boundary-bg'
      );
    }

    load();

    return () => {
      mapInstance.removeLayer(_id);
      mapInstance.removeSource(_id);
    };
  }, [mapInstance, id, stacCol, date]);

  return null;
}
