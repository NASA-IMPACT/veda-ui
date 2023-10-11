import axios, { AxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { FeatureCollection, Polygon } from 'geojson';
import { ConcurrencyManagerInstance } from './concurrency';
import {
  TimelineDataset,
  TimelineDatasetAnalysis,
  TimelineDatasetStatus
} from './types.d.ts';
import {
  combineFeatureCollection,
  getFilterPayload
} from '$components/analysis/utils';

interface DatasetAssetsRequestParams {
  stacCol: string;
  assets: string;
  dateStart: Date;
  dateEnd: Date;
  aoi: FeatureCollection<Polygon>;
}

/**
 * Gets the asset urls for all datasets in the results of a STAC search given by
 * the input parameters.
 *
 * @param params Dataset search request parameters
 * @param opts Options for the request (see Axios)
 * @param concurrencyManager The concurrency manager instance
 * @returns Promise with the asset urls
 */
async function getDatasetAssets(
  { dateStart, dateEnd, stacCol, assets, aoi }: DatasetAssetsRequestParams,
  opts: AxiosRequestConfig,
  concurrencyManager: ConcurrencyManagerInstance
): Promise<{ assets: { date: Date; url: string }[] }> {
  const data = await concurrencyManager.queue(async () => {
    const searchReqRes = await axios.post(
      `${process.env.API_STAC_ENDPOINT}/search`,
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
      assets: searchReqRes.data.features.map((o) => ({
        date: new Date(o.properties.start_datetime || o.properties.datetime),
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
  dataset: TimelineDataset;
  queryClient: QueryClient;
  concurrencyManager: ConcurrencyManagerInstance;
  onProgress: (data: TimelineDatasetAnalysis) => void;
}

/**
 * Gets the statistics for the given dataset within the given time range and
 * area of interest.
 */
export async function requestDatasetTimeseriesData({
  start,
  end,
  aoi,
  dataset,
  queryClient,
  concurrencyManager,
  onProgress
}: TimeseriesRequesterParams) {
  const datasetData = dataset.data;
  const datasetAnalysis = dataset.analysis;

  const id = datasetData.id;

  onProgress({
    status: TimelineDatasetStatus.LOADING,
    error: null,
    data: null,
    meta: {}
  });

  try {
    const layerInfoFromSTAC = await queryClient.fetchQuery(
      ['analysis', 'dataset', id, aoi, start, end],
      ({ signal }) =>
        getDatasetAssets(
          {
            stacCol: datasetData.stacCol,
            assets: datasetData.sourceParams?.assets || 'cog_default',
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

    const { assets } = layerInfoFromSTAC;

    onProgress({
      status: TimelineDatasetStatus.LOADING,
      error: null,
      data: null,
      meta: {
        total: assets.length,
        loaded: 0
      }
    });

    let loaded = 0;

    const layerStatistics = await Promise.all(
      assets.map(async ({ date, url }) => {
        const statistics = await queryClient.fetchQuery(
          ['analysis', 'asset', url, aoi],
          async ({ signal }) => {
            return concurrencyManager.queue(async () => {
              const { data } = await axios.post(
                `${process.env.API_RASTER_ENDPOINT}/cog/statistics?url=${url}`,
                // Making a request with a FC causes a 500 (as of 2023/01/20)
                combineFeatureCollection(aoi),
                { signal }
              );
              return {
                date,
                ...data.properties.statistics.b1
              };
            });
          },
          {
            staleTime: Infinity
          }
        );

        onProgress({
          status: TimelineDatasetStatus.LOADING,
          error: null,
          data: null,
          meta: {
            total: assets.length,
            loaded: ++loaded
          }
        });

        return statistics;
      })
    );

    onProgress({
      status: TimelineDatasetStatus.SUCCESS,
      meta: {
        total: assets.length,
        loaded: assets.length
      },
      error: null,
      data: {
        timeseries: layerStatistics
      }
    });
  } catch (error) {
    // Discard abort related errors.
    if (error.revert) return;

    onProgress({
      ...datasetAnalysis,
      status: TimelineDatasetStatus.ERROR,
      error,
      data: null
    });
  }
}
