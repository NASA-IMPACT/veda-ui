import { useEffect, useMemo } from 'react';
import { useTheme } from 'styled-components';
import useDimensions from 'react-cool-dimensions';

/**
 * Returns the current media query and a series of boolean values indicating
 * which media ranges are active.
 *
 * @returns object
 * {
 *  "current": String,
 *  "isXsmallUp": Boolean,
 *  "isXsmallOnly": Boolean,
 *  "isXsmallDown": Boolean,
 *  "isSmallUp": Boolean,
 *  "isSmallOnly": Boolean,
 *  "isSmallDown": Boolean,
 *  "isMediumUp": Boolean,
 *  "isMediumOnly": Boolean,
 *  "isMediumDown": Boolean,
 *  "isLargeUp": Boolean,
 *  "isLargeOnly": Boolean,
 *  "isLargeDown": Boolean,
 *  "isXlargeUp": Boolean,
 *  "isXlargeOnly": Boolean,
 *  "isXlargeDown": Boolean
 * }
 */
export function useMediaQuery() {
  const theme = useTheme();

  // Create breakpoints from media ranges.
  const breakpoints = useMemo(
    () =>
      Object.keys(theme.mediaRanges).reduce(
        (acc, key) => ({
          ...acc,
          [key]: theme.mediaRanges[key][0] || 0
        }),
        {}
      ),
    [theme.mediaRanges]
  );

  const { observe, currentBreakpoint, width } = useDimensions({
    breakpoints,
    updateOnBreakpointChange: true
  });

  useEffect(() => {
    observe(document.body);
  }, [observe]);

  const rangeBooleans = useMemo(
    () =>
      Object.keys(theme.mediaRanges).reduce((acc, rangeKey) => {
        const upper = `${rangeKey.charAt(0).toUpperCase()}${rangeKey.slice(1)}`;
        const makeKey = (b) => `is${upper}${b}`;
        let [lBound, uBound] = theme.mediaRanges[rangeKey];
        lBound = lBound ?? -Infinity;
        uBound = uBound ?? Infinity;

        return {
          ...acc,
          [makeKey('Up')]: width >= lBound,
          [makeKey('Only')]: width >= lBound && width <= uBound,
          [makeKey('Down')]: width <= uBound
        };
      }, {}),
    [theme.mediaRanges, width]
  );

  return useMemo(
    () => ({
      current: currentBreakpoint,
      ...rangeBooleans
    }),
    [currentBreakpoint, rangeBooleans]
  );
}
