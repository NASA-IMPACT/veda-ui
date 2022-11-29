import { scaleTime } from 'd3';
import { useCallback, useMemo, useRef, useState } from 'react';

type DraggingState = 'start' | 'drag' | 'end';

function useBrush(
  width: number,
  domain: [Date, Date],
  currentValues: [Date, Date],
  changeCallback: (start, end) => void
) {
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  // const [brushX, setBrushX] = useState(0);
  const currentX = useRef(0);
  const initialX = useRef(0);
  const xOffset = useRef(0);
  const scale = useMemo(() => {
    return scaleTime()
      .domain(domain as [any, any])
      .range([0, width]);
  }, [domain, width]);

  const brushX = useMemo(() => {
    return scale(currentValues[0]);
  }, [scale, currentValues]);

  const brushWidth = useMemo(() => {
    return scale(currentValues[1]) - scale(currentValues[0]);
  }, [scale, currentValues]);

  const onBrushMouseUp = useCallback(() => {
    setDragging(null);
    initialX.current = currentX.current;
    document.removeEventListener('mouseup', onBrushMouseUp);
  }, []);
  const onBrushMouseDown = useCallback(
    (e) => {
      setDragging(e.target.dataset.role as DraggingState);
      initialX.current = e.clientX - xOffset.current;
      document.addEventListener('mouseup', onBrushMouseUp);
    },
    [onBrushMouseUp]
  );
  const onBrushMouseMove = useCallback(
    (e) => {
      if (dragging) {
        currentX.current = e.clientX - initialX.current;
        xOffset.current = currentX.current;

        if (dragging === 'drag') {
          const newStart = scale.invert(currentX.current);
          const newEnd = scale.invert(currentX.current + brushWidth);
          changeCallback(newStart, newEnd);
        } else if (dragging === 'start') {
          changeCallback(scale.invert(currentX.current), currentValues[1]);
        } else {
          console.log(scale.invert(currentX.current))
          changeCallback(currentValues[0], currentValues[1]);
        }
      }
    },
    [dragging, changeCallback, scale, brushWidth, currentValues]
  );

  return {
    onBrushMouseDown,
    onBrushMouseUp,
    onBrushMouseMove,
    brushX,
    brushWidth
  };
}

export default useBrush;
