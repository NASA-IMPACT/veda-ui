import axios, { AxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { FeatureCollection, Polygon } from 'geojson';
import { ConcurrencyManagerInstance } from './concurrency';
import {
  TimelineDataset,
  TimelineDatasetAnalysis,
  EADatasetDataLayer,
  DatasetStatus,
  AnalysisTimeseriesEntry,
  TimeseriesData
} from './types.d.ts';

import { MAX_QUERY_NUM } from './constants';
import {
  ExtendedError,
  generateDates
} from '$components/exploration/data-utils';
import { utcString2userTzDate } from '$utils/date';
import {
  fixAoiFcForStacSearch,
  getFilterPayloadWithAOI
} from '$components/common/map/utils';
import { userTzDate2utcString } from '$utils/date';
import { formatTitilerParameter } from '$components/common/map/style-generators/utils';

export const SINGLE_BAND_KEY_NAME = 'b1';
interface DatasetAssetsRequestParams {
  stacCol: string;
  assets: string;
  stacEndpoint: string;
  dateStart: Date;
  dateEnd: Date;
  aoi: FeatureCollection<Polygon>;
}

type CMRStatResponse = Omit<AnalysisTimeseriesEntry, 'date'>;
type CMRStatistics = {
  [key1: string]: {
    [timestamp: string]: CMRStatResponse;
  };
};
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
  envApiCMREndpoint?: string;
}

type TimeseriesCMRRequesterParams = Omit<TimeseriesRequesterParams, 'envApiRasterEndpoint'| 'concurrencyManager'| 'envApiStacEndpoint'>

export function formatCMRResponse(statResponse: CMRStatistics): TimeseriesData {
  const cmrResponse = {};

  // Multi Bands data with band names as keys: (Backend: rasterio)
  //   statistics: {
  //   startTime1/endTime1: {
  //      'Band1': {max:..., min: ..., ....},
  //      'Band2': {max:..., min: ..., ....},
  //      'Band3': {max:..., min: ..., ....},
  //   },
  //   startTime2/endTime2: {
  //      'Band1': {max:..., min: ..., ....},
  //      'Band2': {max:..., min: ..., ....},
  //      'Band3': {max:..., min: ..., ....},
  //   },
  //   ...
  // }

  // Single Band data with startTime as a key name: (Backend: xarray)
  // statistics: {
  // startTime1/endTime1: {
  //    startTime1: {max: ..., min:..., ....}
  // },
  // startTime2/endTime2: {
  //    startTime2: {max: ..., min:..., ....}
  // },

  Object.keys(statResponse).forEach((oneTimestamp) => {
    const currentTimestampData = statResponse[oneTimestamp];
    const bands = Object.keys(currentTimestampData);
    // When the data has only one band
    // in the backend: rasterio case, the keyname doesn't matter.
    // in the backend: xarray case, keyname needs to be consolidated.
    if (bands.length === 1) {
      const currentBand = bands[0];
      const currentBandData = {
        ...currentTimestampData[currentBand],
        date: utcString2userTzDate(oneTimestamp.split('/')[0])
      };
      if (!cmrResponse[SINGLE_BAND_KEY_NAME]) {
        cmrResponse[SINGLE_BAND_KEY_NAME] = [];
      }
      // The most recent date should come first
      cmrResponse[SINGLE_BAND_KEY_NAME] = [
        currentBandData,
        ...cmrResponse[SINGLE_BAND_KEY_NAME]
      ];
    } else {
      bands.forEach((eachBand) => {
        const currentBandData = {
          ...currentTimestampData[eachBand],
          date: utcString2userTzDate(oneTimestamp.split('/')[0])
        };
        if (!cmrResponse[eachBand]) {
          cmrResponse[eachBand] = [];
        }
        // The most recent date should come first
        cmrResponse[eachBand] = [currentBandData, ...cmrResponse[eachBand]];
      });
    }
  });

  return cmrResponse;
}

export async function requestCMRTimeseriesData({
  start,
  end,
  aoi,
  dataset,
  queryClient,
  envApiCMREndpoint,
  onProgress
}: TimeseriesCMRRequesterParams): Promise<TimelineDatasetAnalysis> {
  const datasetData = dataset.data as EADatasetDataLayer;
  // Check if the selected timespan requires too many assets to analyze
  const requestedIntervals = generateDates(
    start,
    end,
    datasetData.timeInterval
  );

  if (requestedIntervals.length > MAX_QUERY_NUM) {
    const e = new ExtendedError(
      'Too many assets to analyze',
      'ANALYSIS_TOO_MANY_ASSETS'
    );
    e.details = {
      assetCount: requestedIntervals.length
    };

    onProgress({
      status: DatasetStatus.ERROR,
      meta: {
        total: requestedIntervals.length,
        loaded: 0
      },
      error: e,
      data: null
    });

    return {
      status: DatasetStatus.ERROR,
      meta: {
        total: requestedIntervals.length,
        loaded: 0
      },
      error: e,
      data: null
    };
  }

  onProgress({
    status: DatasetStatus.LOADING,
    error: null,
    data: null,
    meta: {
      total: requestedIntervals.length,
      loaded: undefined
    }
  });
  try {
    // for the time series endpoint we let titiler-cmr handle any sel=time logic
    const sourceParams = datasetData.sourceParams ?? {};
    const { time, ...selWithoutTime } = sourceParams.sel ?? {};

    const paramsRaw = {
      datetime: `${userTzDate2utcString(start)}/${userTzDate2utcString(end)}`,
      step: datasetData.timeInterval,
      // temporal_mode: 'interval',
      ...sourceParams,
      sel: selWithoutTime
    };
    const formattedParamString = formatTitilerParameter(paramsRaw);

    const cmrTitilerEndpoint = datasetData.tileApiEndpoint
      ? datasetData.tileApiEndpoint.replace('WebMercatorQuad/tilejson.json', '')
      : envApiCMREndpoint;
    const statResponse = await queryClient.fetchQuery(
      ['analysis', datasetData.id, 'cmr', aoi],
      async ({ signal }) => {
        const { data } = await axios.post(
          `${cmrTitilerEndpoint}/timeseries/statistics/?${formattedParamString}`,
          fixAoiFcForStacSearch(aoi),
          { signal }
        );
        return {
          ...data.properties.statistics
        };
      },
      {
        staleTime: Infinity
      }
    );

    // When backend returns the empty stats
    if (requestedIntervals.length && Object.keys(statResponse).length < 1) {
      const e = new ExtendedError(
        'The selected time and area of interest contains no valid data.',
        'ANALYSIS_NO_VALID_DATA'
      );

      onProgress({
        status: DatasetStatus.ERROR,
        meta: {
          total: requestedIntervals.length,
          loaded: undefined
        },
        error: e,
        data: null
      });

      return {
        status: DatasetStatus.ERROR,
        meta: {
          total: requestedIntervals.length,
          loaded: undefined
        },
        error: e,
        data: null
      };
    }

    const formattedResponse = formatCMRResponse(statResponse);

    onProgress({
      status: DatasetStatus.SUCCESS,
      meta: {
        total: requestedIntervals.length,
        loaded: requestedIntervals.length
      },
      error: null,
      data: {
        timeseries: formattedResponse
      }
    });

    return {
      status: DatasetStatus.SUCCESS,
      meta: {
        total: requestedIntervals.length,
        loaded: requestedIntervals.length
      },
      error: null,
      data: {
        timeseries: formattedResponse
      }
    };
  } catch (error) {
    // Discard abort related errors.
    if (error.revert) {
      return {
        status: DatasetStatus.LOADING,
        error: null,
        data: null,
        meta: {
          total: requestedIntervals.length,
          loaded: undefined
        }
      };
    }

    // Cancel any inflight queries.
    queryClient.cancelQueries({ queryKey: ['analysis', datasetData.id] });
    return {
      status: DatasetStatus.ERROR,
      error,
      data: null,
      meta: {}
    };
  }
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
  envApiCMREndpoint,
  onProgress
}: TimeseriesRequesterParams): Promise<TimelineDatasetAnalysis> {
  const datasetData = dataset.data;
  const datasetAnalysis = dataset.analysis;

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

  if (datasetData.type === 'cmr') {
    const cmrTimeseriesData = await requestCMRTimeseriesData({
      maxItems,
      start,
      end,
      aoi,
      dataset,
      queryClient,
      envApiCMREndpoint,
      onProgress
    });

    return cmrTimeseriesData;
  }
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

    let loaded = 0;

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
        timeseries: {
          [SINGLE_BAND_KEY_NAME]: layerStatistics
        }
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
        timeseries: {
          [SINGLE_BAND_KEY_NAME]: layerStatistics
        }
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
