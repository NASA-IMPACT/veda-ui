import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import qs from 'qs';
import {
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
import { BaseGeneratorParams, StacFeature } from '../types';
import useMapStyle from '../hooks/use-map-style';
import {
  FIT_BOUNDS_PADDING,
  getFilterPayload,
  getMergedBBox,
  requestQuickCache
} from '../utils';
import useFitBbox from '../hooks/use-fit-bbox';
import useLayerInteraction from '../hooks/use-layer-interaction';
import { MARKER_LAYOUT } from '../hooks/use-custom-marker';
import useMaps from '../hooks/use-maps';
import useGeneratorParams from '../hooks/use-generator-params';

import {
  ActionStatus,
  S_FAILED,
  S_IDLE,
  S_LOADING,
  S_SUCCEEDED
} from '$utils/status';

// Whether or not to print the request logs.
const LOG = true;

export interface RasterTimeseriesProps extends BaseGeneratorParams {
  id: string;
  stacCol: string;
  date: Date;
  sourceParams?: Record<string, any>;
  zoomExtent?: number[];
  bounds?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isPositionSet?: boolean;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
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

export function RasterTimeseries(props: RasterTimeseriesProps) {
  const {
    id,
    stacCol,
    date,
    sourceParams,
    zoomExtent,
    bounds,
    onStatusChange,
    isPositionSet,
    hidden,
    opacity,
    stacApiEndpoint,
    tileApiEndpoint
  } = props;

  const { current: mapInstance } = useMaps();

  const theme = useTheme();
  const { updateStyle } = useMapStyle();

  const minZoom = zoomExtent?.[0] ?? 0;
  const generatorId = `raster-timeseries-${id}`;

  const stacApiEndpointToUse =
    stacApiEndpoint ?? process.env.API_STAC_ENDPOINT ?? '';
  const tileApiEndpointToUse =
    tileApiEndpoint ?? process.env.API_RASTER_ENDPOINT ?? '';

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
    if (!id || !stacCol) return;

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
            'RasterTimeseries %cLoading STAC features',
            'color: orange;',
            id
          );
        LOG && console.log('Payload', payload);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const responseData = await requestQuickCache<any>({
          url: `${stacApiEndpointToUse}/search`,
          payload,
          controller
        });

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'RasterTimeseries %cAdding STAC features',
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
            'RasterTimeseries %cAborted STAC features',
            'color: red;',
            id
          );
        // Temporarily turning on log for debugging
        /* eslint-disable-next-line no-console */
        console.log(error);
        return;
      }
    };
    load();
    return () => {
      controller.abort();
      changeStatus({ status: 'idle', context: STATUS_KEY.StacSearch });
    };
  }, [id, changeStatus, stacCol, date, stacApiEndpointToUse]);

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
    if (!id || !stacCol) return;

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
            'RasterTimeseries %cLoading Mosaic',
            'color: orange;',
            id
          );
        LOG && console.log('Payload', payload);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const responseData = await requestQuickCache<any>({
          url: `${tileApiEndpointToUse}/mosaic/register`,
          payload,
          controller
        });

        setMosaicUrl(responseData.links[1].href);

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'RasterTimeseries %cAdding Mosaic',
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
          console.log('RasterTimeseries %cAborted Mosaic', 'color: red;', id);
        return;
      }
    };

    load();

    return () => {
      controller.abort();
      changeStatus({ status: 'idle', context: STATUS_KEY.Layer });
    };
  }, [
    stacCollection
    // This hook depends on a series of properties, but whenever they change the
    // `stacCollection` is guaranteed to change because a new STAC request is
    // needed to show the data. The following properties are therefore removed
    // from the dependency array:
    // - id
    // - changeStatus
    // - stacCol
    // - date
    // Keeping then in would cause multiple requests because for example when
    // `date` changes the hook runs, then the STAC request in the hook above
    // fires and `stacCollection` changes, causing this hook to run again. This
    // resulted in a race condition when adding the source to the map leading to
    // an error.
  ]);

  //
  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );

  const generatorParams = useGeneratorParams(props);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      let layers: AnyLayer[] = [];
      let sources: Record<string, AnySourceImpl> = {};

      if (mosaicUrl) {
        const tileParams = qs.stringify(
          {
            assets: 'cog_default',
            ...(sourceParams ?? {})
          },
          // Temporary solution to pass different tile parameters for hls data
          {
            arrayFormat: id.toLowerCase().includes('hls') ? 'repeat' : 'comma'
          }
        );

        const tilejsonUrl = `${mosaicUrl}?${tileParams}`;
        try {
          const tilejsonData = await requestQuickCache<any>({
            url: tilejsonUrl,
            method: 'GET',
            payload: null,
            controller
          });
          const tileServerUrl = tilejsonData.tiles[0];

          const wmtsBaseUrl = mosaicUrl.replace(
            'tilejson.json',
            'WMTSCapabilities.xml'
          );

          const mosaicSource: RasterSource = {
            type: 'raster',
            url: tilejsonUrl
          };

          const rasterOpacity = typeof opacity === 'number' ? opacity / 100 : 1;

          const mosaicLayer: RasterLayer = {
            id: id,
            type: 'raster',
            source: id,
            layout: {
              visibility: hidden ? 'none' : 'visible'
            },
            paint: {
              'raster-opacity': hidden ? 0 : rasterOpacity,
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
        } catch (error) {
          if (!controller.signal.aborted) {
            sources = {};
            layers = [];
            changeStatus({
              status: S_FAILED,
              context: STATUS_KEY.StacSearch
            });
          }

          LOG &&
            /* eslint-disable-next-line no-console */
            console.log(
              'MapLayerRasterTimeseries %cAborted Mosaic',
              'color: red;',
              id
            );
          // Continue to the style is updated to empty.
        }
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
            ...(MARKER_LAYOUT as any),
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
        layers,
        params: generatorParams
      });
    }

    run();

    return () => {
      controller.abort();
    };
  }, [
    mosaicUrl,
    points,
    minZoom,
    haveSourceParamsChanged,
    generatorParams
    // This hook depends on a series of properties, but whenever they change the
    // `mosaicUrl` is guaranteed to change because a new STAC request is
    // needed to show the data. The following properties are therefore removed
    // from the dependency array:
    // - id
    // - changeStatus
    // - stacCol
    // - date
    // Keeping then in would cause multiple requests because for example when
    // `date` changes the hook runs, then the request in the hook above
    // fires and `mosaicUrl` changes, causing this hook to run again. This
    // resulted in a race condition when adding the source to the map leading to
    // an error.
    // Other:
    // -- generatorParams includes hidden and opacity
    // -- sourceParams is tracked by haveSourceParamsChanged
    // -- theme and updateStyle are stable
  ]);

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
      mapInstance?.fitBounds(bounds, { padding: FIT_BOUNDS_PADDING });
    },
    [mapInstance]
  );
  useLayerInteraction({
    layerId: `${id}-points`,
    onClick: onPointsClick
  });

  //
  // FitBounds when needed
  //
  const layerBounds = useMemo(
    () => (stacCollection.length ? getMergedBBox(stacCollection) : undefined),
    [stacCollection]
  );
  useFitBbox(!!isPositionSet, bounds, layerBounds);

  return null;
}
