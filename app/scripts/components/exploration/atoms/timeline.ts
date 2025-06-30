import { atom } from 'jotai';

import { HEADER_COLUMN_WIDTH, RIGHT_AXIS_SPACE } from '../constants';
import { ZoomTransformPlain } from '../types.d.ts';

// Zoom transform for the timeline. Values as object instead of d3.ZoomTransform
export const zoomTransformAtom = atom<ZoomTransformPlain>({
  x: 0,
  y: 0,
  k: 1
});

// Atom to zoom TOI when analysis is run
type ZoomTOIFunction = (newX: number, newK: number) => void;
export const onTOIZoomAtom = atom<ZoomTOIFunction | null>(null);

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
