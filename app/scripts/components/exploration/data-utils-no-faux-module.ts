import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import eachYearOfInterval from 'date-fns/eachYearOfInterval';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import startOfYear from 'date-fns/startOfYear';
import {
  EnhancedDatasetLayer,
  TimelineDataset,
  DatasetStatus,
  StacDatasetData,
  TimeDensity,
  TimelineDatasetSuccess
} from './types.d.ts';
import {
  DataMetric,
  DATA_METRICS,
  DEFAULT_DATA_METRICS
} from './components/datasets/analysis-metrics';
import { utcString2userTzDate } from '$utils/date';
import {
  DatasetLayer,
  VedaData,
  VedaDatum,
  DatasetData,
  DatasetLayerType,
  ParentDatset
} from '$types/veda';

export function getParentDataset(data: DatasetData): ParentDatset {
  return {
    id: data.id,
    name: data.name,
    infoDescription: data.infoDescription
  };
}

// @NOTE: All fns from './date-utils` should eventually move here to get rid of their faux modules dependencies
// `./date-utils` to be deprecated!!

export const getDatasetLayers = (datasets: VedaData<DatasetData>) =>
  Object.values(datasets).flatMap((dataset: VedaDatum<DatasetData>) => {
    return dataset.data.layers;
  });

export const getLayersFromDataset = (datasets: DatasetData[]) =>
  Object.values(datasets);

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
  datasetsList: EnhancedDatasetLayer[],
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

const hasValidSourceParams = (params) => {
  return params && 'colormap_name' in params && 'rescale' in params;
};

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

// renderParams precedence: Start with sourceParams from the dataset.
// If it's not defined, check for the dashboard render configuration in queryData.
// If still undefined, check for asset-specific renders using the sourceParams' assets
// property.
export function resolveRenderParams(
  datasetSourceParams: Record<string, any> | undefined,
  queryDataRenders: Record<string, any> | undefined
): Record<string, any> | undefined {
  // Return null if there are no user-configured sourcparams nor render parameter
  // so it doesn't get subbed with default values
  if (!datasetSourceParams && !queryDataRenders) return undefined;

  // Start with sourceParams from the dataset.
  // Return the source param as it is if exists
  if (hasValidSourceParams(datasetSourceParams)) {
    return datasetSourceParams;
  }

  // Check for the dashboard render configuration in queryData
  if (!queryDataRenders)
    throw new Error('No render parameter exists from stac endpoint.');

  // Check the namespace from render extension
  const renderKey = queryDataRenders.dashboard
    ? 'dashboard'
    : datasetSourceParams?.assets;
  if (!queryDataRenders[renderKey])
    throw new Error(
      'No proper render parameter for dashboard namespace exists.'
    );

  // Return the render extension parameter
  if (
    queryDataRenders[renderKey] &&
    hasValidSourceParams(queryDataRenders[renderKey])
  ) {
    const renderParams = queryDataRenders[renderKey];
    return {
      ...renderParams,
      rescale: flattenAndCalculateMinMax([renderParams.rescale])
    };
  }
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
