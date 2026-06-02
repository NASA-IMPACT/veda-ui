/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { RasterTimeseriesProps, StacFeature } from '../types';
import {
  FIT_BOUNDS_PADDING,
  getFilterPayload,
  getMergedBBox,
  requestQuickCache
} from '../utils';
import useFitBbox from '../hooks/use-fit-bbox';
import useMaps from '../hooks/use-maps';

import FootprintsLayer from './footprints-layer';
import { useRequestStatus, STATUS_KEY } from './hooks';
import { RasterPaintLayer } from './raster-paint-layer';
import PaginationOverlay from './pagination-overlay';
import { useStacSearchPagination } from './use-stac-search-pagination';
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

// Whether or not to print the request logs.
const LOG = process.env.NODE_ENV !== 'production';

// Default search limit for STAC search.
// Note: in mosaic mode this only bounds the items we *fetch* for footprints
// and pagination UX. The rendered tiles come from the server-side mosaic
// register, which uses the same CQL filter and therefore covers all matching
// items regardless of `searchLimit`. Update the JSDoc on `searchLimit` in the
// dataset config if this behavior changes.
const DEFAULT_SEARCH_LIMIT = 500;

function useMosaicUrl({
  id,
  stacCol,
  date,
  stacCollection,
  changeStatus,
  tileApiEndpointToUse
}) {
  //
  // Tiles
  //
  const [mosaicUrl, setMosaicUrl] = useState<string | undefined>(undefined);
  // Track the count we registered for. Pagination only grows stacCollection;
  // its filter (date+collection) is unchanged, so a re-register would just
  // produce a duplicate request and cause the mapbox source to flicker.
  const registeredForCountRef = useRef<number>(0);
  useEffect(() => {
    if (!id || !stacCol) return;

    // If the search returned no data, remove anything previously there so we
    // don't run the risk that the selected date and data don't match, even
    // though if a search returns no data, that date should not be available for
    // the dataset - may be a case of bad configuration.
    if (!stacCollection.length) {
      registeredForCountRef.current = 0;
      setMosaicUrl(undefined);
      return;
    }

    // Skip re-registration when stacCollection only grew via pagination.
    if (
      registeredForCountRef.current > 0 &&
      stacCollection.length > registeredForCountRef.current
    ) {
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

        const responseData = await requestQuickCache<any>({
          url: `${tileApiEndpointToUse}/searches/register`,
          payload,
          controller
        });
        const mosaicUrl = responseData.links[1].href;
        setMosaicUrl(
          mosaicUrl.replace('/{tileMatrixSetId}', '/WebMercatorQuad')
        );
        registeredForCountRef.current = stacCollection.length;

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        if (!controller.signal.aborted) {
          changeStatus({ status: S_FAILED, context: STATUS_KEY.Layer });
        }
        if (LOG)
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
    // Note: pagination also mutates `stacCollection` (appending to it) but
    // does not require re-registration; that case is handled inside the effect
    // via `registeredForCountRef`.
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
    generatorOrder,
    stacApiEndpoint,
    tileApiEndpoint,
    colorMap,
    reScale,
    envApiStacEndpoint,
    envApiRasterEndpoint,
    searchLimit = DEFAULT_SEARCH_LIMIT
  } = props;

  const { current: mapInstance } = useMaps();

  const stacApiEndpointToUse = stacApiEndpoint ?? envApiStacEndpoint ?? '';
  const tileApiEndpointToUse = tileApiEndpoint ?? envApiRasterEndpoint ?? '';

  const { changeStatus } = useRequestStatus({
    id,
    onStatusChange,
    requestsToTrack: [STATUS_KEY.StacSearch, STATUS_KEY.Layer]
  });

  const searchUrl = `${stacApiEndpointToUse}/search`;
  const searchPayload = useMemo(
    () => ({
      'filter-lang': 'cql2-json',
      filter: getFilterPayload(date, stacCol),
      limit: searchLimit,
      fields: {
        include: ['bbox'],
        exclude: ['collection', 'links']
      }
    }),
    [date, stacCol, searchLimit]
  );
  const searchKey = `${stacCol}|${date.toISOString()}|${stacApiEndpointToUse}|${searchLimit}|mosaic`;

  const {
    items: stacCollection,
    footprints,
    pagination,
    loadMore
  } = useStacSearchPagination<StacFeature>({
    id,
    searchUrl,
    payload: searchPayload,
    searchKey,
    enabled: !!stacCol,
    changeStatus,
    logPrefix: 'RasterTimeseries',
    log: LOG
  });

  const [mosaicUrl] = useMosaicUrl({
    id,
    stacCol,
    date,
    stacCollection,
    changeStatus,
    tileApiEndpointToUse
  });

  //
  // Listen to mouse events on the footprints layer
  //
  const onFootprintsClick = useCallback(
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
    <>
      {footprints && (
        <FootprintsLayer
          id={id}
          footprints={footprints}
          zoomExtent={zoomExtent}
          hidden={hidden}
          opacity={opacity}
          generatorOrder={generatorOrder}
          onFootprintsClick={onFootprintsClick}
        />
      )}
      {mosaicUrl && (
        <RasterPaintLayer
          id={id}
          tileApiEndpoint={mosaicUrl}
          tileParams={{ assets: ['cog_default'], ...sourceParams }}
          zoomExtent={zoomExtent}
          hidden={hidden}
          opacity={opacity}
          colorMap={colorMap}
          generatorOrder={generatorOrder}
          reScale={reScale}
          generatorPrefix='raster-timeseries'
          onStatusChange={changeStatus}
          metadataFormatter={(tilejsonData, tileParamsAsString) => {
            const wmtsBaseUrl = mosaicUrl.replace(
              'tilejson.json',
              'WMTSCapabilities.xml'
            );
            return {
              xyzTileUrl: tilejsonData?.tiles[0],
              wmtsTileUrl: `${wmtsBaseUrl}?${tileParamsAsString}`
            };
          }}
        />
      )}
      {pagination.hasMore && !hidden && (
        <PaginationOverlay
          loadedCount={pagination.loadedCount}
          totalMatched={pagination.totalMatched}
          isLoadingMore={pagination.isLoadingMore}
          onLoadMore={loadMore}
        />
      )}
    </>
  );
}
