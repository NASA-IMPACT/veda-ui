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
import { DatasetLayer, VedaDatum, DatasetData } from '$types/veda';

// @NOTE: All fns from './date-utils` should eventually move here to get rid of their faux modules dependencies
// `./date-utils` to be deprecated!!

export const getDatasetLayers = (datasets: VedaDatum<DatasetData>) =>
  Object.values(datasets).flatMap((dataset: VedaDatum<DatasetData>) => {
    return dataset!.data.layers.map((l) => ({
      ...l,
      parentDataset: {
        id: dataset!.data.id,
        name: dataset!.data.name
      }
    }));
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
      return DATA_METRICS.find((m) => m.id === metric)!;
    })
    .filter(Boolean);

  return foundMetrics;
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
        analysisMetrics: getInitialMetrics(dataset)
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

// renderParams precedence: Start with sourceParams from the dataset.
// If it's not defined, check for the dashboard render configuration in queryData.
// If still undefined, check for asset-specific renders using the sourceParams' assets
// property.
export function resolveRenderParams(
  datasetSourceParams: Record<string, any> | undefined,
  queryDataRenders: Record<string, any> | undefined
): any {
  let renderParams: Record<string, any> | undefined;

  // Start with sourceParams from the dataset.
  if (hasValidSourceParams(datasetSourceParams)) {
    renderParams = datasetSourceParams;
  }

  // Check for the dashboard render configuration in queryData if not defined.
  if (!renderParams && queryDataRenders?.dashboard) {
    renderParams = queryDataRenders.dashboard;
  }

  // Check for asset-specific renders using the sourceParams' assets property.
  if (!renderParams && queryDataRenders?.[datasetSourceParams?.assets]) {
    renderParams = queryDataRenders[datasetSourceParams?.assets];

    // The backend sometimes sends `renderParams.rescale` as a nested array, e.g., [[min, max]],
    // even when it contains only one range. We check if `rescale` is an array with exactly one
    // element, and if that element is itself an array. If so, we "flatten" it by taking
    // the first element to simplify the structure for further use.
    if (
      Array.isArray(renderParams?.rescale) &&
      renderParams.rescale.length === 1 &&
      Array.isArray(renderParams.rescale[0])
    ) {
      renderParams.rescale = renderParams.rescale[0];
    }
  }

  return renderParams;
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
