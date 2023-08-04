import { useMemo } from 'react';
import { extent, scaleTime } from 'd3';
import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { differenceInCalendarDays } from 'date-fns';

import {
  timelineDatasetsAtom,
  timelineSizesAtom,
  zoomTransformAtom
} from './atoms';
import { rescaleX } from './utils';
import { TimelineDataset, TimelineDatasetStatus } from './constants';

/**
 * Calculates the date domain of the datasets, if any are selected.
 * @returns Dataset date domain or undefined.
 */
export function useTimelineDatasetsDomain() {
  const datasets = useAtomValue(timelineDatasetsAtom);

  return useMemo(() => {
    const successDatasets = datasets.filter(
      (d) => d.status === TimelineDatasetStatus.SUCCEEDED
    );
    if (!successDatasets.length) return undefined;

    // To speed up the calculation of the extent, we assume the dataset's domain
    // is ordered and only look at first and last dates.
    return extent(
      successDatasets.flatMap((d) =>
        d.data.domain ? [d.data.domain[0], d.data.domain.last] : []
      )
    ) as [Date, Date];
  }, [datasets]);
}

/**
 * Calculate min and max scale factors, such has each day has a minimum of 2px
 * and a maximum of 100px
 * @returns Minimum and maximum scale factors as k0 and k1.
 */
export function useScaleFactors() {
  const dataDomain = useTimelineDatasetsDomain();
  const { contentWidth } = useAtomValue(timelineSizesAtom);

  // Calculate min and max scale factors, such has each day has a minimum of 2px
  // and a maximum of 100px.
  return useMemo(() => {
    if (contentWidth <= 0 || !dataDomain) return { k0: 0, k1: 1 };
    // Calculate how many days are in the domain.
    const domainDays = differenceInCalendarDays(dataDomain[1], dataDomain[0]);
    return {
      k0: Math.max(1, 2 / (contentWidth / domainDays)),
      k1: 100 / (contentWidth / domainDays)
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
