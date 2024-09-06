import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import qs from 'qs';
import {
  Map as MapboxMap,
  AnyLayer,
  AnySourceImpl,
  GeoJSONSourceRaw,
  LngLatBoundsLike,
  RasterLayer,
  RasterSource,
  SymbolLayer
} from 'mapbox-gl';
import { useTheme } from 'styled-components';
import { featureCollection, point } from '@turf/helpers';

import { useMapStyle } from './styles';
import {
  FIT_BOUNDS_PADDING,
  getFilterPayload,
  getMergedBBox,
  requestQuickCache,
  useFitBbox,
  useLayerInteraction
} from './utils';
import { useCustomMarker } from './custom-marker';

import {
  ActionStatus,
  S_FAILED,
  S_IDLE,
  S_LOADING,
  S_SUCCEEDED
} from '$utils/status';

// Whether or not to print the request logs.
const LOG = process.env.NODE_ENV !== 'production';

export interface MapLayerRasterTimeseriesProps {
  id: string;
  stacCol: string;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
  date?: Date;
  mapInstance: MapboxMap;
  sourceParams?: Record<string, any>;
  zoomExtent?: number[];
  bounds?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden?: boolean;
  idSuffix?: string;
  isPositionSet?: boolean;
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
    stacApiEndpoint,
    tileApiEndpoint,
    stacCol,
    date,
    mapInstance,
    sourceParams,
    zoomExtent,
    bounds,
    onStatusChange,
    isHidden,
    idSuffix = '',
    isPositionSet
  } = props;

  const theme = useTheme();
  const { updateStyle } = useMapStyle();

  const minZoom = zoomExtent?.[0] ?? 0;
  const generatorId = 'raster-timeseries' + idSuffix;

  const stacApiEndpointToUse = stacApiEndpoint ?? process.env.API_STAC_ENDPOINT;
  const tileApiEndpointToUse =
    tileApiEndpoint ?? process.env.API_RASTER_ENDPOINT;

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

        const responseData = await requestQuickCache({
          url: `${stacApiEndpointToUse}/search`,
          payload,
          controller
        });

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
  }, [id, changeStatus, stacApiEndpointToUse, stacCol, date]);

  //
  // Markers
  //
  const points = useMemo(() => {
    if (!stacCollection.length) return null;
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

    return points;
  }, [stacCollection]);

  //
  // Tiles
  //
  const [mosaicUrl, setMosaicUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!id || !stacCol || !date) return;

    // If the search returned no data, remove anything previously there so we
    // don't run the risk that the selected date and data don't match, even
    // though if a search returns no data, that date should not be available for
    // the dataset - may be a case of bad configuration.
    if (!stacCollection.length) {
      setMosaicUrl(null);
      return;
    }

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
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        let responseData;

        try {
          responseData = await requestQuickCache({
            url: `${tileApiEndpointToUse}/searches/register`,
            payload,
            controller
          });
          const mosaicUrl = responseData.links[1].href;
          setMosaicUrl(mosaicUrl.replace('/{tileMatrixSetId}', '/WebMercatorQuad'));
        } catch (error) {
          // @NOTE: conditional logic TO BE REMOVED once new BE endpoints have moved to prod... Fallback on old request url if new endpoints error with nonexistance...
          if (error.request) {
            // The request was made but no response was received
            responseData = await requestQuickCache({
              url: `${tileApiEndpointToUse}/mosaic/register`, // @NOTE: This will fail anyways with "staging-raster.delta-backend.com" because its already deprecated...
              payload,
              controller
            });

            const mosaicUrl = responseData.links[1].href;
            setMosaicUrl(mosaicUrl);
          } else {
              LOG &&
              /* eslint-disable-next-line no-console */
              console.log('Titiler /register %cEndpoint error', 'color: red;', error);
              throw error;
          }
        }

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
    };
  }, [
    // The `showMarkers` and `isHidden` dep are left out on purpose, as visibility
    // is controlled below, but we need the value to initialize the layer
    // visibility.
    stacCollection
    // This hook depends on a series of properties, but whenever they change the
    // `stacCollection` is guaranteed to change because a new STAC request is
    // needed to show the data. The following properties are therefore removed
    // from the dependency array:
    // - id
    // - changeStatus
    // - stacCol
    // - date
    // - tileApiEndpointToUse
    // - sacApiEndpointToUse
    // Keeping then in would cause multiple requests because for example when
    // `date` changes the hook runs, then the STAC request in the hook above
    // fires and `stacCollection` changes, causing this hook to run again. This
    // resulted in a race condition when adding the source to the map leading to
    // an error.
  ]);

  const markerLayout = useCustomMarker(mapInstance);

  //
  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );

  useEffect(
    () => {
      const controller = new AbortController();
      async function run() {
        let layers: AnyLayer[] = [];
        let sources: Record<string, AnySourceImpl> = {};
        if (mosaicUrl) {
          const tileParams = qs.stringify(
            {
              assets: 'cog_default',
              ...sourceParams
            },
            // Temporary solution to pass different tile parameters for hls data
            {
              arrayFormat: id.toLowerCase().includes('hls') ? 'repeat' : 'comma'
            }
          );

          const tilejsonUrl = `${mosaicUrl}?${tileParams}`;

          let tileServerUrl: string | undefined = undefined;
          try {
            const tilejsonData = await requestQuickCache({
              url: tilejsonUrl,
              method: 'GET',
              payload: null,
              controller
            });
            tileServerUrl = tilejsonData.tiles[0];
          } catch (error) {
            // Ignore errors.
          }

          const wmtsBaseUrl = mosaicUrl.replace(
            'tilejson.json',
            'WMTSCapabilities.xml'
          );

          const mosaicSource: RasterSource = {
            type: 'raster',
            url: tilejsonUrl
          };

          const mosaicLayer: RasterLayer = {
            id: id,
            type: 'raster',
            source: id,
            layout: {
              visibility: isHidden ? 'none' : 'visible'
            },
            paint: {
              'raster-opacity': Number(!isHidden),
              'raster-opacity-transition': {
                duration: 320
              }
            },
            minzoom: minZoom,
            metadata: {
              id,
              layerOrderPosition: 'raster',
              xyzTileUrl: tileServerUrl,
              wmtsTileUrl: `${wmtsBaseUrl}?${tileParams}`
            }
          };

          sources = {
            ...sources,
            [id]: mosaicSource
          };
          layers = [...layers, mosaicLayer];
        }

        if (points && minZoom > 0) {
          const pointsSourceId = `${id}-points`;
          const pointsSource: GeoJSONSourceRaw = {
            type: 'geojson',
            data: featureCollection(
              points.map((p) => point(p.center, { bounds: p.bounds }))
            )
          };

          const pointsLayer: SymbolLayer = {
            type: 'symbol',
            id: pointsSourceId,
            source: pointsSourceId,
            layout: {
              ...(markerLayout as any),
              visibility: isHidden ? 'none' : 'visible',
              'icon-allow-overlap': true
            },
            paint: {
              'icon-color': theme.color?.primary,
              'icon-halo-color': theme.color?.base,
              'icon-halo-width': 1
            },
            maxzoom: minZoom,
            metadata: {
              layerOrderPosition: 'markers'
            }
          };
          sources = {
            ...sources,
            [pointsSourceId]: pointsSource as AnySourceImpl
          };
          layers = [...layers, pointsLayer];
        }

        updateStyle({
          generatorId,
          sources,
          layers
        });
      }

      run();

      return () => {
        controller.abort();
      };
    },
    // sourceParams not included, but using a stringified version of it to detect changes (haveSourceParamsChanged)
    [
      updateStyle,
      id,
      mosaicUrl,
      minZoom,
      points,
      haveSourceParamsChanged,
      isHidden,
      generatorId
    ]
  );

  //
  // Cleanup layers on unmount.
  //
  useEffect(() => {
    return () => {
      updateStyle({
        generatorId,
        sources: {},
        layers: []
      });
    };
  }, [updateStyle, generatorId]);

  //
  // Listen to mouse events on the markers layer
  //
  const onPointsClick = useCallback(
    (features) => {
      const bounds = JSON.parse(features[0].properties.bounds);
      mapInstance.fitBounds(bounds, { padding: FIT_BOUNDS_PADDING });
    },
    [mapInstance]
  );
  useLayerInteraction({
    layerId: `${id}-points`,
    mapInstance,
    onClick: onPointsClick
  });

  //
  // FitBounds when needed
  //
  const layerBounds = useMemo(
    () => (stacCollection.length ? getMergedBBox(stacCollection) : undefined),
    [stacCollection]
  );
  useFitBbox(mapInstance, !!isPositionSet, bounds, layerBounds);

  return null;
}
