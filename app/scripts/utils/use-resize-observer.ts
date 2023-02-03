import { MutableRefObject, useEffect, useState } from "react";

interface UseResizeObserverProps {
  initialWidth?: number;
}

export const useResizeObserver = (
  ref: MutableRefObject<Element | null>,
  { initialWidth }: UseResizeObserverProps = {}
) => {
  const [width, setWidth] = useState<number>(initialWidth ?? 0);

  useEffect(() => {
    const observeTarget = ref.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setWidth(entry.contentRect.width);
      });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return width;
};