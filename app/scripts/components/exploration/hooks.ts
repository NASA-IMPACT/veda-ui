import { useCallback, useMemo } from 'react';
import { extent, scaleTime } from 'd3';
import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { add, differenceInCalendarDays, max } from 'date-fns';

import {
  timelineDatasetsAtom,
  timelineSizesAtom,
  zoomTransformAtom
} from './atoms';
import { rescaleX } from './utils';
import {
  DAY_SIZE_MAX,
  DAY_SIZE_MIN,
  TimelineDataset,
  TimelineDatasetStatus
} from './constants';

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
 * Calculate min and max scale factors, such has each day has a minimum of
 * {DAY_SIZE_MIN}px and a maximum of {DAY_SIZE_MAX}px
 * @returns Minimum and maximum scale factors as k0 and k1.
 */
export function useScaleFactors() {
  const dataDomain = useTimelineDatasetsDomain();
  const { contentWidth } = useAtomValue(timelineSizesAtom);

  // Calculate min and max scale factors, such has each day has a minimum of
  // {DAY_SIZE_MIN}px and a maximum of {DAY_SIZE_MAX}px.
  return useMemo(() => {
    if (contentWidth <= 0 || !dataDomain) return { k0: 0, k1: 1 };
    // Calculate how many days are in the domain.
    const domainDays = differenceInCalendarDays(dataDomain[1], dataDomain[0]);

    return {
      k0: Math.max(1, DAY_SIZE_MIN / (contentWidth / domainDays)),
      k1: DAY_SIZE_MAX / (contentWidth / domainDays)
    };
  }, [contentWidth, dataDomain]);
}

/**
 * Creates the scales for the timeline.
 * The main scale takes into account the whole data domain.
 * The scaled scale is the main scale rescaled according to the zoom transform.
 * @param width
 * @returns
 */
export function useScales() {
  const dataDomain = useTimelineDatasetsDomain();
  const zoomTransform = useAtomValue(zoomTransformAtom);
  const { contentWidth } = useAtomValue(timelineSizesAtom);

  const main = useMemo(() => {
    if (!dataDomain) return undefined;
    return scaleTime().domain(dataDomain).range([0, contentWidth]);
  }, [dataDomain, contentWidth]);

  const scaled = useMemo(() => {
    if (!main) return undefined;
    return rescaleX(main, zoomTransform.x, zoomTransform.k);
  }, [main, zoomTransform.x, zoomTransform.k]);

  return { main, scaled };
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
