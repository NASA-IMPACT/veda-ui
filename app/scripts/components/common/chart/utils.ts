import { timeFormat, timeParse } from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { UniqueKeyUnit } from '.';
import { formatAsScientificNotation, round } from '$utils/format';

export const timeFormatter = (time: number, dateFormat: string) => {
  return dateFormatter(new Date(time), dateFormat);
};

export const dateFormatter = (date: Date, dateFormat: string) => {
  const format = timeFormat(dateFormat);
  return format(date);
};

export const convertToTime = ({
  timeString,
  dateFormat
}: {
  timeString: string | undefined;
  dateFormat: string;
}) => {
  if (!timeString) return undefined;
  const parseDate = timeParse(dateFormat);
  return parseDate(timeString)?.getTime();
};

type FormattedTimeSeriesData = Record<string, number | string> & {
  date: number
  dateFormat: string
}
/**
 * Returns data to feed chart. one unit looks like: { xKeyValue: Date, otherPropertiesDrivenFromUniqueKeys }
 * ex. If uniqueKeys are =['no2', 'so2'], xKey is Year, the unit will look like { Year: Date, no2: value, so2: value}
 *
 * @param {object[]} timeSeriesData
 * @param {string[]} dates
 * @param {string} dateFormat How the date was formatted (following d3-date-format ex. %m/%d/%Y)
 * @param {string[]} uniqueKeys
 */
export function formatTimeSeriesData({
  timeSeriesData,
  dates,
  dateFormat,
  uniqueKeys,
}: {
  timeSeriesData: Record<string, any>[];
  dates: string[]; // 202205, 202206,...
  dateFormat: string; // %y/%m/%d..
  uniqueKeys: UniqueKeyUnit[]; // min,max,,
}): FormattedTimeSeriesData[] {
  /* eslint-disable-next-line fp/no-mutating-methods */
  return timeSeriesData
    .map((e, idx) => {
      const currentStat = e;
      const date: number = convertToTime({ timeString: dates[idx], dateFormat }) ?? 0;
      return {
        date,
        dateFormat,
        ...uniqueKeys.reduce((acc, curr) => {
          return { ...acc, [curr.label]: currentStat[curr.value] };
        }, {})
      };
    })
    .sort((a, b) => a.date - b.date);
}

/**
 * Returns
 * {
 *    uniqueKeys: an array of unique keys to represent each line of the chart (and accompanying components such as legend, tooltip)
 *    fData: data to feed chart. one unit looks like: { xKeyValue: Date, otherPropertiesDrivenFromUniqueKeys }
 * }
 * ex. If uniqueKeys are =['no2', 'so2'], xKey is Year, the unit will look like { Year: Date, no2: value, so2: value}
 *
 * @param {object[]} data
 * @param {string} idKey The key or getter of a group of data which should be unique in a Chart
 * @param {string} yKey The key or getter for y-axis which is corresponding to the data.
 * @param {string} dateFormat How the date was formatted (following d3-date-format ex. %m/%d/%Y)
 */
export function getFData({
  data,
  idKey,
  yKey,
  dateFormat
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]; // This type should get specified once the chart is put together
  idKey: string;
  yKey: string;
  dateFormat: string;
}) {
  /* eslint-disable-next-line fp/no-mutating-methods */
  const uniqueKeys = [...Array.from(new Set(data.map((d) => d[idKey])))].sort();

  // Format csv/json data into chart suitable data
  // ## From:
  // {
  //   "xkey": xKey value,
  //   "yKey": yKey value,
  //   "idKey": idKey value
  // }
  // ## to
  // {
  //   "xkey": xKey value,
  //   "idKey value": yKey value
  // }

  // This reduce function will yield an object with x values as keys / data units as values
  // we will use the values of this object
  const fData = data.reduce((keyObject, entry) => {
    if (!keyObject[entry.date]) {
      keyObject[entry.date] = {
        date: convertToTime({
          timeString: entry.date,
          dateFormat
        }),
        [entry[idKey]]: parseFloat(entry[yKey])
      };
    } else {
      keyObject[entry.date] = {
        ...keyObject[entry.date],
        [entry[idKey]]: parseFloat(entry[yKey])
      };
    }

    return keyObject;
  }, {});

  return {
    uniqueKeys,
    fData: Object.values(fData) as object[]
  };
}

function getInterpolateFunction(colorScheme: string) {
  const fnName = `interpolate${
    colorScheme[0].toUpperCase() + colorScheme.slice(1)
  }`;
  return d3ScaleChromatic[fnName];
}

export const getColors = function ({
  steps,
  colorScheme = 'viridis'
}: {
  steps: number;
  colorScheme: string;
}) {
  const colorFn = getInterpolateFunction(colorScheme);

  return new Array(steps).fill(0).map((e, idx) => colorFn(idx / steps));
};

function isSameFormattedDate({
  date1,
  date2,
  formatter
}: {
  date1: Date;
  date2: Date;
  formatter: (d: Date) => string;
}) {
  return formatter(date1) === formatter(date2);
}

/**
 * method to sync charts on the analysis page
 * matches two dates in different formats by consolidating formats
 * (active chart is the chart that user is interacting with, inactive charts are the rest of the page)
 * ex. When active chart's format is less granular:
 * When active chart's dateformat is %Y 2022, inactive charts format is %Y/%m 2022/03
 * inactive chart's value gets formatted as active chart's dateformat (2022) - returns true
 * ex. When active chart's format is more granular:
 * When active chart's dateformat is %Y/%m 2022/03, inactive charts format is %Y 2022
 * inactive chart's value gets formatted as active format first 2022/01,
 * since there is no matching, the method will try again to consolidate dateformat with inactive chart's format
 * @param {object} data data of active chart. coming from rechart
 * @param {object[]} chartData data for inactive chart
 * @param {string} dateFormat dateFormat for inactive chart
 */

export function syncMethodFunction({
  data,
  chartData,
  dateFormat,
  startDate,
  endDate
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // Recharts define data payload as any
  chartData: any[];
  dateFormat: string;
  startDate: number;
  endDate: number;
}) {
  const { activeLabel, activePayload } = data;
  const dateFormatFromData = activePayload[0].payload.dateFormat;

  let matchingIndex: number | null = -1;
  // Make sure that matching point is in current (zoomed) chart
  const filteredChartData = chartData.filter(
    (e) => e.date <= endDate && e.date >= startDate
  );

  matchingIndex = filteredChartData.findIndex((e) => {
    return isSameFormattedDate({
      date1: e.date,
      date2: activeLabel,
      formatter: (value) => dateFormatter(value, dateFormat)
    });
  });

  if (matchingIndex < 0) {
    matchingIndex = chartData.findIndex((e) => {
      return isSameFormattedDate({
        date1: e.date,
        date2: activeLabel,
        formatter: (value) => dateFormatter(value, dateFormatFromData)
      });
    });
  }

  return matchingIndex;
}
export function getNumForChart(x?: number) {
  if (x === undefined || isNaN(x)) return 'n/a';
  if (x === 0) return '0';
  // Between 0.001 and 1000 just round.
  if (Math.abs(x) < 1000 && Math.abs(x) >= 0.001) return round(x, 3).toString();
  return formatAsScientificNotation(x);
}
