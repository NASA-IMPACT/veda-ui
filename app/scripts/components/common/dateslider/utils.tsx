import useDimensions from 'react-cool-dimensions';
import { extent } from 'd3';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  format
} from 'date-fns';

import {
  CHART_HEIGHT,
  DateSliderDataItem,
  DateSliderTimeDensity
} from './constants';

const margin = { top: 0, right: 0, bottom: 0, left: 0 };

export function useChartDimensions() {
  const { observe, width: elementWidth } = useDimensions();

  const outerWidth = elementWidth > 0 ? elementWidth : 100;
  const outerHeight = CHART_HEIGHT - margin.top - margin.bottom;

  return {
    observe,
    // Dimensions of the wrapper.
    outerWidth,
    outerHeight,
    // Dimensions of the visualization.
    width: outerWidth - margin.left - margin.right,
    height: outerHeight - margin.top - margin.bottom,
    margin
  };
}

const dateFormatByTimeDensity = {
  day: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  year: 'yyyy'
};

/**
 * Creates and array of date entries based on the extent of the provided list of
 * dates, and the time density.
 * For example, if the time density is month it will return a list of monthly
 * dates between the min and max of the given list.
 * For each date in the extent interval we check if there is data for that date.
 * If there is we set the `hasData` property to true and continue. If there is
 * no data, we start grouping the dates with no data.
 * - If the group exceeds the threshold we group them in an entry with 'hasData'
 *   set to false and 'breakLength' set to the length of the group.
 * - If it doesn't exceed we keep all dates with 'hasData' set to false.
 *
 * The resulting array of objects has an 'index' property added to each object,
 * starting from 0 which is needed to correctly position the elements after a
 * .filter operation where we can no longer rely on the array index.
 *
 * @param dates List of dates that have data
 * @param timeDensity Time density of the dates. One of day | month | year
 * @returns Data for the date slider
 */
export function prepareDateSliderData(
  dates: Date[],
  timeDensity: DateSliderTimeDensity
) {
  const domain = extent<Date, Date>(dates, (d) => d) as Date[];

  const dateFormat = dateFormatByTimeDensity[timeDensity];

  const intervalFn = {
    day: eachDayOfInterval,
    month: eachMonthOfInterval,
    year: eachYearOfInterval
  }[timeDensity];

  const searchStrs = dates.map((d) => format(d, dateFormat));

  const allDates = intervalFn({
    start: domain[0],
    end: domain.last
  });

  let data: Omit<DateSliderDataItem, 'index'>[] = [];
  let noDataGroup: Omit<DateSliderDataItem, 'index'>[] = [];

  for (const date of allDates) {
    const hasData = searchStrs.includes(format(date, dateFormat));

    if (!hasData) {
      noDataGroup = noDataGroup.concat({ date, hasData });
    } else {
      // If we find a date with data and it has been less than 20 entries
      // without data we keep them all.
      if (noDataGroup.length < 20) {
        data = data.concat(noDataGroup, { date, hasData });
      } else {
        // Otherwise we add a break group with the first date that doesn't have
        // data and store how many timesteps don't have data (breakLength)
        data = data.concat(
          {
            date: noDataGroup[0].date,
            hasData: false,
            breakLength: noDataGroup.length
          },
          { date, hasData }
        );
      }
      noDataGroup = [];
    }
  }

  // Add an index property which is needed to correctly position the elements
  // after a .filter operation where we can no longer rely on the array index.
  return data.map<DateSliderDataItem>((d, i) => ({ ...d, index: i }));
}

export function getZoomTranslateExtent(
  data,
  xScale
): [[number, number], [number, number]] {
  // The translation extent should always at least encompass the full chart.
  // This handle problems coming from having only 1 data point.
  const end = Math.max(xScale(data.last.index), xScale.range()[1]);
  return [
    [0, 0],
    [end + 16, 0]
  ];
}

export function findDate(
  data: DateSliderDataItem[],
  date: Date | undefined | null,
  timeDensity: DateSliderTimeDensity
) {
  if (!date) return undefined;

  const dateFormat = dateFormatByTimeDensity[timeDensity];
  const item = data.find(
    (d) => format(d.date, dateFormat) === format(date, dateFormat)
  );

  return item;
}
