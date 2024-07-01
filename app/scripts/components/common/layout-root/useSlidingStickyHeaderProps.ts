import { useContext } from "react";
import { LayoutRootContext } from "./context";

/**
 * Hook to access the values needed to position the sticky headers.
 */
export function useSlidingStickyHeaderProps() {
  const { isHeaderHidden, headerHeight, wrapperHeight } =
    useContext(LayoutRootContext);

  return {
    isHeaderHidden,
    headerHeight,
    wrapperHeight
  };
}
