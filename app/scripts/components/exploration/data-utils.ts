import {
  eachDayOfInterval,
  eachYearOfInterval,
  format,
  startOfDay,
  startOfYear
} from 'date-fns';
import startOfMonth from 'date-fns/startOfMonth';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import {
  EnhancedDatasetLayer,
  StacDatasetData,
  TimeDensity,
  TimelineDataset,
  DatasetStatus
} from './types.d.ts';
import {
  DataMetric,
  DATA_METRICS,
  DEFAULT_DATA_METRICS
} from './components/datasets/analysis-metrics';
import { veda_faux_module_datasets } from '$data-layer/datasets';
import { DatasetLayer, DatasetData, VedaDatum } from '$types/veda';
import { utcString2userTzDate } from '$utils/date';

// @TODO: This file should be deprecated and merged with `data-utils-no-faux-module`
// to get rid of the faux modules dependency

export const findParentDataset = (layerId: string) => {
  const parentDataset: VedaDatum<DatasetData> | undefined = Object.values(
    veda_faux_module_datasets
  ).find((dataset: VedaDatum<DatasetData>) =>
    dataset!.data.layers.find((l) => l.id === layerId)
  );
  return parentDataset?.data;
};

export const findDatasetAttribute = ({
  datasetId,
  attr
}: {
  datasetId: string;
  attr: string;
}) => {
  return veda_faux_module_datasets[datasetId]?.data[attr];
};

export const allExploreDatasets = Object.values(veda_faux_module_datasets)
  .map((d: VedaDatum<DatasetData>) => d!.data)
  .filter((d: DatasetData) => !d.disableExplore);

export interface DatasetDataWithEnhancedLayers extends DatasetData {
  layers: EnhancedDatasetLayer[];
}

function enhanceDatasetLayers(dataset) {
  return {
    ...dataset,
    layers: dataset.layers.map((layer) => ({
      ...layer,
      parentDataset: {
        id: dataset.id,
        name: dataset.name
      }
    }))
  };
}

export const allExploreDatasetsWithEnhancedLayers: DatasetDataWithEnhancedLayers[] =
  allExploreDatasets.map(enhanceDatasetLayers);

export const getAllDatasetsWithEnhancedLayers = (
  dataset
): DatasetDataWithEnhancedLayers[] => dataset.map(enhanceDatasetLayers);

export const datasetLayers = Object.values(veda_faux_module_datasets).flatMap(
  (dataset: VedaDatum<DatasetData>) => {
    return dataset!.data.layers.map((l) => ({
      ...l,
      parentDataset: {
        id: dataset!.data.id,
        name: dataset!.data.name
      }
    }));
  }
);

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

/**
 * Converts the datasets to a format that can be used by the timeline, skipping
 * the ones that have already been reconciled.
 *
 * @param ids The ids of the datasets to reconcile.
 * @param datasetsList The list of datasets layers from VEDA
 * @param reconciledDatasets The datasets that were already reconciled.
 */

// @TODO: Assuming that all the datasets are added only through this method
// We can find a dataset that a layer belongs to in this method
// Include it as a part of returned value

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
        end: utcString2userTzDate(domain.last)
      });
    case TimeDensity.MONTH:
      return eachMonthOfInterval({
        start: utcString2userTzDate(domain[0]),
        end: utcString2userTzDate(domain.last)
      });
    case TimeDensity.DAY:
      return eachDayOfInterval({
        start: utcString2userTzDate(domain[0]),
        end: utcString2userTzDate(domain.last)
      });
    default:
      throw new Error(
        `Invalid time density [${timeDensity}] on dataset [${datasetId}]`
      );
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

export const formatDate = (date: Date | null, view?: string) => {
  if (!date) return 'Date';

  switch (view) {
    case 'decade':
      return format(date, 'yyyy');
    case 'year':
      return format(date, 'MMM yyyy');
    default:
      return format(date, 'MMM do, yyyy');
  }
};

export class ExtendedError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

const TIME_DENSITY_ORDER: Record<TimeDensity, number> = {
  [TimeDensity.DAY]: 1,
  [TimeDensity.MONTH]: 2,
  [TimeDensity.YEAR]: 3
};

export const getSmallestTimeDensity = (
  dataArray: TimelineDataset[]
): TimeDensity | null => {
  if (dataArray.length === 0) return null;

  let smallestDensity: TimeDensity = TimeDensity.YEAR;

  for (const obj of dataArray) {
    const currentDensity = obj.data.timeDensity;
    if (
      TIME_DENSITY_ORDER[currentDensity] < TIME_DENSITY_ORDER[smallestDensity]
    ) {
      smallestDensity = currentDensity;
    }
  }

  return smallestDensity;
};
