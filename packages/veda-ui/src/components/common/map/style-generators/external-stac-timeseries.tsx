import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LngLatBoundsLike } from 'mapbox-gl';
import styled from 'styled-components';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { Button } from '@devseed-ui/button';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { ExternalStacTimeseriesProps, ExternalStacItem } from '../types';
import { FIT_BOUNDS_PADDING, getMergedBBox, requestQuickCache } from '../utils';
import useFitBbox from '../hooks/use-fit-bbox';
import useMaps from '../hooks/use-maps';
import PointsLayer from './points-layer';
import { useRequestStatus, STATUS_KEY } from './hooks';
import { RasterPaintLayer } from './raster-paint-layer';
import { userTzDate2utcString } from '$utils/date';
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

// Whether or not to print the request logs.
const LOG = process.env.NODE_ENV !== 'production' ? true : false;

interface TileSource {
  id: string;
  tileUrl: string;
  bbox: [number, number, number, number];
}

interface StacLink {
  rel: string;
  href: string;
  method?: string;
  body?: Record<string, unknown>;
}

interface StacSearchResponse {
  features: ExternalStacItem[];
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

const PaginationOverlay = styled.div`
  position: absolute;
  bottom: ${glsp(1)};
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: ${themeVal('color.surface')};
  padding: ${glsp(0.5, 1)};
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: ${themeVal('boxShadow.elevationA')};
  display: flex;
  align-items: center;
  gap: ${glsp(0.5)};
  font-size: 0.875rem;
`;

/**
 * Extracts the asset href from a STAC item, preferring S3 alternate if available.
 */
function getAssetHref(item: ExternalStacItem, assetKey: string): string | null {
  const asset = item.assets[assetKey];
  if (!asset) {
    return null;
  }

  // Prefer S3 alternate if available (usually faster for titiler)
  if (asset.alternate?.s3?.href) {
    return asset.alternate.s3.href;
  }

  return asset.href;
}

/**
 * Hook to fetch STAC items from an external STAC server with pagination support.
 */
function useExternalStacSearch({
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
  stacItems: ExternalStacItem[];
  points: Array<{ bounds: LngLatBoundsLike; center: [number, number] }> | null;
  pagination: PaginationState;
  loadMore: () => void;
} {
  const [stacItems, setStacItems] = useState<ExternalStacItem[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    hasMore: false,
    totalMatched: 0,
    loadedCount: 0,
    isLoadingMore: false,
    nextLink: null
  });

  // Reset when date or collection changes
  useEffect(() => {
    setStacItems([]);
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

        const searchUrl = `${stacApiEndpointToUse}/search`;

        // Build search payload using standard STAC parameters
        const payload = {
          collections: [stacCol],
          datetime: `${userTzDate2utcString(
            startOfDay(date)
          )}/${userTzDate2utcString(endOfDay(date))}`,
          limit: searchLimit
        };

        if (LOG) {
          /* eslint-disable no-console */
          console.groupCollapsed(
            'ExternalStacTimeseries %cLoading STAC items',
            'color: orange;',
            id
          );
          console.log('Search URL', searchUrl);
          console.log('Payload', payload);
          console.groupEnd();
          /* eslint-enable no-console */
        }

        const responseData = await requestQuickCache<StacSearchResponse>({
          url: searchUrl,
          payload,
          controller
        });

        if (LOG) {
          /* eslint-disable no-console */
          console.groupCollapsed(
            'ExternalStacTimeseries %cReceived STAC items',
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

        setStacItems(features);
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
          setStacItems([]);
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
            'ExternalStacTimeseries %cAborted STAC search',
            'color: red;',
            id
          );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, stacCol, date, stacApiEndpointToUse, searchLimit]);

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

      setStacItems((prev) => [...prev, ...newFeatures]);
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

  // Markers to show where the data is when zoom is low
  const points = useMemo(() => {
    if (!stacItems.length) return null;
    const points = stacItems.map((f) => {
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
  }, [stacItems]);

  return { stacItems, points, pagination, loadMore };
}

/**
 * Hook to build COG tile sources from STAC items.
 */
function useExternalStacTileSources({
  id,
  stacItems,
  tileApiEndpointToUse,
  assetKey,
  changeStatus
}: {
  id: string;
  stacItems: ExternalStacItem[];
  tileApiEndpointToUse: string;
  assetKey: string;
  changeStatus: (params: { status: string; context: STATUS_KEY }) => void;
}): TileSource[] {
  const [tileSources, setTileSources] = useState<TileSource[]>([]);

  useEffect(() => {
    if (!stacItems.length) {
      setTileSources([]);
      return;
    }

    changeStatus({ status: S_LOADING, context: STATUS_KEY.Layer });

    try {
      const sources: TileSource[] = stacItems.reduce<TileSource[]>(
        (acc, item, i) => {
          const assetHref = getAssetHref(item, assetKey);

          if (!assetHref) {
            if (LOG) {
              /* eslint-disable-next-line no-console */
              console.warn(
                `ExternalStacTimeseries: Asset '${assetKey}' not found in item ${item.id}`
              );
            }
            return acc;
          }

          // Build the COG tile URL
          // titiler COG endpoint: /cog/tiles/{tileMatrixSetId}/{z}/{x}/{y}.png
          const tileUrl = `${tileApiEndpointToUse}/cog/WebMercatorQuad/tilejson.json`;

          return [
            ...acc,
            {
              id: `${id}-item-${i}`,
              tileUrl,
              bbox: item.bbox
            }
          ];
        },
        []
      );

      if (LOG) {
        /* eslint-disable no-console */
        console.groupCollapsed(
          'ExternalStacTimeseries %cBuilt tile sources',
          'color: green;',
          id
        );
        console.log('Sources', sources);
        console.groupEnd();
        /* eslint-enable no-console */
      }

      setTileSources(sources);
      changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.Layer });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(
        'ExternalStacTimeseries: Error building tile sources',
        error
      );
      setTileSources([]);
      changeStatus({ status: S_FAILED, context: STATUS_KEY.Layer });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, stacItems, tileApiEndpointToUse, assetKey]);

  return tileSources;
}

// Default search limit for STAC search
const DEFAULT_SEARCH_LIMIT = 500;

export function ExternalStacTimeseries(props: ExternalStacTimeseriesProps) {
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

  const { stacItems, points, pagination, loadMore } = useExternalStacSearch({
    id,
    changeStatus,
    stacCol,
    date,
    stacApiEndpointToUse,
    searchLimit
  });

  // Get asset key from sourceParams for tile params
  const assetKey = sourceParams?.assets || 'cog_default';

  const tileSources = useExternalStacTileSources({
    id,
    stacItems,
    tileApiEndpointToUse,
    assetKey,
    changeStatus
  });

  // Listen to mouse events on the markers layer
  const onPointsClick = useCallback(
    (features: { properties: { bounds: string } }[]) => {
      const bounds = JSON.parse(features[0].properties.bounds);
      mapInstance?.fitBounds(bounds, { padding: FIT_BOUNDS_PADDING });
    },
    [mapInstance]
  );

  // FitBounds when needed
  const layerBounds = useMemo(
    () => (stacItems?.length ? getMergedBBox(stacItems) : undefined),
    [stacItems]
  );
  useFitBbox(!!isPositionSet, bounds, layerBounds);

  // Build tile params without the 'assets' key (it's used for asset selection, not tile rendering)
  const tileParams = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { assets: _, ...rest } = sourceParams || {};
    return rest;
  }, [sourceParams]);

  return (
    <>
      {points && (
        <PointsLayer
          id={id}
          points={points}
          zoomExtent={zoomExtent}
          onPointsClick={onPointsClick}
        />
      )}
      {tileSources.map((source, index) => {
        // Get the asset href for this item to pass to the COG endpoint
        const item = stacItems[index];
        const assetHref = item ? getAssetHref(item, assetKey) : null;

        if (!assetHref) return null;

        return (
          <RasterPaintLayer
            key={source.id}
            id={source.id}
            tileApiEndpoint={source.tileUrl}
            tileParams={{
              url: assetHref,
              ...tileParams
            }}
            zoomExtent={zoomExtent}
            hidden={hidden}
            opacity={opacity}
            colorMap={colorMap}
            generatorOrder={generatorOrder}
            reScale={reScale}
            generatorPrefix='external-stac-timeseries'
            onStatusChange={changeStatus}
            metadataFormatter={(tilejsonData) => {
              return {
                xyzTileUrl: tilejsonData?.tiles[0]
              };
            }}
          />
        );
      })}
      {pagination.hasMore && !hidden && (
        <PaginationOverlay>
          <span>
            Showing {pagination.loadedCount} of {pagination.totalMatched} items
          </span>
          <Button
            size='small'
            onClick={loadMore}
            disabled={pagination.isLoadingMore}
          >
            {pagination.isLoadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </PaginationOverlay>
      )}
    </>
  );
}
