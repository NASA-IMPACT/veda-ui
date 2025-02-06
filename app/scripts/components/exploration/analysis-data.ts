import axios, { AxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { FeatureCollection, Polygon } from 'geojson';
import { ConcurrencyManagerInstance } from './concurrency';
import {
  TimelineDataset,
  TimelineDatasetAnalysis,
  DatasetStatus
} from './types.d.ts';
import { ExtendedError } from './data-utils-no-faux-module';
import { utcString2userTzDate } from '$utils/date';
import {
  fixAoiFcForStacSearch,
  getFilterPayloadWithAOI
} from '$components/common/map/utils';

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
      filter: getFilterPayloadWithAOI(dateStart, dateEnd, aoi, [stacCol])
    },
    opts
  );
  return {
    assets: searchReqRes.data.features.map((o) => ({
      date: utcString2userTzDate(
        o.properties.start_datetime || o.properties.datetime
      ),
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
  envApiRasterEndpoint: string;
  envApiStacEndpoint: string;
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
  envApiRasterEndpoint,
  envApiStacEndpoint,
  onProgress
}: TimeseriesRequesterParams): Promise<TimelineDatasetAnalysis> {
  const datasetData = dataset.data;
  const datasetAnalysis = dataset.analysis;

  if (datasetData.type !== 'raster') {
    return {
      status: DatasetStatus.ERROR,
      meta: {},
      error: new ExtendedError(
        'Analysis is only supported for raster datasets',
        'ANALYSIS_NOT_SUPPORTED'
      ),
      data: null
    };
  }

  if (datasetData.analysis?.exclude) {
    return {
      status: DatasetStatus.ERROR,
      meta: {},
      error: new ExtendedError(
        'Analysis is turned off for the dataset',
        'ANALYSIS_NOT_SUPPORTED'
      ),
      data: null
    };
  }

  const id = datasetData.id;

  onProgress({
    status: DatasetStatus.LOADING,
    error: null,
    data: null,
    meta: {}
  });

  const stacApiEndpointToUse =
    datasetData.stacApiEndpoint ?? envApiStacEndpoint ?? '';

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

    onProgress({
      status: DatasetStatus.LOADING,
      error: null,
      data: null,
      meta: {
        total: assets.length,
        loaded: 0
      }
    });

    if (assets.length > maxItems) {
      const e = new ExtendedError(
        'Too many assets to analyze',
        'ANALYSIS_TOO_MANY_ASSETS'
      );
      e.details = {
        assetCount: assets.length
      };

      return {
        ...datasetAnalysis,
        status: DatasetStatus.ERROR,
        error: e,
        data: null
      };
    }

    if (!assets.length) {
      return {
        ...datasetAnalysis,
        status: DatasetStatus.ERROR,
        error: new ExtendedError(
          'No data in the given time range and area of interest',
          'ANALYSIS_NO_DATA'
        ),
        data: null
      };
    }

    let loaded = 0; //new Array(assets.length).fill(0);

    const tileEndpointToUse =
      datasetData.tileApiEndpoint ?? envApiRasterEndpoint ?? '';

    const analysisParams = datasetData.analysis?.sourceParams ?? {};

    const layerStatistics = await Promise.all(
      assets.map(async ({ date, url }) => {
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
          }
        );

        onProgress({
          status: DatasetStatus.LOADING,
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

    if (layerStatistics.filter((e) => e.mean).length === 0) {
      return {
        ...datasetAnalysis,
        status: DatasetStatus.ERROR,
        error: new ExtendedError(
          'The selected time and area of interest contains no valid data. Please adjust your selection.',
          'ANALYSIS_NO_VALID_DATA'
        ),
        data: null
      };
    }

    onProgress({
      status: DatasetStatus.SUCCESS,
      meta: {
        total: assets.length,
        loaded: assets.length
      },
      error: null,
      data: {
        timeseries: layerStatistics
      }
    });
    return {
      status: DatasetStatus.SUCCESS,
      meta: {
        total: assets.length,
        loaded: assets.length
      },
      error: null,
      data: {
        timeseries: layerStatistics
      }
    };
  } catch (error) {
    // Discard abort related errors.
    if (error.revert) {
      return {
        status: DatasetStatus.LOADING,
        error: null,
        data: null,
        meta: {}
      };
    }

    // Cancel any inflight queries.
    queryClient.cancelQueries({ queryKey: ['analysis', id] });
    // Remove other requests from the queue.
    concurrencyManager.dequeue(`${id}-analysis-asset`);
    return {
      ...datasetAnalysis,
      status: DatasetStatus.ERROR,
      error,
      data: null
    };
  }
}