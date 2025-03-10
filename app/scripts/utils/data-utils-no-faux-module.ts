import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import eachYearOfInterval from 'date-fns/eachYearOfInterval';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import startOfYear from 'date-fns/startOfYear';
import { RENDER_KEY } from '$components/exploration/constants';
import {
  DataMetric,
  DATA_METRICS,
  DEFAULT_DATA_METRICS
} from '$components/exploration/components/datasets/analysis-metrics';
import {
  TimelineDataset,
  DatasetStatus,
  StacDatasetData,
  TimeDensity,
  TimelineDatasetSuccess
} from '$components/exploration/types.d.ts';
import { utcString2userTzDate } from '$utils/date';
import {
  DatasetLayer,
  VedaData,
  VedaDatum,
  DatasetData,
  DatasetLayerType,
  SourceParameters
} from '$types/veda';

export const findParentDataset = ({ datasets, datasetId }) => {
  const parentDatset = Object.values(datasets).find(
    (dataset: DatasetData) => dataset.id === datasetId
  );
  return parentDatset;
};

export const getDatasetLayers = (datasets: VedaData<DatasetData>) =>
  Object.values(datasets).flatMap((dataset: VedaDatum<DatasetData>) => {
    return dataset.data.layers;
  });

export const getLayersFromDatasetLayers = (datasets: DatasetData[]) =>
  Object.values(datasets).flatMap((data: DatasetData) => {
    return data.layers;
  });

/**
 * Returns an array of metrics based on the given Dataset Layer configuration.
 * If the layer has metrics defined, it returns only the metrics that match the
 * ids. Otherwise, it returns all available metrics.
 *
 * @param data - The Datase tLayer object to get metrics for.
 * @returns An array of metrics objects.
 */
function getInitialMetrics(data: DatasetLayer): DataMetric[] {
  const metricsIds = data.analysis?.metrics ?? [];

  if (!metricsIds.length) {
    return DEFAULT_DATA_METRICS;
  }

  const foundMetrics = metricsIds
    .map((metric: string) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return DATA_METRICS.find((m) => m.id === metric)!;
    })
    .filter(Boolean);

  return foundMetrics;
}

function getInitialColorMap(dataset: DatasetLayer): string | undefined {
  return dataset.sourceParams?.colormap_name;
}

export function reconcileDatasets(
  ids: string[],
  datasetsList: DatasetLayer[],
  reconciledDatasets: TimelineDataset[]
): TimelineDataset[] {
  return ids.map((id) => {
    const alreadyReconciled = reconciledDatasets.find((d) => d.data.id === id);

    if (alreadyReconciled) {
      return alreadyReconciled;
    }

    const dataset = datasetsList.find((d) => d.id === id);

    if (!dataset) {
      throw new Error(`Dataset [${id}] not found`);
    }
    return {
      status: DatasetStatus.IDLE,
      data: dataset,
      error: null,
      settings: {
        isVisible: true,
        opacity: 100,
        analysisMetrics: getInitialMetrics(dataset),
        colorMap: getInitialColorMap(dataset)
      },
      analysis: {
        status: DatasetStatus.IDLE,
        data: null,
        error: null,
        meta: {}
      }
    };
  });
}

export function resolveLayerTemporalExtent(
  datasetId: string,
  datasetData: StacDatasetData
): Date[] {
  const { domain, isPeriodic, timeDensity } = datasetData;

  if (!domain || domain.length === 0) {
    throw new Error(`Invalid domain on dataset [${datasetId}]`);
  }

  if (!isPeriodic) return domain.map((d) => utcString2userTzDate(d));

  switch (timeDensity) {
    case TimeDensity.YEAR:
      return eachYearOfInterval({
        start: utcString2userTzDate(domain[0]),
        end: utcString2userTzDate(domain[domain.length - 1])
      });
    case TimeDensity.MONTH:
      return eachMonthOfInterval({
        start: utcString2userTzDate(domain[0]),
        end: utcString2userTzDate(domain[domain.length - 1])
      });
    case TimeDensity.DAY:
      return eachDayOfInterval({
        start: utcString2userTzDate(domain[0]),
        end: utcString2userTzDate(domain[domain.length - 1])
      });
    default:
      throw new Error(
        `Invalid time density [${timeDensity}] on dataset [${datasetId}]`
      );
  }
}

/**
 * Utility to check if render parameters are applicable based on dataset type.
 *
 * @param datasetType The type of the dataset (e.g., 'vector').
 * @returns Boolean indicating if render parameters are applicable.
 */
export const isRenderParamsApplicable = (
  datasetType: DatasetLayerType
): boolean => {
  const nonApplicableTypes = ['vector'];

  return !nonApplicableTypes.includes(datasetType);
};

/**
 * Util to flatten and process rescale values,
 *
 * The need for flattening is because the `rescale` values can be received
 * in different formats depending on their source. When parsing through Parcel,
 * `rescale` values are typically a flat array (e.g., [0, 0.1, 0.01, 0.2]).
 * However, when these values come from the back-end, they may be nested,
 * like `[[0, 0.1], [0.01, 0.2]]`.
 *
 * To ensure consistency across the application and guard against any nesting
 * issues (especially when working with multiple pairs of tuples from the back-end),
 * this function flattens the input array and calculates the global minimum and maximum values.
 * This guarantees that the `rescale` values are always returned in the correct [min, max] format.
 *
 * @param rescale - A potentially nested array of rescale values.
 * @returns A tuple containing the minimum and maximum values [min, max].
 */
function flattenAndCalculateMinMax(rescale: number[]): [number, number] {
  const flattenArray = (arr: number[]): number[] => arr.flat(Infinity);

  const rescaleArray = flattenArray(rescale);

  const min = Math.min(...rescaleArray);
  const max = Math.max(...rescaleArray);

  return [min, max];
}

export function formatRenderExtensionData(renderData): SourceParameters {
  return {
    ...renderData,
    ...(renderData.colormap && {
      colormap: JSON.stringify(renderData.colormap)
    }),
    ...(renderData.rescale && {
      rescale: flattenAndCalculateMinMax([renderData.rescale])
    })
  };
}

export type SourceParametersWithLayerId = SourceParameters & {
  layerId: string;
};
// renderParams precedence
// 1. Check if render extension has a layer specific namespace from render extension
// 1-1. If so, return the layer specific render data
// 2. Check if user-defined source parameters haave assets defined
// 2-1. If so, return user defined source parameters
// 3. Check if render extension has dashboard namespace
// 3-1. If so, use the render Extension data
// 4. return user defined source parameters (which can be an empty object)
export function resolveRenderParams(
  datasetSourceParams: SourceParametersWithLayerId,
  queryDataRenders: Record<string, any> | undefined
): SourceParameters {
  const { layerId, ...rest } = datasetSourceParams;
  // 1. Check if render extension has a layer specific namespace from render extension
  if (queryDataRenders && queryDataRenders[layerId])
    return formatRenderExtensionData(queryDataRenders[layerId]);
  // 2. (TO DEPRECATE Once all the assets specific source parameters are namespaced with render extension)
  // Return user defined source parameters if there is one
  if (datasetSourceParams?.assets) return rest;
  // 3. Return dashboard namespace render extension data
  if (queryDataRenders && queryDataRenders[RENDER_KEY])
    return formatRenderExtensionData(queryDataRenders[RENDER_KEY]);
  // 4. return user defined source params (which can be an empty object)
  return rest;
}

export function getTimeDensityStartDate(date: Date, timeDensity: TimeDensity) {
  switch (timeDensity) {
    case TimeDensity.MONTH:
      return startOfMonth(date);
    case TimeDensity.YEAR:
      return startOfYear(date);
  }

  return startOfDay(date);
}

// Define an order for TimeDensity, where smaller numbers indicate finer granularity
const TIME_DENSITY_ORDER: Record<TimeDensity, number> = {
  [TimeDensity.DAY]: 1,
  [TimeDensity.MONTH]: 2,
  [TimeDensity.YEAR]: 3
};

/**
 * Determines the lowest common time density among an array of timeline datasets.
 *
 * @param {TimelineDataset[]} dataArray - An array of timeline datasets, each containing time density info.
 * @returns {TimeDensity} - The smallest TimeDensity found in the datasets array, or TimeDensity.YEAR as a default.
 */
export const getLowestCommonTimeDensity = (
  dataArray: TimelineDatasetSuccess[]
): TimeDensity =>
  dataArray.reduce(
    (lowestDensity, obj) =>
      TIME_DENSITY_ORDER[obj.data.timeDensity] <
      TIME_DENSITY_ORDER[lowestDensity]
        ? obj.data.timeDensity
        : lowestDensity,
    TimeDensity.YEAR
  );

export class ExtendedError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export const findDatasetAttribute = (
  datasets,
  {
    datasetId,
    attr
  }: {
    datasetId: string;
    attr: string;
  }
) => {
  return datasets[datasetId]?.data[attr];
};
