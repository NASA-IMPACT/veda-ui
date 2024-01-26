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
    console.log(`ONPROGRESS_1`)
    onProgress({
      status: TimelineDatasetStatus.ERROR,
      meta: {},
      error: new ExtendedError(
        'Analysis is only supported for raster datasets',
        'ANALYSIS_NOT_SUPPORTED'
      ),
      data: null
    });
    return;
  }

  const id = datasetData.id;
  console.log(`ONPROGRESS_2`)
  onProgress({
    status: TimelineDatasetStatus.LOADING,
    error: null,
    data: null,
    meta: {}
  });

  const stacApiEndpointToUse =
    datasetData.stacApiEndpoint ?? process.env.API_STAC_ENDPOINT ?? '';
  const durStart = new Date();
  try {
    // @NOTE-SANDRA: Do we actually need to the concurrencyManager here?
    // const layerInfoFromSTAC = await concurrencyManager.queue(
    //   `${id}-analysis`,
    //   () => {
    //     return queryClient.fetchQuery(
    //       ['analysis', 'dataset', id, aoi, start, end],
    //       ({ signal }) =>
    //         getDatasetAssets(
    //           {
    //             stacEndpoint: stacApiEndpointToUse,
    //             stacCol: datasetData.stacCol,
    //             assets: datasetData.sourceParams?.assets || 'cog_default',
    //             aoi,
    //             dateStart: start,
    //             dateEnd: end
    //           },
    //           { signal }
    //         ),
    //       {
    //         staleTime: Infinity
    //       }
    //     );
    //   }
    // );
  
    const layerInfoFromSTAC = await queryClient.fetchQuery(
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

    const { assets } = layerInfoFromSTAC;

    console.log(`assets: `, assets)
    console.log(`ONPROGRESS_3`)
    onProgress({
      status: TimelineDatasetStatus.LOADING,
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
      console.log(`ONPROGRESS_4`)
      onProgress({
        ...datasetAnalysis,
        status: TimelineDatasetStatus.ERROR,
        error: e,
        data: null
      });
      return;
    }

    if (!assets.length) {
      console.log(`ONPROGRESS_5`)
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

    let loaded = 0;

    const tileEndpointToUse =
      datasetData.tileApiEndpoint ?? process.env.API_RASTER_ENDPOINT ?? '';

    const analysisParams = datasetData.analysis?.sourceParams ?? {};

    // TODO-SANDRA: If there are a large number of assets, batching would help lower resource consumption
    // @NOTE-SANDRA: Old way
    // const layerStatistics = await Promise.all(
    //   assets.map(async ({ date, url }) => {
    //     const statistics = await concurrencyManager.queue(
    //       `${id}-analysis-asset`,
    //       () => {
    //         return queryClient.fetchQuery(
    //           ['analysis', id, 'asset', url, aoi],
    //           async ({ signal }) => {
    //             const { data } = await axios.post(
    //               `${tileEndpointToUse}/cog/statistics`,
    //               // Making a request with a FC causes a 500 (as of 2023/01/20)
    //               fixAoiFcForStacSearch(aoi),
    //               { params: { url, ...analysisParams }, signal }
    //             );
    //             return {
    //               date,
    //               ...data.properties.statistics.b1
    //             };
    //           },
    //           {
    //             staleTime: Infinity
    //           }
    //         );
    //       }
    //     );
    //     console.log(`ONPROGRESS_6`)
    //     onProgress({
    //       status: TimelineDatasetStatus.LOADING,
    //       error: null,
    //       data: null,
    //       meta: {
    //         total: assets.length,
    //         loaded: ++loaded
    //       }
    //     });

    //     return statistics;
    //   })
    // );

    // @NOTE-SANDRA: New way
    const layerStatistics = await batchLayerStatistics(onProgress, assets, queryClient, id, aoi, tileEndpointToUse ,analysisParams) 
       
    console.log(`ONPROGRESS_7: `)
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
    // @TODO-DELETE
    console.log(`Total duration: ${(new Date() - durStart) / 1000} seconds`);
    return
  } catch (error) {
    // Discard abort related errors.
    if (error.revert) return;

    // Cancel any inflight queries.
    queryClient.cancelQueries({ queryKey: ['analysis', id] });
    // Remove other requests from the queue.
    concurrencyManager.dequeue(`${id}-analysis-asset`);
    console.log(`ONPROGRESS_8`)
    onProgress({
      ...datasetAnalysis,
      status: TimelineDatasetStatus.ERROR,
      error,
      data: null
    });
  }
}

const batchLayerStatistics = async (
  onProgress: (data: TimelineDatasetAnalysis) => void,
  assets: any,
  queryClient: any,
  id: string,
  aoi: any,
  tileEndpointToUse: string,
  analysisParams: any,
  ) => {
  let statResults: any[] = [];
  let loaded = 0;
  const getStatistics = async (date, url) => {
    const statistics = await queryClient.fetchQuery(
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

    return statistics;
  }

  async function* batchLayers(assets, batchLimit) {
    for(let i = 0; i < assets.length; i += batchLimit) {
      // Grab assets for current iteration
      let batch = assets.slice(i, i + batchLimit);
      batch = await Promise.all(
        batch.map(async (i) => {
          const stats = await getStatistics(i.date, i.url);
          return {i, ...stats}
        })
      );
      // Temporily return current batch
      yield batch;
    }
  }

  const getStatusResults = async () => {
    for await(const batch of batchLayers(assets, 50)) {
      // console.log(`new batch: `, batch, loaded)
      // NOTE-SANDRA: Issue is that this is being set async!
      onProgress({
        status: TimelineDatasetStatus.LOADING,
        error: null,
        data: null,
        meta: {
          total: assets.length,
          loaded: loaded += batch.length
        }
      });
      statResults.push(...batch)
    }
    return statResults
  }

  return await getStatusResults();
}