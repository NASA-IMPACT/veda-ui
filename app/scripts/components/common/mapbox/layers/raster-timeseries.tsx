import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import mapboxgl from 'mapbox-gl';

import { userTzDate2utcString } from '$utils/date';
import {
  ActionStatus,
  S_FAILED,
  S_IDLE,
  S_LOADING,
  S_SUCCEEDED
} from '$utils/status';

// Whether or not to print the request logs.
const LOG = true;

/**
 * Creates the appropriate filter object to send to STAC.
 *
 * @param {string} dateStr Date to request
 * @param {string} collection STAC collection to request
 * @returns Object
 */
function getFilterPayload(dateStr: string, collection: string) {
  return {
    op: 'and',
    args: [
      {
        op: 'eq',
        args: [{ property: 'datetime' }, dateStr]
      },
      {
        op: 'eq',
        args: [{ property: 'collection' }, collection]
      }
    ]
  };
}

// There are cases when the data can't be displayed properly on low zoom levels.
// In these cases instead of displaying the raster tiles, we display markers to
// indicate whether or not there is data in a given location. When the user
// crosses the marker threshold, if below the min zoom we have to request the
// marker position, and if above we have to register a mosaic query. Since this
// switching can happen several times, we cache the api response using the
// request params as key.
const quickCache = new Map<string, any>();
async function requestQuickCache(
  url: string,
  payload,
  controller: AbortController
) {
  const key = `${url}${JSON.stringify(payload)}`;

  // No cache found, make request.
  if (!quickCache.has(key)) {
    const response = await axios.post(url, payload, {
      signal: controller.signal
    });
    quickCache.set(key, response.data);
  }

  return quickCache.get(key);
}

interface MapLayerRasterTimeseriesProps {
  id: string;
  layerId: string;
  date: Date;
  mapInstance: mapboxgl.Map;
  sourceParams: object;
  zoomExtent: [number, number];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden: boolean;
}

type Statuses = {
  global: ActionStatus;
  layer: ActionStatus;
  'zoom-markers': ActionStatus;
};

export function MapLayerRasterTimeseries(props: MapLayerRasterTimeseriesProps) {
  const {
    id,
    layerId,
    date,
    mapInstance,
    sourceParams = {},
    zoomExtent,
    onStatusChange,
    isHidden
  } = props;

  const minZoom = zoomExtent?.[0];

  const [showMarkers, setShowMarkers] = useState(
    mapInstance.getZoom() < minZoom
  );

  const addedMarkers = useRef<mapboxgl.Marker[]>([]);

  // Status tracking.
  // A raster timeseries layer has a base layer and may have markers.
  // The status is succeeded only if all requests succeed.
  const statuses = useRef<Statuses>({
    global: S_IDLE,
    layer: S_IDLE,
    // If there's no marker layer (i.e. there's no min zoom extent), set it to
    // succeeded to be ignored.
    'zoom-markers': !minZoom ? S_SUCCEEDED : S_IDLE
  });

  const changeStatus = useCallback(
    ({
      status,
      context
    }: {
      status: ActionStatus;
      context: 'zoom-markers' | 'layer';
    }) => {
      // Set the new status
      statuses.current[context] = status;

      const layersToCheck = [
        statuses.current['zoom-markers'],
        statuses.current.layer
      ];

      let newStatus = statuses.current.global;
      // All must succeed to be considered successful.
      if (layersToCheck.every((s) => s === S_SUCCEEDED)) {
        newStatus = S_SUCCEEDED;

        // One failed status is enough for all.
        // Failed takes priority over loading.
      } else if (layersToCheck.some((s) => s === S_FAILED)) {
        newStatus = S_FAILED;
        // One loading status is enough for all.
      } else if (layersToCheck.some((s) => s === S_LOADING)) {
        newStatus = S_LOADING;
      } else if (layersToCheck.some((s) => s === S_IDLE)) {
        newStatus = S_IDLE;
      }

      // Only emit on status change.
      if (newStatus !== statuses.current.global) {
        statuses.current.global = newStatus;
        onStatusChange({ status: newStatus, id });
      }
    },
    [id, onStatusChange]
  );

  // Control whether or not to show markers depending on the zoom level. The min
  // value for the zoomExtent is the threshold. Below this value the data is not
  // loaded and markers are shown instead.
  useEffect(() => {
    const zoomEnd = () => {
      const showMarkers = mapInstance.getZoom() < minZoom;
      setShowMarkers(showMarkers);
    };

    zoomEnd();
    mapInstance.on('zoomend', zoomEnd);

    return () => {
      mapInstance?.off('zoomend', zoomEnd);
    };
  }, [minZoom, mapInstance]);

  //
  // Markers
  //
  useEffect(() => {
    if (!id || !layerId || !date || !minZoom) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        changeStatus?.({ status: 'loading', context: 'zoom-markers' });

        const payload = {
          filter: getFilterPayload(userTzDate2utcString(date), layerId),
          limit: 500,
          fields: {
            include: ['bbox'],
            exclude: ['collection', 'links']
          }
        };

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cLoading Markers',
            'color: orange;',
            id
          );
        LOG && console.log('Payload', payload);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const responseData = await requestQuickCache(
          `${process.env.API_STAC_ENDPOINT}/search`,
          payload,
          controller
        );

        // Create points from bboxes
        const points = responseData.features.map((f) => {
          const [w, s, e, n] = f.bbox;
          return {
            bounds: [
              [w, s],
              [e, n]
            ],
            center: [(w + e) / 2, (s + n) / 2]
          };
        });

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cAdding Markers',
            'color: green;',
            id
          );
        LOG && console.log('STAC response', responseData);
        LOG && console.log('Points', points);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        addedMarkers.current = points.map((p) => {
          const marker = new mapboxgl.Marker()
            .setLngLat(p.center)
            .addTo(mapInstance);

          const el = marker.getElement();
          el.addEventListener('click', () =>
            mapInstance.fitBounds(p.bounds, { padding: 32 })
          );
          el.style.display = !isHidden && showMarkers ? '' : 'none';

          return marker;
        });

        changeStatus?.({ status: 'succeeded', context: 'zoom-markers' });
      } catch (error) {
        if (!controller.signal.aborted) {
          changeStatus?.({ status: 'failed', context: 'zoom-markers' });
        }
        LOG &&
          /* eslint-disable-next-line no-console */
          console.log(
            'MapLayerRasterTimeseries %cAborted Markers',
            'color: red;',
            id
          );
        return;
      }
    };

    load();

    return () => {
      controller && controller.abort();
      changeStatus?.({ status: 'idle', context: 'zoom-markers' });

      if (mapInstance) {
        addedMarkers.current.forEach((marker) => marker.remove());
        addedMarkers.current = [];
      }
    };
    // The showMarkers and isHidden dep are left out on purpose, as visibility
    // is controlled below, but we need the value to initialize the markers
    // visibility.
  }, [id, changeStatus, layerId, date, minZoom, mapInstance, sourceParams]);

  //
  // Tiles
  //
  useEffect(() => {
    if (!id || !layerId || !date) return;

    const controller = new AbortController();

    const load = async () => {
      changeStatus?.({ status: 'loading', context: 'layer' });
      try {
        const payload = {
          filter: getFilterPayload(userTzDate2utcString(date), layerId)
        };

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cLoading',
            'color: orange;',
            id
          );
        LOG && console.log('Payload', payload);
        LOG && console.log('Source Params', sourceParams);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const responseData = await requestQuickCache(
          `${process.env.API_RASTER_ENDPOINT}/mosaic/register`,
          payload,
          controller
        );

        const tileParams = qs.stringify(
          {
            assets: 'cog_default',
            ...sourceParams
          },
          { arrayFormat: 'comma' }
        );

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cAdding',
            'color: green;',
            id
          );
        LOG && console.log('Url', responseData.tiles);
        LOG && console.log('STAC response', responseData);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        mapInstance.addSource(id, {
          type: 'raster',
          url: `${responseData.tiles}?${tileParams}`
        });

        mapInstance.addLayer(
          {
            id: id,
            type: 'raster',
            source: id,
            layout: {
              visibility: showMarkers ? 'none' : 'visible'
            },
            paint: {
              'raster-opacity': Number(!isHidden),
              'raster-opacity-transition': {
                duration: 320
              }
            }
          },
          'admin-0-boundary-bg'
        );
        changeStatus?.({ status: 'succeeded', context: 'layer' });
      } catch (error) {
        if (!controller.signal.aborted) {
          changeStatus?.({ status: 'failed', context: 'layer' });
        }
        LOG &&
          /* eslint-disable-next-line no-console */
          console.log('MapLayerRasterTimeseries %cAborted', 'color: red;', id);
        return;
      }
    };

    load();

    return () => {
      controller && controller.abort();
      changeStatus?.({ status: 'idle', context: 'layer' });

      if (mapInstance?.getSource(id)) {
        mapInstance.removeLayer(id);
        mapInstance.removeSource(id);
      }
    };
    // The showMarkers and isHidden dep are left out on purpose, as visibility
    // is controlled below, but we need the value to initialize the layer
    // visibility.
  }, [id, changeStatus, layerId, date, mapInstance, sourceParams]);

  //
  // Visibility control for the layer and the markers.
  //
  useEffect(() => {
    if (mapInstance.getLayer(id)) {
      const visibility = showMarkers ? 'none' : 'visible';
      mapInstance.setLayoutProperty(id, 'visibility', visibility);
      mapInstance.setPaintProperty(id, 'raster-opacity', Number(!isHidden));
    }

    addedMarkers.current.forEach((marker) => {
      const display = isHidden ? 'none' : showMarkers ? '' : 'none';
      marker.getElement().style.display = display;
    });
  }, [id, mapInstance, showMarkers, isHidden]);

  return null;
}
