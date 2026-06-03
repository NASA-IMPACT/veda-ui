import React, { useCallback, useEffect, useMemo, useState } from 'react';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';

import { RasterCogTimeseriesProps, StacItemWithAssets } from '../types';
import { FIT_BOUNDS_PADDING, getMergedBBox } from '../utils';
import useFitBbox from '../hooks/use-fit-bbox';
import useMaps from '../hooks/use-maps';
import FootprintsLayer from './footprints-layer';
import { useRequestStatus, STATUS_KEY } from './hooks';
import { RasterPaintLayer } from './raster-paint-layer';
import PaginationOverlay from './pagination-overlay';
import { useStacSearchPagination } from './use-stac-search-pagination';
import { userTzDate2utcString } from '$utils/date';
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

// Whether or not to print the request logs.
const LOG = process.env.NODE_ENV !== 'production';

// Default search limit for STAC search.
const DEFAULT_SEARCH_LIMIT = 500;

interface TileSource {
  id: string;
  tilesTemplate: string;
  bbox: [number, number, number, number];
  assetHref: string;
}

/**
 * Extracts the asset href from a STAC item, preferring S3 alternate if available.
 */
function getAssetHref(
  item: StacItemWithAssets,
  assetKey: string
): string | null {
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
 * Hook to build COG tile sources from STAC items.
 */
function useCogTileSources({
  id,
  stacItems,
  tileApiEndpointToUse,
  assetKey,
  changeStatus
}: {
  id: string;
  stacItems: StacItemWithAssets[];
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
                `RasterCogTimeseries: Asset '${assetKey}' not found in item ${item.id}`
              );
            }
            return acc;
          }

          // Use titiler's COG tile template directly so Mapbox can fetch
          // tiles without a tilejson round-trip per item.
          const tilesTemplate = `${tileApiEndpointToUse}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png`;

          return [
            ...acc,
            {
              id: `${id}-item-${i}`,
              tilesTemplate,
              bbox: item.bbox,
              assetHref
            }
          ];
        },
        []
      );

      if (LOG) {
        /* eslint-disable no-console */
        console.groupCollapsed(
          'RasterCogTimeseries %cBuilt tile sources',
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
      console.error('RasterCogTimeseries: Error building tile sources', error);
      setTileSources([]);
      changeStatus({ status: S_FAILED, context: STATUS_KEY.Layer });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, stacItems, tileApiEndpointToUse, assetKey]);

  return tileSources;
}

export function RasterCogTimeseries(props: RasterCogTimeseriesProps) {
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
  const dateStart = userTzDate2utcString(startOfDay(date));
  const dateEnd = userTzDate2utcString(endOfDay(date));
  const searchPayload = useMemo(
    () => ({
      collections: [stacCol],
      datetime: `${dateStart}/${dateEnd}`,
      limit: searchLimit
    }),
    [stacCol, dateStart, dateEnd, searchLimit]
  );
  const searchKey = `${stacCol}|${dateStart}|${dateEnd}|${stacApiEndpointToUse}|${searchLimit}|cog`;

  const {
    items: stacItems,
    footprints,
    pagination,
    loadMore
  } = useStacSearchPagination<StacItemWithAssets>({
    id,
    searchUrl,
    payload: searchPayload,
    searchKey,
    enabled: !!stacCol,
    changeStatus,
    logPrefix: 'RasterCogTimeseries',
    log: LOG
  });

  // Get asset key from sourceParams for tile params
  const assetKey = sourceParams?.assets || 'cog_default';

  const tileSources = useCogTileSources({
    id,
    stacItems,
    tileApiEndpointToUse,
    assetKey,
    changeStatus
  });

  // Listen to mouse events on the footprints layer
  const onFootprintsClick = useCallback(
    (features) => {
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
      {tileSources.map((source) => {
        return (
          <RasterPaintLayer
            key={source.id}
            id={source.id}
            tilesTemplate={source.tilesTemplate}
            tileParams={{
              url: source.assetHref,
              ...tileParams
            }}
            zoomExtent={zoomExtent}
            hidden={hidden}
            opacity={opacity}
            colorMap={colorMap}
            generatorOrder={generatorOrder}
            reScale={reScale}
            generatorPrefix='raster-cog-timeseries'
            onStatusChange={changeStatus}
          />
        );
      })}
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
