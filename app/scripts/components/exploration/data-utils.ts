import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  startOfDay,
  startOfMonth,
  startOfYear
} from 'date-fns';
import { DatasetLayer, datasets } from 'veda';
import {
  StacDatasetData,
  TimeDensity,
  TimelineDataset,
  TimelineDatasetStatus
} from './types.d.ts';

import { utcString2userTzDate } from '$utils/date';

export const findParentDataset = (layerId: string) => {
  const parentDataset = Object.values(datasets).find((dataset) =>
    dataset!.data.layers.find((l) => l.id === layerId)
  );
  return parentDataset?.data;
};

export const datasetLayers = Object.values(datasets).flatMap(
  (dataset) => dataset!.data.layers
);

/**
 * Converts the datasets to a format that can be used by the timeline, skipping
 * the ones that have already been reconciled.
 *
 * @param ids The ids of the datasets to reconcile.
 * @param datasetsList The list of datasets layers from VEDA
 * @param reconciledDatasets The datasets that were already reconciled.
 */
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
      status: TimelineDatasetStatus.IDLE,
      data: dataset,
      error: null,
      settings: {
        isVisible: true,
        opacity: 100
      },
      analysis: {
        status: TimelineDatasetStatus.IDLE,
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
