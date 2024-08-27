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
      return format(date, 'MMM d yyyy');
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
