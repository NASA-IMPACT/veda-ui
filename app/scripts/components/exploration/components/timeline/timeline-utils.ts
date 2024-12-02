import { ScaleTime, Selection, ZoomBehavior, ZoomTransform } from 'd3';
import { TimelineDatasetSuccess } from '$components/exploration/types.d';

/**
 * Clamps the given value to the given range.
 *
 * @param value Value to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

/**
 * Rescales the given scale according to the given factors.
 *
 * @param scale Scale to rescale
 * @param x X factor
 * @param k Scale factor
 * @returns New scale
 */
export function rescaleX(
  scale: ScaleTime<number, number>,
  x: number,
  k: number
) {
  const range = scale.range();
  return scale.copy().domain(
    range.map((v) => {
      // New value after scaling
      const value = (v - x) / k;
      // Clamp value to the range
      const valueClamped = clamp(value, range[0], range[1]);
      return scale.invert(valueClamped);
    })
  );
}

interface Transform {
  x: number;
  y: number;
  k: number;
}

/**
 * Compares two transforms.
 *
 * @param t1 First transform
 * @param t2 Second transform
 * @returns Whether the transforms are equal.
 */
export function isEqualTransform(t1: Transform, t2: Transform) {
  return t1.x === t2.x && t1.y === t2.y && t1.k === t2.k;
}

/**
 * Apply the new transform parameters (x, y, k) to the given element
 * constraining the values according to the zoom behavior's constrain function.
 *
 * @param zoomBehavior The zoom behavior to use.
 * @param element The element to apply the transform to. Must be a d3 selection.
 * @param x The new x value.
 * @param y The new y value.
 * @param k The new k value.
 */
export function applyTransform(
  zoomBehavior: ZoomBehavior<Element, unknown>,
  element: Selection<Element, unknown, any, any>,
  x: number,
  y: number,
  k: number
) {
  const updatedT = new ZoomTransform(k, x, y);
  const constrainFn = zoomBehavior.constrain();
  // Constrain the transform according to the timeline bounds.
  const extent = zoomBehavior.translateExtent();
  const newTransform = constrainFn(updatedT, extent, extent);

  // Apply transform which will cause the zoom event to be emitted without
  // a sourceEvent. On the zoom event listener, the updated zoom transform
  // is set on the state, so there's no need to do it here.
  zoomBehavior.transform(element, newTransform);
}

export const getLabelFormat = (timeDensity) => {
  switch (timeDensity) {
    case 'month':
      return 'MMM yyyy';
    case 'year':
      return 'yyyy';
    default:
      return 'MMM d yyyy';
  }
};

export type TemporalExtent = [Date | undefined, Date | undefined];

/**
 * getTemporalExtent calculates the overall minimum and maximum temporal extent
 * from a set of selected Timeline datasets. Each dataset has a domain that represents
 * the time range it covers. The function returns the earliest start date and the latest end date
 * across all datasets.
 *
 * @param datasets - An array of datasets where each dataset contains a domain array of date strings.
 * @returns A tuple [minDate, maxDate] where minDate is the earliest date and maxDate is the latest date
 *          across all domains, or [undefined, undefined] if no valid dates are found.
 */
export const getTemporalExtent = (
  datasets: TimelineDatasetSuccess[]
): TemporalExtent => {
  const extents: TemporalExtent[] = datasets.map((dataset) => {
    const { domain } = dataset.data;

    if (domain.length === 0) {
      return [undefined, undefined];
    }

    const firstDate = new Date(domain[0]);
    const lastDate = new Date(domain[domain.length - 1]);

    if (isNaN(firstDate.getTime()) || isNaN(lastDate.getTime())) {
      return [undefined, undefined];
    }

    return [firstDate, lastDate];
  });

  // Ensure that both min and max are defined
  const validExtents = extents.filter(
    ([min, max]) => min !== undefined && max !== undefined
  ) as [Date, Date][];

  if (validExtents.length === 0) {
    return [undefined, undefined];
  }

  const minDate = new Date(
    Math.min(...validExtents.map(([min]) => min.getTime()))
  );
  const maxDate = new Date(
    Math.max(...validExtents.map(([, max]) => max.getTime()))
  );

  return [minDate, maxDate];
};
