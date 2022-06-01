import { useEffect, useMemo } from 'react';
import { useTheme } from 'styled-components';
import useDimensions from 'react-cool-dimensions';
import { DevseedUIThemeMediaRanges } from '@devseed-ui/theme-provider';

type MediaBreakpointStatus = {
  current: keyof DevseedUIThemeMediaRanges;
  isXsmallUp: boolean;
  isXsmallOnly: boolean;
  isXsmallDown: boolean;
  isSmallUp: boolean;
  isSmallOnly: boolean;
  isSmallDown: boolean;
  isMediumUp: boolean;
  isMediumOnly: boolean;
  isMediumDown: boolean;
  isLargeUp: boolean;
  isLargeOnly: boolean;
  isLargeDown: boolean;
  isXlargeUp: boolean;
  isXlargeOnly: boolean;
  isXlargeDown: boolean;
};

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

  if (!theme.mediaRanges)
    throw new Error('There are no media ranges defined in the theme');

  const ranges = Object.entries(theme.mediaRanges);

  // Create breakpoints from media ranges.
  const breakpoints = useMemo(
    () =>
      ranges.reduce(
        (acc, [breakpoint, [lowerBound]]) => ({
          ...acc,
          [breakpoint]: lowerBound || 0
        }),
        {}
      ),
    [ranges]
  );

  const {
    observe,
    currentBreakpoint,
    width: calculatedWidth
  } = useDimensions({
    breakpoints,
    updateOnBreakpointChange: true
  });

  useEffect(() => {
    observe(document.body);
  }, [observe]);

  // On first mount react-cool-dimension will return a width of 0, which breaks
  // the media queries styles because there's a mismatch between the css media
  // queries and the js.
  const width =
    calculatedWidth || (typeof window !== 'undefined' ? window.innerWidth : 0);

  const rangeBooleans = useMemo(
    () =>
      ranges.reduce((acc, [rangeKey, bounds]) => {
        const upper = `${rangeKey.charAt(0).toUpperCase()}${rangeKey.slice(1)}`;
        const makeKey = (b) => `is${upper}${b}`;
        let [lBound, uBound] = bounds;
        lBound = lBound ?? -Infinity;
        uBound = uBound ?? Infinity;

        return {
          ...acc,
          [makeKey('Up')]: width >= lBound,
          [makeKey('Only')]: width >= lBound && width <= uBound,
          [makeKey('Down')]: width <= uBound
        };
      }, {}),
    [ranges, width]
  );

  return useMemo(
    () => ({
      current: currentBreakpoint,
      ...rangeBooleans
    }),
    [currentBreakpoint, rangeBooleans]
  ) as MediaBreakpointStatus;
}
