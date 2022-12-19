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

// Whether or not to print the request logs.
const LOG = true;

const FIT_BOUNDS_PADDING = 32;

interface MapLayerRasterTimeseriesProps {
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

export function MapLayerRasterTimeseries(props: MapLayerRasterTimeseriesProps) {
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

  const theme = useTheme();
  const primaryColor = theme.color?.primary;
  const minZoom = zoomExtent?.[0] ?? -Infinity;

  const [showMarkers, setShowMarkers] = useState(
    mapInstance.getZoom() < minZoom
  );

  const addedMarkers = useRef<mapboxgl.Marker[]>([]);

  // Status tracking.
  // A raster timeseries layer has a base layer and may have markers.
  // The status is succeeded only if all requests succeed.
  const statuses = useRef<Statuses>({
    [STATUS_KEY.Global]: S_IDLE,
    [STATUS_KEY.Layer]: S_IDLE,
    [STATUS_KEY.StacSearch]: S_IDLE
  });

  const changeStatus = useCallback(
    ({
      status,
      context
    }: {
      status: ActionStatus;
      context: STATUS_KEY.StacSearch | STATUS_KEY.Layer;
    }) => {
      // Set the new status
      statuses.current[context] = status;

      const layersToCheck = [
        statuses.current[STATUS_KEY.StacSearch],
        statuses.current[STATUS_KEY.Layer]
      ];

      let newStatus = statuses.current[STATUS_KEY.Global];
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
      if (newStatus !== statuses.current[STATUS_KEY.Global]) {
        statuses.current[STATUS_KEY.Global] = newStatus;
        onStatusChange?.({ status: newStatus, id });
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
      mapInstance.off('zoomend', zoomEnd);
    };
  }, [minZoom, mapInstance]);

  //
  // Load stac collection features
  //
  const [stacCollection, setStacCollection] = useState<StacFeature[]>([]);
  useEffect(() => {
    if (!id || !stacCol || !date) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        changeStatus({ status: S_LOADING, context: STATUS_KEY.StacSearch });
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(date, stacCol),
          limit: 500,
          fields: {
            include: ['bbox'],
            exclude: ['collection', 'links']
          }
        };

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cLoading STAC features',
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

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cAdding STAC features',
            'color: green;',
            id
          );
        LOG && console.log('STAC response', responseData);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        setStacCollection(responseData.features);
        changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.StacSearch });
      } catch (error) {
        if (!controller.signal.aborted) {
          setStacCollection([]);
          changeStatus({ status: S_FAILED, context: STATUS_KEY.StacSearch });
        }
        LOG &&
          /* eslint-disable-next-line no-console */
          console.log(
            'MapLayerRasterTimeseries %cAborted STAC features',
            'color: red;',
            id
          );
        return;
      }
    };
    load();
    return () => {
      controller.abort();
      changeStatus({ status: 'idle', context: STATUS_KEY.StacSearch });
    };
  }, [id, changeStatus, stacCol, date]);

  //
  // Markers
  //
  useEffect(() => {
    if (!id || !stacCol || !date || !minZoom || !stacCollection.length) return;

    // Create points from bboxes
    const points = stacCollection.map((f) => {
      const [w, s, e, n] = f.bbox;
      return {
        bounds: [
          [w, s],
          [e, n]
        ] as LngLatBoundsLike,
        center: [(w + e) / 2, (s + n) / 2] as [number, number]
      };
    });

    addedMarkers.current = points.map((p) => {
      const marker = new mapboxgl.Marker({
        color: primaryColor
      })
        .setLngLat(p.center)
        .addTo(mapInstance);

      const el = marker.getElement();
      el.addEventListener('click', () =>
        mapInstance.fitBounds(p.bounds, { padding: FIT_BOUNDS_PADDING })
      );
      el.style.display = !isHidden && showMarkers ? '' : 'none';

      return marker;
    });

    return () => {
      addedMarkers.current.forEach((marker) => marker.remove());
      addedMarkers.current = [];
    };
    // The showMarkers and isHidden dep are left out on purpose, as visibility
    // is controlled below, but we need the value to initialize the markers
    // visibility.
  }, [
    id,
    stacCol,
    stacCollection,
    date,
    minZoom,
    mapInstance,
    sourceParams,
    primaryColor
  ]);

  //
  // Tiles
  //
  useEffect(() => {
    if (!id || !stacCol || !date || !stacCollection.length) return;

    const controller = new AbortController();

    const load = async () => {
      changeStatus({ status: S_LOADING, context: STATUS_KEY.Layer });
      try {
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(date, stacCol)
        };

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cLoading Mosaic',
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
          // Temporary solution to pass different tile parameters for hls data
          { arrayFormat: id.toLowerCase().includes('hls') ? 'repeat' : 'comma' }
        );

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cAdding Mosaic',
            'color: green;',
            id
          );
        // links[0] : metadata , links[1]: tile
        LOG && console.log('Url', responseData.links[1].href);
        LOG && console.log('STAC response', responseData);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        mapInstance.addSource(id, {
          type: 'raster',
          url: `${responseData.links[1].href}?${tileParams}`
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
        changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.Layer });
      } catch (error) {
        if (!controller.signal.aborted) {
          changeStatus({ status: S_FAILED, context: STATUS_KEY.Layer });
        }
        LOG &&
          /* eslint-disable-next-line no-console */
          console.log(
            'MapLayerRasterTimeseries %cAborted Mosaic',
            'color: red;',
            id
          );
        return;
      }
    };

    load();

    return () => {
      controller.abort();
      changeStatus({ status: 'idle', context: STATUS_KEY.Layer });

      const source = mapInstance.getSource(id) as
        | mapboxgl.AnySourceImpl
        | undefined;

      if (source) {
        mapInstance.removeLayer(id);
        mapInstance.removeSource(id);
      }
    };
    // The showMarkers and isHidden dep are left out on purpose, as visibility
    // is controlled below, but we need the value to initialize the layer
    // visibility.
  }, [
    id,
    changeStatus,
    stacCol,
    stacCollection,
    date,
    mapInstance,
    sourceParams
  ]);

  //
  // FitBounds when needed
  //
  useEffect(() => {
    if (!stacCollection.length) return;
    const layerBounds = getMergedBBox(stacCollection);

    if (checkFitBoundsFromLayer(layerBounds, mapInstance)) {
      mapInstance.fitBounds(layerBounds, { padding: FIT_BOUNDS_PADDING });
    }
  }, [mapInstance, stacCol, stacCollection]);

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
