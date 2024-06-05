import axios, { AxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { FeatureCollection, Polygon } from 'geojson';
import { DatasetLayer } from 'veda';

import { MAX_QUERY_NUM } from '../constants';
import { getFilterPayload, combineFeatureCollection } from '../utils';
import EventEmitter from './mini-events';
import { ConcurrencyManager, ConcurrencyManagerInstance } from './concurrency';
import { TimeDensity } from '$context/layer-data';

export const TIMESERIES_DATA_BASE_ID = 'analysis';

export interface TimeseriesDataUnit {
  date: string;
  min: number;
  max: number;
  mean: number;
  count: number;
  sum: number;
  std: number;
  median: number;
  majority: number;
  minority: number;
  unique: number;
  histogram: [number[], number[]];
  valid_percent: number;
  masked_pixels: number;
  valid_pixels: number;
  percentile_2: number;
  percentile_98: number;
}

export interface TimeseriesDataResult {
  isPeriodic: boolean;
  timeDensity: TimeDensity;
  domain: string[];
  timeseries: TimeseriesDataUnit[];
}

export interface TimeseriesMissingSummaries {
  isPeriodic: boolean;
  timeDensity: TimeDensity;
  domain: string[];
  timeseries?: unknown;
}

// Different options based on status.
export type TimeseriesData =
  | {
      id: string;
      name: string;
      status: 'loading';
      layer: DatasetLayer;
      meta: {
        total: null | number;
        loaded: null | number;
      };
      data: null;
      error: null;
    }
  | {
      id: string;
      name: string;
      status: 'succeeded';
      layer: DatasetLayer;
      meta: {
        total: number;
        loaded: number;
      };
      data: TimeseriesDataResult;
      error: null;
    }
  | {
      id: string;
      name: string;
      status: 'errored';
      layer: DatasetLayer;
      meta: {
        total: null | number;
        loaded: null | number;
      };
      data: null;
      error: Error;
    };

// Restrict events for the requester.
interface StacDatasetsTimeseriesEvented {
  on: (
    event: 'data',
    callback: (data: TimeseriesData, index: number) => void
  ) => void;
  off: (event: 'data') => void;
}

export function requestStacDatasetsTimeseries({
  start,
  end,
  aoi,
  layers,
  queryClient,
  signal
}: {
  start: Date;
  end: Date;
  aoi: FeatureCollection<Polygon>;
  layers: DatasetLayer[];
  queryClient: QueryClient;
  signal: AbortSignal;
}) {
  const eventEmitter = EventEmitter();

  const concurrencyManager = ConcurrencyManager();

  // On abort clear the queue.
  signal.addEventListener(
    'abort',
    () => {
      queryClient.cancelQueries([TIMESERIES_DATA_BASE_ID]);
      concurrencyManager.clear();
    },
    { once: true }
  );

  // Start the request for each layer.
  layers.forEach(async (layer, index) => {
    requestTimeseries({
      start,
      end,
      aoi,
      layer,
      queryClient,
      eventEmitter,
      index,
      concurrencyManager
    });
  });

  return {
    on: eventEmitter.on,
    off: eventEmitter.off
  } as StacDatasetsTimeseriesEvented;
}

interface DatasetAssetsRequestParams {
  stacCol: string;
  stacApiEndpoint?: string;
  assets: string;
  dateStart: Date;
  dateEnd: Date;
  aoi: FeatureCollection<Polygon>;
}

async function getDatasetAssets(
  {
    dateStart,
    dateEnd,
    stacApiEndpoint,
    stacCol,
    assets,
    aoi
  }: DatasetAssetsRequestParams,
  opts: AxiosRequestConfig,
  concurrencyManager: ConcurrencyManagerInstance
) {
  const stacApiEndpointToUse = stacApiEndpoint ?? process.env.API_STAC_ENDPOINT;
  const data = await concurrencyManager.queue(async () => {
    const collectionReqRes = await axios.get(
      `${stacApiEndpointToUse}/collections/${stacCol}`
    );

    const searchReqRes = await axios.post(
      `${stacApiEndpointToUse}/search`,
      {
        'filter-lang': 'cql2-json',
        limit: 10000,
        fields: {
          include: [
            `assets.${assets}.href`,
            'properties.start_datetime',
            'properties.datetime'
          ],
          exclude: ['collection', 'links']
        },
        filter: getFilterPayload(dateStart, dateEnd, aoi, [stacCol])
      },
      opts
    );

    return {
      isPeriodic: collectionReqRes.data['dashboard:is_periodic'],
      timeDensity: collectionReqRes.data['dashboard:time_density'],
      domain: collectionReqRes.data.summaries.datetime,
      assets: searchReqRes.data.features.map((o) => ({
        date: o.properties.start_datetime || o.properties.datetime,
        url: o.assets[assets].href
      }))
    };
  });

  return data;
}

interface TimeseriesRequesterParams {
  start: Date;
  end: Date;
  aoi: FeatureCollection<Polygon>;
  layer: DatasetLayer;
  queryClient: QueryClient;
  eventEmitter: ReturnType<typeof EventEmitter>;
  index: number;
  concurrencyManager: ConcurrencyManagerInstance;
}

// Make requests and emit events.
async function requestTimeseries({
  start,
  end,
  aoi,
  layer,
  queryClient,
  eventEmitter,
  index,
  concurrencyManager
}: TimeseriesRequesterParams) {
  const id = layer.id;

  let layersBase: TimeseriesData = {
    id,
    name: layer.name,
    status: 'loading',
    layer,
    meta: {
      total: null,
      loaded: null
    },
    data: null,
    error: null
  };

  const onData = (data: TimeseriesData) => {
    layersBase = data;
    eventEmitter.fire('data', layersBase, index);
  };

  // Initial status. Defer to next tick otherwise the listener will not be
  // attached yet.
  setTimeout(() => onData(layersBase), 0);

  try {
    const layerInfoFromSTAC = await queryClient.fetchQuery(
      [TIMESERIES_DATA_BASE_ID, 'dataset', id, aoi, start, end],
      ({ signal }) =>
        getDatasetAssets(
          {
            stacCol: layer.stacCol,
            stacApiEndpoint: layer.stacApiEndpoint,
            assets: layer.sourceParams?.assets || 'cog_default',
            aoi,
            dateStart: start,
            dateEnd: end
          },
          { signal },
          concurrencyManager
        ),
      {
        staleTime: Infinity
      }
    );

    const { assets, ...otherCollectionProps } = layerInfoFromSTAC;

    if (assets.length > MAX_QUERY_NUM)
      throw Error(
        `Too many requests. We currently only allow requests up to ${MAX_QUERY_NUM} and this analysis requires ${assets.length} requests.`
      );

    onData({
      ...layersBase,
      status: 'loading',
      meta: {
        total: assets.length,
        loaded: 0
      }
    });

    const tileEndpointToUse =
      layer.tileApiEndpoint ?? process.env.API_RASTER_ENDPOINT;

    const analysisParams = layersBase.layer.analysis?.sourceParams ?? {};

    const layerStatistics = await Promise.all(
      assets.map(async ({ date, url }) => {
        const statistics = await queryClient.fetchQuery(
          [TIMESERIES_DATA_BASE_ID, 'asset', url],
          async ({ signal }) => {
            return concurrencyManager.queue(async () => {
              const { data } = await axios.post(
                `${tileEndpointToUse}/cog/statistics?url=${url}`,
                // Making a request with a FC causes a 500 (as of 2023/01/20)
                combineFeatureCollection(aoi),
                { params: { ...analysisParams, url }, signal }
              );
              return {
                date,
                // Remove 1 when https://github.com/NASA-IMPACT/veda-ui/issues/572 is fixed.
                ...(data.properties.statistics.b1 ||
                  data.properties.statistics['1'])
              };
            });
          },
          {
            staleTime: Infinity
          }
        );

        onData({
          ...layersBase,
          meta: {
            total: assets.length,
            loaded: (layersBase.meta.loaded ?? 0) + 1
          }
        });

        return statistics;
      })
    );

    onData({
      ...layersBase,
      status: 'succeeded',
      meta: {
        total: assets.length,
        loaded: assets.length
      },
      data: {
        ...otherCollectionProps,
        timeseries: layerStatistics
      }
    });
  } catch (error) {
    // Discard abort related errors.
    if (error.revert) return;

    onData({
      ...layersBase,
      status: 'errored',
      error
    });
  }
}
