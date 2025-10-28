import { useCallback } from 'react';

import { useSafeState } from '../../utils/use-safe-state';

/**
 * React hook to be used with react-indiana-drag-scroll
 * Checks whether the user is scrolling.
 *
 * @returns object
 *  object.isScrolling {bool} Whether or not the user is scrolling.
 *  object.scrollProps {object} Props to attach to the scroller
 */
export const useReactIndianaScrollControl = () => {
  const [isScrolling, setScrolling] = useSafeState(false);

  const onStartScroll = useCallback(() => {
    setScrolling(true);
  }, [setScrolling]);

  // When the scroll ends we have to wait before setting the scroll as false to
  // give time for the click event to fire. This is needed because we're using
  // the scroll status to allow or block the click on a card and if we don't
  // wait, by the time the click event fires, the value will already be false.
  const onEndScroll = useCallback(() => {
    setTimeout(() => {
      setScrolling(false);
    }, 1);
  }, [setScrolling]);

  return {
    isScrolling,
    scrollProps: {
      onStartScroll,
      onEndScroll,
    },
  };
};
