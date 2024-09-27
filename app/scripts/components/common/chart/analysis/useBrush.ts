import { scaleTime } from 'd3';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useResizeObserver } from '$utils/use-resize-observer';

type DraggingState = 'start' | 'drag' | 'end';

/**
 *
 * @param  {[Date, Date]} domain Overall domain for the brush
 * @param {[Date, Date]} currentValues Current start and end for the brush selection. This state needs to be managed from outside the hook.
 * @param {function} changeCallback Callback to call when user updated brush. Receives a [Date, Date] argument
 * @param {number} minBrushWidthPx Minimum Width of the brush allowed, defaults to 10
 * @returns {{ wrapperRef, onBrushMouseDown, containerStyles}}
 */
function useBrush(
  domain: [Date, Date],
  currentValues: [Date, Date],
  changeCallback: ([start, end]: [Date, Date]) => void,
  minBrushWidthPx = 10
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const initialOffsetX = useRef(0);

  const wrapperWidth = useResizeObserver(wrapperRef, { initialWidth: 300 });

  const scale = useMemo(() => {
    return scaleTime()
      .domain(domain)
      .range([0, wrapperWidth]);
  }, [domain, wrapperWidth]);

  const brushX = useMemo(() => {
    return scale(currentValues[0]);
  }, [scale, currentValues]);

  const brushWidth = useMemo(() => {
    return scale(currentValues[1]) - scale(currentValues[0]);
  }, [scale, currentValues]);

  const onBrushMouseDown = useCallback((e) => {
    setDragging(e.target.dataset.role as DraggingState);
  }, []);
  const onBrushMouseUp = useCallback(() => {
    setDragging(null);
    initialOffsetX.current = 0;
  }, []);
  const onBrushMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      const baseX = wrapperRef.current
        ? wrapperRef.current.getBoundingClientRect().x
        : 0;
      const wrapperOffsetedX = e.clientX - baseX;

      if (initialOffsetX.current === 0) {
        initialOffsetX.current = e.offsetX;
      }

      let newStart = currentValues[0];
      let newEnd = currentValues[1];

      if (dragging === 'drag') {
        const dragOffsetedX = wrapperOffsetedX - initialOffsetX.current;
        // Check that drag is not going below or above range
        if (dragOffsetedX <= 0) {
          newStart = scale.invert(0);
          newEnd = scale.invert(brushWidth);
        } else if (dragOffsetedX + brushWidth > wrapperWidth) {
          newEnd = scale.invert(wrapperWidth);
          newStart = scale.invert(wrapperWidth - brushWidth);
        } else {
          newStart = scale.invert(dragOffsetedX);
          newEnd = scale.invert(dragOffsetedX + brushWidth);
        }
      } else {
        if (dragging === 'start') {
          const currentEndX = scale(currentValues[1]);
          newStart =
            // Check that drag witdh stays below minBrushWidthPx
            currentEndX - wrapperOffsetedX < minBrushWidthPx
              ? currentValues[0]
              : scale.invert(wrapperOffsetedX);
        } else {
          const currentStartX = scale(currentValues[0]);
          newEnd =
            // Check that drag witdh stays below minBrushWidthPx
            wrapperOffsetedX - currentStartX < minBrushWidthPx
              ? currentValues[1]
              : scale.invert(wrapperOffsetedX);
        }
        // Check that drag start/end is not going below or above range
        newStart = newStart < domain[0] ? domain[0] : newStart;
        newEnd = newEnd > domain[1] ? domain[1] : newEnd;
      }

      changeCallback([newStart, newEnd]);
    },
    [
      dragging,
      changeCallback,
      scale,
      brushWidth,
      currentValues,
      domain,
      minBrushWidthPx,
      wrapperWidth
    ]
  );

  useEffect(() => {
    document.addEventListener('mouseup', onBrushMouseUp);
    document.addEventListener('mousemove', onBrushMouseMove);
    return () => {
      document.removeEventListener('mouseup', onBrushMouseUp);
      document.removeEventListener('mousemove', onBrushMouseMove);
    };
  }, [onBrushMouseUp, onBrushMouseMove]);

  const containerStyles = useMemo(() => {
    return {
      left: `${brushX}px`,
      width: `${brushWidth}px`,
    };
  }, [brushX, brushWidth]);

  return {
    wrapperRef,
    onBrushMouseDown,
    containerStyles
  };
}

export default useBrush;
