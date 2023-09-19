import { useMemo } from 'react';
import { scaleTime } from 'd3';
import { useAtomValue } from 'jotai';
import { differenceInCalendarDays } from 'date-fns';

import { timelineSizesAtom, zoomTransformAtom } from '../atoms/atoms';
import { DAY_SIZE_MAX } from '../constants';
import { useTimelineDatasetsDomain } from '../atoms/hooks';
import { rescaleX } from '../components/timeline/timeline-utils';

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
      // k0: Math.max(1, DAY_SIZE_MIN / (contentWidth / domainDays)),
      k0: 1,
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
