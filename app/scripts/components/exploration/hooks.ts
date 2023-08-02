import { useMemo } from 'react';
import { extent, scaleTime } from 'd3';
import { useAtomValue } from 'jotai';
import { differenceInCalendarDays } from 'date-fns';

import {
  timelineDatasetsAtom,
  timelineSizesAtom,
  zoomTransformAtom
} from './atoms';
import { rescaleX } from './utils';

/**
 * Calculates the date domain of the datasets, if any are selected.
 * @returns Dataset date domain or undefined.
 */
export function useTimelineDatasetsDomain() {
  const datasets = useAtomValue(timelineDatasetsAtom);

  return useMemo(() => {
    return datasets.length === 0
      ? undefined
      : (extent(datasets.flatMap((d) => d.data.domain)) as [Date, Date]);
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
    // We want to scale this scale only when the zoom transform changes.
    // The zoom transform is what dictates the current timeline view so it is
    // important that it drives the scale. Because the main changes before the
    // zoom transform we can't include it in the deps, otherwise we'd have a
    // weird midway render in the timeline when this scale had reacted to the
    // main change but not to the zoom transform change.
  }, [zoomTransform.x, zoomTransform.k]);

  // In the first run the scaled and main scales are the same.
  return { main, scaled: scaled ?? main };
}
