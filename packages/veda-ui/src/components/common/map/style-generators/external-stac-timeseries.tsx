import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LngLatBoundsLike } from 'mapbox-gl';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';

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
 * Hook to fetch STAC items from an external STAC server.
 * Similar to useStacResponse but fetches full item data including assets.
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
}): [
  ExternalStacItem[],
  Array<{ bounds: LngLatBoundsLike; center: [number, number] }> | null
] {
  const [stacItems, setStacItems] = useState<ExternalStacItem[]>([]);

  useEffect(() => {
    if (!id || !stacCol) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        changeStatus({ status: S_LOADING, context: STATUS_KEY.StacSearch });

        const searchUrl = `${stacApiEndpointToUse}/search`;

        // Build search payload using standard STAC parameters
        // Use 'collections' array (universally supported) instead of CQL2 filter for collection
        // This ensures compatibility with external STAC servers that may use different CQL2 operators
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

        const responseData = await requestQuickCache<{
          features: ExternalStacItem[];
        }>({
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

        setStacItems(responseData.features);
        changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.StacSearch });
      } catch (error) {
        if (!controller.signal.aborted) {
          setStacItems([]);
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

  // Markers to show where the data is when zoom is low
  const points = useMemo(() => {
    if (!stacItems.length) return null;
    const pts = stacItems.map((f) => {
      const [w, s, e, n] = f.bbox;
      return {
        bounds: [
          [w, s],
          [e, n]
        ] as LngLatBoundsLike,
        center: [(w + e) / 2, (s + n) / 2] as [number, number]
      };
    });

    return pts;
  }, [stacItems]);

  return [stacItems, points];
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

  const [stacItems, points] = useExternalStacSearch({
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
    (features) => {
      const b = JSON.parse(features[0].properties.bounds);
      mapInstance?.fitBounds(b, { padding: FIT_BOUNDS_PADDING });
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
    </>
  );
}
