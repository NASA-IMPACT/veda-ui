import { atom } from 'jotai';

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

// Analysis controller. Stores high level state about the analysis process.
export const analysisControllerAtom = atom({
  isAnalyzing: false,
  runIds: {} as Record<string, number | undefined>,
  isObsolete: false
});
