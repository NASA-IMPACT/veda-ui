import { useCallback, useMemo } from 'react';
import { extent } from 'd3';
import { PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { focusAtom } from 'jotai-optics';
import { add, max } from 'date-fns';

import { DAY_SIZE_MAX } from '../constants';
import {
  TimeDensity,
  TimelineDataset,
  DatasetStatus,
  TimelineDatasetSuccess
} from '../types.d.ts';
import { timelineSizesAtom } from './timeline';
import { timelineDatasetsAtom } from './datasets';

function addDurationToDate(date, timeDensity: TimeDensity) {
  const duration = {
    [TimeDensity.YEAR]: { years: 1 },
    [TimeDensity.MONTH]: { months: 1 },
    [TimeDensity.DAY]: { days: 1 }
  }[timeDensity];

  return add(date, duration);
}

/**
 * Calculates the date domain of the datasets, if any are selected, adjusting
 * based on the available content width. The domain is expanded to ensure that
 * the timeline displays at least a minimum number of days (minDays), which is
 * derived from the content width. This function does not determine the absolute
 * maximum temporal extent of all datasets but ensures the timeline covers a
 * suitable range of dates based on the current width of the timeline.
 *
 * @returns Dataset date domain or undefined.
 */
export function useTimelineDatasetsDomain() {
  const datasets = useAtomValue(timelineDatasetsAtom);
  const { contentWidth } = useAtomValue(timelineSizesAtom);

  const minDays = Math.ceil(contentWidth / DAY_SIZE_MAX);

  return useMemo(() => {
    const successDatasets = datasets.filter(
      (d): d is TimelineDatasetSuccess => d.status === DatasetStatus.SUCCESS
    );
    if (!successDatasets.length) return undefined;

    // To speed up the calculation of the extent, we assume the dataset's domain
    // is ordered and only look at first and last dates.
    const [start, end] = extent(
      successDatasets.flatMap((d) =>
        d.data.domain.length
          ? [
              d.data.domain[0],
              addDurationToDate(d.data.domain.last, d.data.timeDensity)
            ]
          : []
      )
    ) as [Date, Date];

    return [start, max([end, add(start, { days: minDays })])] as [Date, Date];
  }, [datasets, minDays]);
}

/**
 * Creates a focus atom for a dataset with the given id.
 *
 * @param id The dataset id for which to create the atom.
 * @returns Focus atom for the dataset with the given id.
 */
export function useTimelineDatasetAtom(id: string) {
  const datasetAtom = useMemo(() => {
    return focusAtom(timelineDatasetsAtom, (optic) =>
      optic.find((d) => d.data.id === id)
    );
  }, [id]);

  return datasetAtom as PrimitiveAtom<TimelineDataset>;
}

type Settings = TimelineDataset['settings'];

type TimelineDatasetSettingsReturn = [
  <T extends keyof Settings>(prop: T) => Settings[T],
  <T extends keyof Settings>(
    prop: T,
    value: Settings[T] | ((prev: Settings[T]) => Settings[T])
  ) => void
];

/**
 * Hook to get/set the settings of a dataset.
 *
 * @param datasetAtom Single dataset atom.
 * @returns State getter/setter for the dataset settings.
 *
 * @example
 *   const [get, set] = useTimelineDatasetSettings(datasetAtom);
 *   const isVisible = get('isVisible');
 *   set('isVisible', !isVisible);
 *   set('isVisible', (prev) => !prev);
 *
 */
export function useTimelineDatasetSettings(
  datasetAtom: PrimitiveAtom<TimelineDataset>
): TimelineDatasetSettingsReturn {
  const settingsAtom = useMemo(() => {
    return focusAtom(datasetAtom, (optic) => optic.prop('settings'));
  }, [datasetAtom]);

  const [value, set] = useAtom(settingsAtom);

  const setter = useCallback(
    (prop, value) => {
      set((prev) => {
        const currValue = prev[prop];
        const newValue = typeof value === 'function' ? value(currValue) : value;
        return { ...prev, [prop]: newValue };
      });
    },
    [set]
  );

  const getter = useCallback((prop) => value[prop], [value]);

  return [getter, setter];
}

/**
 * Hook to get/set the visibility of a dataset.
 * @param datasetAtom Single dataset atom.
 * @returns State getter/setter for the dataset visibility.
 */
export function useTimelineDatasetVisibility(
  datasetAtom: PrimitiveAtom<TimelineDataset>
) {
  const visibilityAtom = useMemo(() => {
    return focusAtom(datasetAtom, (optic) =>
      optic.prop('settings').prop('isVisible')
    );
  }, [datasetAtom]);

  return useAtom(visibilityAtom);
}

export const useTimelineDatasetAnalysis = (
  datasetAtom: PrimitiveAtom<TimelineDataset>
) => {
  return useSetAtom(
    focusAtom(
      datasetAtom,
      // (Use OpticsFor type from optics-ts)
      // @ts-expect-error:  For now until making sure this is the solution
      useCallback((optic) => optic.prop('analysis'), [])
    )
  );
};
