import { ScaleTime, Selection, ZoomBehavior, ZoomTransform } from 'd3';

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
      const valueClamped = Math.max(range[0], Math.min(value, range[1]));
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
