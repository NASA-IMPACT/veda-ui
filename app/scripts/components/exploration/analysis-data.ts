import axios, { AxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { FeatureCollection, Polygon } from 'geojson';
import { ConcurrencyManagerInstance } from './concurrency';
import {
  TimelineDataset,
  TimelineDatasetAnalysis,
  TimelineDatasetStatus
} from './types.d.ts';
import { ExtendedError } from './data-utils';
import {
  fixAoiFcForStacSearch,
  getFilterPayload
} from '$components/analysis/utils';

interface DatasetAssetsRequestParams {
  stacCol: string;
  assets: string;
  stacEndpoint: string;
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
 * @returns Promise with the asset urls
 */
async function getDatasetAssets(
  {
    dateStart,
    dateEnd,
    stacCol,
    assets,
    aoi,
    stacEndpoint
  }: DatasetAssetsRequestParams,
  opts: AxiosRequestConfig
): Promise<{ assets: { date: Date; url: string }[] }> {
  const searchReqRes = await axios.post(
    `${stacEndpoint}/search`,
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
}

interface TimeseriesRequesterParams {
  maxItems: number;
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
  maxItems,
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

  if (datasetData.type !== 'raster') {
    return {
      status: TimelineDatasetStatus.ERROR,
      meta: {},
      error: new ExtendedError(
        'Analysis is only supported for raster datasets',
        'ANALYSIS_NOT_SUPPORTED'
      ),
      data: null
    };
  }

  const id = datasetData.id;

  onProgress({
    status: TimelineDatasetStatus.LOADING,
    error: null,
    data: null,
    meta: {}
  });

  const stacApiEndpointToUse =
    datasetData.stacApiEndpoint ?? process.env.API_STAC_ENDPOINT ?? '';

  try {
    const layerInfoFromSTAC = await concurrencyManager.queue(
      `${id}-analysis`,
      () => {
        return queryClient.fetchQuery(
          ['analysis', 'dataset', id, aoi, start, end],
          ({ signal }) =>
            getDatasetAssets(
              {
                stacEndpoint: stacApiEndpointToUse,
                stacCol: datasetData.stacCol,
                assets: datasetData.sourceParams?.assets || 'cog_default',
                aoi,
                dateStart: start,
                dateEnd: end
              },
              { signal }
            ),
          {
            staleTime: Infinity
          }
        );
      }
    );

    const { assets } = layerInfoFromSTAC;

    if (assets.length > maxItems) {
      const e = new ExtendedError(
        'Too many assets to analyze',
        'ANALYSIS_TOO_MANY_ASSETS'
      );
      e.details = {
        assetCount: assets.length
      };

      onProgress({
        ...datasetAnalysis,
        status: TimelineDatasetStatus.ERROR,
        error: e,
        data: null
      });
      return;
    }

    if (!assets.length) {
      onProgress({
        ...datasetAnalysis,
        status: TimelineDatasetStatus.ERROR,
        error: new ExtendedError(
          'No data in the given time range and area of interest',
          'ANALYSIS_NO_DATA'
        ),
        data: null
      });
      return;
    }

    onProgress({
      status: TimelineDatasetStatus.LOADING,
      error: null,
      data: null,
      meta: {
        total: assets.length,
        loaded: 0
      }
    });
    let loaded = 0;//new Array(assets.length).fill(0);

    const tileEndpointToUse =
      datasetData.tileApiEndpoint ?? process.env.API_RASTER_ENDPOINT ?? '';

    const analysisParams = datasetData.analysis?.sourceParams ?? {};

    const layerStatistics = await Promise.all(
      assets.map(
        async ({ date, url }) => {
        const statistics = await concurrencyManager.queue(
          `${id}-analysis-asset`,
          () => {
            return queryClient.fetchQuery(
              ['analysis', id, 'asset', url, aoi],
              async ({ signal }) => {
                const { data } = await axios.post(
                  `${tileEndpointToUse}/cog/statistics`,
                  // Making a request with a FC causes a 500 (as of 2023/01/20)
                  fixAoiFcForStacSearch(aoi),
                  { params: { url, ...analysisParams }, signal }
                );
                return {
                  date,
                  
                  ...data.properties.statistics.b1
                };
              },
              {
                staleTime: Infinity
              }
            );
          });

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
      }
      )
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
    return;
  } catch (error) {
    // Discard abort related errors.
    if (error.revert) {
      onProgress({
        status: TimelineDatasetStatus.LOADING,
        error: null,
        data: null,
        meta: {}
      });
    }

    // Cancel any inflight queries.
    queryClient.cancelQueries({ queryKey: ['analysis', id] });
    // Remove other requests from the queue.
    concurrencyManager.dequeue(`${id}-analysis-asset`);
    onProgress({
      ...datasetAnalysis,
      status: TimelineDatasetStatus.ERROR,
      error,
      data: null
    });
    return;
  }
}
