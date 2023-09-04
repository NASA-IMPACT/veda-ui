import { atom } from 'jotai';
import {
  DataMetric,
  dataMetrics
} from '../components/analysis-metrics-dropdown';

import { HEADER_COLUMN_WIDTH, RIGHT_AXIS_SPACE } from '../constants';
import { DateRange, TimelineDataset, ZoomTransformPlain } from '../types.d.ts';

// Datasets to show on the timeline and their settings
export const timelineDatasetsAtom = atom<TimelineDataset[]>([]);
// Main timeline date. This date defines the datasets shown on the map.
export const selectedDateAtom = atom<Date | null>(null);
// Date range for L&R playheads.
export const selectedIntervalAtom = atom<DateRange | null>(null);
// Zoom transform for the timeline. Values as object instead of d3.ZoomTransform
export const zoomTransformAtom = atom<ZoomTransformPlain>({
  x: 0,
  y: 0,
  k: 1
});
// Width of the whole timeline item. Set via a size observer and then used to
// compute the different element sizes.
export const timelineWidthAtom = atom<number | undefined>(undefined);
// Derived atom with the different sizes of the timeline elements.
export const timelineSizesAtom = atom((get) => {
  const totalWidth = get(timelineWidthAtom);

  return {
    headerColumnWidth: HEADER_COLUMN_WIDTH,
    rightAxisWidth: RIGHT_AXIS_SPACE,
    contentWidth: Math.max(
      1,
      (totalWidth ?? 0) - HEADER_COLUMN_WIDTH - RIGHT_AXIS_SPACE
    )
  };
});
// Whether or not the dataset rows are expanded.
export const isExpandedAtom = atom<boolean>(false);

// What analysis metrics are enabled
export const activeAnalysisMetricsAtom = atom<DataMetric[]>(dataMetrics);

// 🛑 Whether or not an analysis is being performed. Temporary!!!
export const isAnalysisAtom = atom<boolean>(false);
