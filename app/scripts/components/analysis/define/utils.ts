import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval
} from 'date-fns';

const DATE_INTERVAL_FN = {
  day: eachDayOfInterval,
  month: eachMonthOfInterval,
  year: eachYearOfInterval
};

/**
 * For each collection, get the number of items within the time range,
 * taking into account the time density.
 * Separated the function from use-stac-collection-search for easy unit test
 */

export function getNumberOfItemsWithinTimeRange(userStart, userEnd, collection) {
  
  const { isPeriodic, timeDensity, domain, timeseries } = collection;
  if (!isPeriodic) {
    const numberOfItems = timeseries.reduce((acc, t) => {
      const date = +new Date(t);
      if (date >= +new Date(userStart) && date <= +new Date(userEnd)) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
    return numberOfItems; // Check in with back-end team
  }
  const eachOf = DATE_INTERVAL_FN[timeDensity];
  const start =
    +new Date(domain[0]) > +new Date(userStart)
      ? new Date(domain[0])
      : new Date(userStart);
  const end =
    +new Date(domain[1]) < +new Date(userEnd)
      ? new Date(domain[1])
      : new Date(userEnd);
  return eachOf({ start, end }).length;
}