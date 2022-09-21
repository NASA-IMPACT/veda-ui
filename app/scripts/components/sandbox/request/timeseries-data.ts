import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { DatasetLayer } from 'delta/thematics';

import EventEmitter from './mini-events';

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
      data: TimeseriesDataUnit[];
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
  layers,
  queryClient
}: {
  layers: DatasetLayer[];
  queryClient: QueryClient;
}) {
  const eventEmitter = EventEmitter();

  // Start the request for each layer.
  layers.forEach(async (layer, index) => {
    requestTimeseries({
      layer,
      queryClient,
      eventEmitter,
      index
    });
  });

  return {
    on: eventEmitter.on,
    off: eventEmitter.off
  } as StacDatasetsTimeseriesEvented;
}

async function getDatasetAssets({ date, id }, opts) {
  const { data } = await axios.post(
    `${process.env.API_STAC_ENDPOINT}/search`,
    {
      'filter-lang': 'cql2-json',
      limit: 100,
      fields: {
        include: ['assets.cog_default.href', 'properties.start_datetime'],
        exclude: ['collection', 'links']
      },
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

  return data.features.map((o) => ({
    date: o.properties.start_datetime,
    url: o.assets.cog_default.href
  }));
}

type TimeseriesRequesterParams = {
  layer: DatasetLayer;
  queryClient: QueryClient;
  eventEmitter: ReturnType<typeof EventEmitter>;
  index: number;
};

// Make requests and emit events.
async function requestTimeseries({
  layer,
  queryClient,
  eventEmitter,
  index
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
      ['analysis', 'dataset', id],
      ({ signal }) =>
        getDatasetAssets(
          {
            id,
            date: {
              start: '2015-01-01T00:00:00.000Z',
              end: '2022-01-01T00:00:00.000Z'
            }
          },
          { signal }
        ),
      {
        staleTime: Infinity
      }
    );

    onData({
      ...layersBase,
      status: 'loading',
      meta: {
        total: layerInfoFromSTAC.length,
        loaded: 0
      }
    });

    const layerStatistics = await Promise.all(
      layerInfoFromSTAC.map(async ({ date, url }) => {
        const statistics = await queryClient.fetchQuery(
          ['analysis', 'asset', url],
          async ({ signal }) => {
            const { data } = await axios(
              `${process.env.API_RASTER_ENDPOINT}/cog/statistics?url=${url}`,
              { signal }
            );
            return { date, ...data['1'] };
          },
          {
            staleTime: Infinity
          }
        );

        onData({
          ...layersBase,
          meta: {
            total: layerInfoFromSTAC.length,
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
        total: layerInfoFromSTAC.length,
        loaded: layerInfoFromSTAC.length
      },
      data: layerStatistics
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
