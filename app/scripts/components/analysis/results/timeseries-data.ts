import axios, { AxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { Feature, MultiPolygon } from 'geojson';
import { DatasetLayer } from 'delta/thematics';

import EventEmitter from './mini-events';
import { userTzDate2utcString } from '$utils/date';
import { ConcurrencyManager, ConcurrencyManagerInstance } from './concurrency';
import { TimeDensity } from '$context/layer-data';

export const TIMESERIES_DATA_BASE_ID = 'analysis';

export type TimeseriesDataUnit = {
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
};

type TimeseriesDataResult = {
  isPeriodic: boolean;
  timeDensity: TimeDensity;
  domain: string[];
  timeseries: TimeseriesDataUnit[];
};

// Different options based on status.
export type TimeseriesData =
  | {
      id: string;
      name: string;
      status: 'loading';
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
  aoi: Feature<MultiPolygon>;
  layers: DatasetLayer[];
  queryClient: QueryClient;
  signal: AbortSignal;
}) {
  const eventEmitter = EventEmitter();

  const concurrencyManager = ConcurrencyManager();

  // On abort clear the queue.
  signal?.addEventListener('abort', () => {
    queryClient.cancelQueries([TIMESERIES_DATA_BASE_ID]);
    concurrencyManager.clear();
  });

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

type DatasetAssetsRequestParams = {
  id: string;
  date: {
    start: string;
    end: string;
  };
  aoi: Feature<MultiPolygon>;
};

async function getDatasetAssets(
  { date, id, aoi }: DatasetAssetsRequestParams,
  opts: AxiosRequestConfig,
  concurrencyManager: ConcurrencyManagerInstance
) {
  const data = await concurrencyManager.queue(async () => {
    const collectionReqRes = await axios.get(
      `${process.env.API_STAC_ENDPOINT}/collections/${id}`
    );

    const searchReqRes = await axios.post(
      `${process.env.API_STAC_ENDPOINT}/search`,
      {
        'filter-lang': 'cql2-json',
        limit: 10000,
        fields: {
          include: ['assets.cog_default.href', 'properties.start_datetime'],
          exclude: ['collection', 'links']
        },
        // TODO: Only supports intersection on a single geometry???
        intersects: aoi.geometry,
        filter: {
          op: 'and',
          args: [
            {
              op: '>=',
              args: [
                {
                  property: 'datetime'
                },
                date.start
              ]
            },
            {
              op: '<=',
              args: [
                {
                  property: 'datetime'
                },
                date.end
              ]
            },
            {
              op: 'eq',
              args: [
                {
                  property: 'collection'
                },
                id
              ]
            }
          ]
        }
      },
      opts
    );

    return {
      isPeriodic: collectionReqRes.data['dashboard:is_periodic'],
      timeDensity: collectionReqRes.data['dashboard:time_density'],
      domain: collectionReqRes.data.summaries.datetime,
      assets: searchReqRes.data.features.map((o) => ({
        date: o.properties.start_datetime,
        url: o.assets.cog_default.href
      }))
    };
  });

  return data;
}

type TimeseriesRequesterParams = {
  start: Date;
  end: Date;
  aoi: Feature<MultiPolygon>;
  layer: DatasetLayer;
  queryClient: QueryClient;
  eventEmitter: ReturnType<typeof EventEmitter>;
  index: number;
  concurrencyManager: ConcurrencyManagerInstance;
};

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
      [TIMESERIES_DATA_BASE_ID, 'dataset', id],
      ({ signal }) =>
        getDatasetAssets(
          {
            id,
            aoi,
            date: {
              start: userTzDate2utcString(start),
              end: userTzDate2utcString(end)
            }
          },
          { signal },
          concurrencyManager
        ),
      {
        staleTime: Infinity
      }
    );

    const { assets, ...otherCollectionProps } = layerInfoFromSTAC;

    onData({
      ...layersBase,
      status: 'loading',
      meta: {
        total: assets.length,
        loaded: 0
      }
    });

    const layerStatistics = await Promise.all(
      assets.map(async ({ date, url }) => {
        const statistics = await queryClient.fetchQuery(
          [TIMESERIES_DATA_BASE_ID, 'asset', url],
          async ({ signal }) => {
            return concurrencyManager.queue(async () => {
              const { data } = await axios.post(
                `${process.env.API_RASTER_ENDPOINT}/cog/statistics?url=${url}`,
                aoi,
                { signal }
              );
              return { date, ...data.properties.statistics['1'] };
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
            loaded: (layersBase.meta.loaded || 0) + 1
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
