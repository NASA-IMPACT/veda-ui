import { useEffect, useRef } from 'react';
import { atom, useAtomValue, useSetAtom } from 'jotai';

const voidMousePosition = {
  clientX: undefined,
  clientY: undefined,
  layerX: undefined,
  layerY: undefined
};

const mousePositionAtom = atom<{
  clientX: number | undefined;
  clientY: number | undefined;
  layerX: number | undefined;
  layerY: number | undefined;
}>(voidMousePosition);

/**
 * This hook is used to track the mouse position on the interaction rect. The
 * position is stored in an atom for later retrieval.
 *
 * @param interactionRectEl The element to which the different listeners will be
 * attached.
 */
export function useInteractionRectHover(
  interactionRectEl: HTMLDivElement | null
) {
  const setMousePosition = useSetAtom(mousePositionAtom);

  useEffect(() => {
    if (!interactionRectEl) return;

    const element = interactionRectEl;

    const moveListener = (e) => {
      const { clientX, clientY, layerX, layerY } = e;
      setMousePosition({ clientX, clientY, layerX, layerY });
    };

    const moveOutListener = () => {
      setMousePosition(voidMousePosition);
    };

    element.addEventListener('mousemove', moveListener);
    element.addEventListener('mouseout', moveOutListener);
    element.addEventListener('wheel', moveListener);

    return () => {
      element.removeEventListener('mousemove', moveListener);
      element.removeEventListener('mouseout', moveOutListener);
      element.removeEventListener('wheel', moveListener);
    };
  }, [interactionRectEl, setMousePosition]);
}

type DatasetHoverHookReturn =
  | {
      ref: React.MutableRefObject<HTMLLIElement | undefined>;
      isHovering: false;
      clientX?: undefined;
      midY?: undefined;
      layerX?: undefined;
    }
  | {
      ref: React.MutableRefObject<HTMLLIElement | undefined>;
      isHovering: true;
      clientX: number;
      midY: number;
      layerX: number;
    };

/**
 * This hook checks whether the mouse is hovering over a dataset in the timeline
 * dataset list.
 *
 * This is needed because the interaction rectangle is covering (on top of) the
 * dataset list item and events are not propagated to the list item. The
 * solution is to get the mouse position when it interacts with the interaction
 * rectangle (via useInteractionRectHover hook) and then check if it is inside
 * the dataset list item bounds. This has to be done programmatically by
 * accessing the DOM element's bounding rect.
 *
 * @returns
 */
export function useDatasetHover(): DatasetHoverHookReturn {
  // Ref that will be attached to the dataset list item.
  const elRef = useRef<HTMLLIElement>();
  const rect = elRef.current?.getBoundingClientRect();

  const { clientX, clientY, layerX } = useAtomValue(mousePositionAtom);

  if (
    !rect ||
    clientX === undefined ||
    clientY === undefined ||
    layerX === undefined
  ) {
    return { ref: elRef, isHovering: false };
  }

  const isHovering = 
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom;

  if (!isHovering) {
    return { ref: elRef, isHovering: false };
  }

  return {
    ref: elRef,
    isHovering,
    clientX,
    layerX,
    midY: rect.top + rect.height / 2,
  };
}
