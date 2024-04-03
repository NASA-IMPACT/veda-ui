import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { select, ZoomBehavior } from 'd3';
import { onTOIZoomAtom } from '../atoms/timeline';
import { applyTransform } from '$components/exploration/components/timeline/timeline-utils';

export function useOnTOIZoom() {
  const [onTOIZoom, setOnTOIZoom] = useAtom(onTOIZoomAtom);

  const initialize = useCallback((zoomBehavior:  ZoomBehavior<Element, unknown>, interactionRef: React.RefObject<HTMLElement>) => {
    setOnTOIZoom(() => (newX: number, newK: number) => {
      if (!newX || !newK) return;
      const { current: interactionElement } = interactionRef;
      if (!interactionElement) return;
      
      applyTransform(
        zoomBehavior,
        select(interactionElement),
        newX,
        0,
        newK
      );
    });
  }, [setOnTOIZoom]);

  const safeOnTOIZoom = (newX: number, newK: number) => {
    if (onTOIZoom) {
      onTOIZoom(newX, newK);
    }
  };

  return { initializeTOIZoom: initialize, onTOIZoom: safeOnTOIZoom };
}
