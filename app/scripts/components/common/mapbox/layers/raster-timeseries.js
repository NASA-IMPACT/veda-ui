import { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import mapboxgl from 'mapbox-gl';

import { RASTER_ENDPOINT, STAC_ENDPOINT } from './utils';
import { userTzDate2utcString } from '$utils/date';

const LOG = true;

/**
 * Creates the appropriate filter object to send to STAC.
 *
 * @param {string} dateStr Date to request
 * @param {string} collection STAC collection to request
 * @returns Object
 */
function getFilterPayload(dateStr, collection) {
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
const quickCache = new Map();
async function requestQuickCache(url, payload, controller) {
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

export function MapLayerRasterTimeseries(props) {
  const {
    id,
    layerId,
    date,
    mapInstance,
    sourceParams = {},
    zoomExtent,
    onStatusChange: changeStatus
  } = props;

  const [showMarkers, setShowMarkers] = useState(
    mapInstance.getZoom() < zoomExtent?.[0]
  );

  // Control whether or not to show markers depending on the zoom level. The min
  // value for the zoomExtent is the threshold. Below this value the data is not
  // loaded and markers are shown instead.
  useEffect(() => {
    const zoomEnd = () => {
      const showMarkers = mapInstance.getZoom() < zoomExtent?.[0];
      setShowMarkers(showMarkers);
    };

    zoomEnd();
    mapInstance.on('zoomend', zoomEnd);

    return () => {
      mapInstance?.off('zoomend', zoomEnd);
    };
  }, [zoomExtent, mapInstance]);

  // Request and manage markers.
  useEffect(() => {
    if (!id || !layerId || !date || !showMarkers) return;

    const controller = new AbortController();
    let addedMarkers = [];

    const load = async () => {
      try {
        changeStatus?.('loading');
        LOG &&
          /* eslint-disable-next-line no-console */
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cLoading Markers',
            'color: orange;',
            id
          );

        const payload = {
          filter: getFilterPayload(userTzDate2utcString(date), layerId),
          limit: 500,
          fields: {
            include: ['bbox'],
            exclude: ['collection', 'links']
          }
        };

        /* eslint-disable no-console */
        LOG && console.log('Payload', payload);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const responseData = await requestQuickCache(
          `${STAC_ENDPOINT}/search`,
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

        addedMarkers = points.map((p) => {
          const marker = new mapboxgl.Marker()
            .setLngLat(p.center)
            .addTo(mapInstance);

          marker
            .getElement()
            .addEventListener('click', () =>
              mapInstance.fitBounds(p.bounds, { padding: 32 })
            );

          return marker;
        });

        changeStatus?.('succeeded');
      } catch (error) {
        if (!controller.signal.aborted) {
          changeStatus?.('failed');
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
      changeStatus?.('idle');

      if (mapInstance) {
        addedMarkers.forEach((marker) => marker.remove());
      }
    };
  }, [id, changeStatus, layerId, date, mapInstance, showMarkers, sourceParams]);

  // Request and manage tiles.
  useEffect(() => {
    if (!id || !layerId || !date || showMarkers) return;

    const controller = new AbortController();

    const load = async () => {
      changeStatus?.('loading');
      try {
        LOG &&
          /* eslint-disable-next-line no-console */
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cLoading',
            'color: orange;',
            id
          );

        const payload = {
          filter: getFilterPayload(userTzDate2utcString(date), layerId)
        };

        /* eslint-disable no-console */
        LOG && console.log('Payload', payload);
        LOG && console.log('Source Params', sourceParams);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const responseData = await requestQuickCache(
          `${RASTER_ENDPOINT}/mosaic/register`,
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

        mapInstance.addLayer({
          id: id,
          type: 'raster',
          source: id
        });
        changeStatus?.('succeeded');
      } catch (error) {
        if (!controller.signal.aborted) {
          changeStatus?.('failed');
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
      changeStatus?.('idle');

      if (mapInstance?.getSource(id)) {
        mapInstance.removeLayer(id);
        mapInstance.removeSource(id);
      }
    };
  }, [id, changeStatus, layerId, date, mapInstance, showMarkers, sourceParams]);

  return null;
}
