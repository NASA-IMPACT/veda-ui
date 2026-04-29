/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

// Whether or not to print the request logs.
const LOG = process.env.NODE_ENV !== 'production' ? true : false;

// Default search limit for STAC search
const DEFAULT_SEARCH_LIMIT = 500;

interface StacLink {
  rel: string;
  href: string;
  method?: string;
  body?: Record<string, unknown>;
}

interface StacSearchResponse {
  features: StacFeature[];
  context?: {
    matched?: number;
    returned?: number;
  };
  numberMatched?: number;
  numberReturned?: number;
  links?: StacLink[];
}

interface PaginationState {
  hasMore: boolean;
  totalMatched: number;
  loadedCount: number;
  isLoadingMore: boolean;
  nextLink: StacLink | null;
}

export function useStacResponse({
  id,
  changeStatus,
  stacCol,
  date,
  stacApiEndpointToUse,
  searchLimit
}: {
  id: string;
  changeStatus: (params: { status: string; context: STATUS_KEY }) => void;
  stacCol: string;
  date: Date;
  stacApiEndpointToUse: string;
  searchLimit: number;
}): {
  stacCollection: StacFeature[];
  footprints: Array<{ bounds: [[number, number], [number, number]] }> | null;
  pagination: PaginationState;
  loadMore: () => void;
} {
  //
  // Load stac collection features
  //
  const [stacCollection, setStacCollection] = useState<StacFeature[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    hasMore: false,
    totalMatched: 0,
    loadedCount: 0,
    isLoadingMore: false,
    nextLink: null
  });

  // Reset when date or collection changes
  useEffect(() => {
    setStacCollection([]);
    setPagination({
      hasMore: false,
      totalMatched: 0,
      loadedCount: 0,
      isLoadingMore: false,
      nextLink: null
    });
  }, [stacCol, date, stacApiEndpointToUse]);

  useEffect(() => {
    if (!id || !stacCol) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        changeStatus({ status: S_LOADING, context: STATUS_KEY.StacSearch });
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(date, stacCol),
          limit: searchLimit,
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

        const responseData = await requestQuickCache<StacSearchResponse>({
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

        const features = responseData.features || [];
        const totalMatched =
          responseData.context?.matched ||
          responseData.numberMatched ||
          features.length;
        const nextLink = responseData.links?.find((l) => l.rel === 'next');

        setStacCollection(features);
        setPagination({
          hasMore: !!nextLink,
          totalMatched,
          loadedCount: features.length,
          isLoadingMore: false,
          nextLink: nextLink || null
        });
        changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.StacSearch });
      } catch (error) {
        if (!controller.signal.aborted) {
          setStacCollection([]);
          setPagination({
            hasMore: false,
            totalMatched: 0,
            loadedCount: 0,
            isLoadingMore: false,
            nextLink: null
          });
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
  }, [id, changeStatus, stacCol, date, stacApiEndpointToUse, searchLimit]);

  const loadMore = useCallback(async () => {
    if (!pagination.nextLink || pagination.isLoadingMore) return;

    setPagination((prev) => ({ ...prev, isLoadingMore: true }));

    try {
      const controller = new AbortController();
      let responseData: StacSearchResponse;

      // Handle both GET and POST next links
      if (pagination.nextLink.method === 'POST' && pagination.nextLink.body) {
        responseData = await requestQuickCache<StacSearchResponse>({
          url: pagination.nextLink.href,
          payload: pagination.nextLink.body,
          controller
        });
      } else {
        responseData = await requestQuickCache<StacSearchResponse>({
          url: pagination.nextLink.href,
          payload: null,
          controller
        });
      }

      const newFeatures = responseData.features || [];
      const nextLink = responseData.links?.find((l) => l.rel === 'next');

      setStacCollection((prev) => [...prev, ...newFeatures]);
      setPagination((prev) => ({
        ...prev,
        hasMore: !!nextLink,
        loadedCount: prev.loadedCount + newFeatures.length,
        isLoadingMore: false,
        nextLink: nextLink || null
      }));
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error('Error loading more items:', error);
      setPagination((prev) => ({ ...prev, isLoadingMore: false }));
    }
  }, [pagination.nextLink, pagination.isLoadingMore]);

  //
  // Footprints to show where the data is when zoom is low
  //
  const footprints = useMemo(() => {
    if (!stacCollection.length) return null;
    return stacCollection.map((f) => {
      const [w, s, e, n] = f.bbox;
      return {
        bounds: [
          [w, s],
          [e, n]
        ] as [[number, number], [number, number]]
      };
    });
  }, [stacCollection]);

  return { stacCollection, footprints, pagination, loadMore };
}

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
  useEffect(() => {
    if (!id || !stacCol) return;

    // If the search returned no data, remove anything previously there so we
    // don't run the risk that the selected date and data don't match, even
    // though if a search returns no data, that date should not be available for
    // the dataset - may be a case of bad configuration.
    if (!stacCollection.length) {
      setMosaicUrl(undefined);
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

  const { stacCollection, footprints, pagination, loadMore } = useStacResponse({
    id,
    changeStatus,
    stacCol,
    date,
    stacApiEndpointToUse,
    searchLimit
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
