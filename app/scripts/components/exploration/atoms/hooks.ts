import { useCallback, useMemo } from 'react';
import { extent } from 'd3';
import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { add, max } from 'date-fns';

import { DAY_SIZE_MAX } from '../constants';
import { TimelineDataset, TimelineDatasetStatus } from '../types.d.ts';
import { timelineDatasetsAtom, timelineSizesAtom } from './atoms';

/**
 * Calculates the date domain of the datasets, if any are selected.
 * @returns Dataset date domain or undefined.
 */
export function useTimelineDatasetsDomain() {
  const datasets = useAtomValue(timelineDatasetsAtom);
  const { contentWidth } = useAtomValue(timelineSizesAtom);

  const minDays = Math.ceil(contentWidth / DAY_SIZE_MAX);

  return useMemo(() => {
    const successDatasets = datasets.filter(
      (d) => d.status === TimelineDatasetStatus.SUCCEEDED
    );
    if (!successDatasets.length) return undefined;

    // To speed up the calculation of the extent, we assume the dataset's domain
    // is ordered and only look at first and last dates.
    const [start, end] = extent(
      successDatasets.flatMap((d) =>
        d.data.domain ? [d.data.domain[0], d.data.domain.last] : []
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

type TimelineDatasetSettingsReturn = [
  (
    prop: keyof TimelineDataset['settings']
  ) => TimelineDataset['settings'][keyof TimelineDataset['settings']],
  (
    prop: keyof TimelineDataset['settings'],
    value:
      | TimelineDataset['settings'][keyof TimelineDataset['settings']]
      | ((
          prev: TimelineDataset['settings'][keyof TimelineDataset['settings']]
        ) => TimelineDataset['settings'][keyof TimelineDataset['settings']])
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
