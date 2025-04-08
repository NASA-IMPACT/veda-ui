/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import qs from 'qs';
import {
  LayerSpecification,
  SourceSpecification,
  LngLatBoundsLike,
  RasterLayerSpecification,
  RasterSourceSpecification
} from 'mapbox-gl';
import { RasterTimeseriesProps, StacFeature } from '../types';
import useMapStyle from '../hooks/use-map-style';
import {
  FIT_BOUNDS_PADDING,
  getFilterPayload,
  getMergedBBox,
  requestQuickCache
} from '../utils';
import useFitBbox from '../hooks/use-fit-bbox';
import useMaps from '../hooks/use-maps';
import useGeneratorParams from '../hooks/use-generator-params';

import PointsLayer from './points-layer';

import {
  ActionStatus,
  S_FAILED,
  S_IDLE,
  S_LOADING,
  S_SUCCEEDED
} from '$utils/status';

// Whether or not to print the request logs.
const LOG = true;

export enum STATUS_KEY {
  Global,
  Layer,
  StacSearch
}

interface UseRequestStatusParams {
  id: string;
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  requestsToTrack: STATUS_KEY[];
}

// Some layers require multiple requests to load the layer
// ex. raster-timeseries require stac (low zoom markers, metadata) & mosaic (for raster data tiling)
export function useRequestStatus({
  id,
  onStatusChange,
  requestsToTrack = []
}: UseRequestStatusParams) {
  const initialStatuses = {
    // Global flag to track all the requests
    global: (requestsToTrack.length ? S_IDLE : S_SUCCEEDED) as ActionStatus,
    ...requestsToTrack.reduce(
      (acc, context) => ({
        ...acc,
        [context]: S_IDLE
      }),
      {}
    )
  };

  const statuses = useRef(initialStatuses);

  const changeStatus = useCallback(
    ({ status, context }: { status: ActionStatus; context: STATUS_KEY }) => {
      statuses.current[context] = status;
      const layersToCheck = requestsToTrack.map(
        (context) => statuses.current[context]
      );

      let newStatus = statuses.current.global;
      // All layers must succeed to be considered successful.
      if (layersToCheck.every((s) => s === S_SUCCEEDED)) {
        newStatus = S_SUCCEEDED;
      } else if (layersToCheck.some((s) => s === S_FAILED)) {
        newStatus = S_FAILED;
      } else if (layersToCheck.some((s) => s === S_LOADING)) {
        newStatus = S_LOADING;
      } else if (layersToCheck.some((s) => s === S_IDLE)) {
        newStatus = S_IDLE;
      }

      // Only emit when layers statuses change
      if (newStatus !== statuses.current[STATUS_KEY.Global]) {
        statuses.current[STATUS_KEY.Global] = newStatus;
        onStatusChange?.({ status: newStatus, id });
      }
    },
    [id, onStatusChange, requestsToTrack]
  );

  return {
    changeStatus,
    statuses: statuses.current
  };
}

export function useStacResponse({
  id,
  changeStatus,
  stacCol,
  date,
  stacApiEndpointToUse
}): [
  StacFeature[],
  Array<{ bounds: LngLatBoundsLike; center: [number, number] }> | null
] {
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

        if (LOG) {
          /* eslint-disable no-console */
          console.groupCollapsed(
            'RasterTimeseries %cLoading STAC features',
            'color: orange;',
            id
          );
          console.log('Payload', payload);
          console.groupEnd();
          /* eslint-enable no-console */
        }

        const responseData = await requestQuickCache<{
          features: StacFeature[];
        }>({
          url: `${stacApiEndpointToUse}/search`,
          payload,
          controller
        });

        if (LOG) {
          /* eslint-disable no-console */
          console.groupCollapsed(
            'RasterTimeseries %cAdding STAC features',
            'color: green;',
            id
          );
          console.log('STAC response', responseData);
          console.groupEnd();
          /* eslint-enable no-console */
        }

        setStacCollection(responseData.features);
        changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.StacSearch });
      } catch (error) {
        if (!controller.signal.aborted) {
          setStacCollection([]);
          changeStatus({ status: S_FAILED, context: STATUS_KEY.StacSearch });
        }
        if (LOG)
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
  // Markers to show where the data is when zoom is low
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

  return [stacCollection, points];
}

function useMosaicUrl({
  id,
  stacCol,
  date,
  colorMap,
  stacCollection,
  changeStatus,
  tileApiEndpointToUse
}) {
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

        if (LOG) {
          /* eslint-disable no-console */
          console.groupCollapsed(
            'RasterTimeseries %cLoading Mosaic',
            'color: orange;',
            id
          );
          console.log('Payload', payload);
          console.groupEnd();
          /* eslint-enable no-console */
        }

        let responseData;

        try {
          responseData = await requestQuickCache<any>({
            url: `${tileApiEndpointToUse}/searches/register`,
            payload,
            controller
          });
          const mosaicUrl = responseData.links[1].href;
          setMosaicUrl(
            mosaicUrl.replace('/{tileMatrixSetId}', '/WebMercatorQuad')
          );
        } catch (error) {
          // @NOTE: conditional logic TO BE REMOVED once new BE endpoints have moved to prod... Fallback on old request url if new endpoints error with nonexistance...
          if (error.request) {
            // The request was made but no response was received
            responseData = await requestQuickCache<any>({
              url: `${tileApiEndpointToUse}/mosaic/register`, // @NOTE: This will fail anyways with "staging-raster.delta-backend.com" because its already deprecated...
              payload,
              controller
            });

            const mosaicUrl = responseData.links[1].href;
            setMosaicUrl(mosaicUrl);
          } else {
            if (LOG)
              /* eslint-disable-next-line no-console */
              console.log(
                'Titiler /register %cEndpoint error',
                'color: red;',
                error
              );
            throw error;
          }
        }

        /* eslint-disable no-console */
        if (LOG) {
          console.groupCollapsed(
            'RasterTimeseries %cAdding Mosaic',
            'color: green;',
            id
          );
          // links[0] : metadata , links[1]: tile
          console.log('Url', responseData.links[1].href);
          console.log('STAC response', responseData);
          console.groupEnd();
        }
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
    colorMap,
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
  return [mosaicUrl];
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
    tileApiEndpoint,
    colorMap,
    reScale,
    envApiStacEndpoint,
    envApiRasterEndpoint
  } = props;

  const { updateStyle } = useMapStyle();

  const { current: mapInstance } = useMaps();
  const minZoom = zoomExtent?.[0] ?? 0;
  const generatorId = `raster-timeseries-${id}`;

  const stacApiEndpointToUse = stacApiEndpoint ?? envApiStacEndpoint ?? '';
  const tileApiEndpointToUse = tileApiEndpoint ?? envApiRasterEndpoint ?? '';

  const { changeStatus } = useRequestStatus({
    id,
    onStatusChange,
    requestsToTrack: [STATUS_KEY.StacSearch, STATUS_KEY.Layer]
  });

  const [stacCollection, points] = useStacResponse({
    id,
    changeStatus,
    stacCol,
    date,
    stacApiEndpointToUse
  });

  const [mosaicUrl] = useMosaicUrl({
    id,
    stacCol,
    date,
    colorMap,
    stacCollection,
    changeStatus,
    tileApiEndpointToUse
  });

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
      let layers: LayerSpecification[] = [];
      let sources: Record<string, SourceSpecification> = {};

      if (mosaicUrl) {
        const tileParams = qs.stringify(
          {
            assets: 'cog_default',
            ...(sourceParams ?? {}),
            ...(colorMap && { colormap_name: colorMap }),
            ...(reScale && { rescale: Object.values(reScale) })
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

          const mosaicSource: RasterSourceSpecification = {
            type: 'raster',
            url: tilejsonUrl
          };

          const rasterOpacity = typeof opacity === 'number' ? opacity / 100 : 1;

          const mosaicLayer: RasterLayerSpecification = {
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

          if (LOG)
            /* eslint-disable-next-line no-console */
            console.log(
              'MapLayerRasterTimeseries %cAborted Mosaic',
              'color: red;',
              id
            );
          // Continue to the style is updated to empty.
        }
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
    colorMap,
    reScale,
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

  //
  // FitBounds when needed
  //
  const layerBounds = useMemo(
    () => (stacCollection?.length ? getMergedBBox(stacCollection) : undefined),
    [stacCollection]
  );
  useFitBbox(!!isPositionSet, bounds, layerBounds);

  return (
    <PointsLayer
      id={id}
      points={points}
      zoomExtent={zoomExtent}
      onPointsClick={onPointsClick}
    />
  );
}
