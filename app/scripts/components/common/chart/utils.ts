import { timeFormat, timeParse } from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { UniqueKeyUnit } from '.';

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
  if (!timeString) return null;

  const parseDate = timeParse(dateFormat);
  return parseDate(timeString).getTime();
};

/**
 * Returns data to feed chart. one unit looks like: { xKeyValue: Date, otherPropertiesDrivenFromUniqueKeys }
 * ex. If uniqueKeys are =['no2', 'so2'], xKey is Year, the unit will look like { Year: Date, no2: value, so2: value}
 *
 * @param {object[]} timeSeriesData
 * @param {string[]} dates
 * @param {string} dateFormat How the date was formatted (following d3-date-format ex. %m/%d/%Y)
 * @param {string[]} uniqueKeys
 * @param {string} xKey The key or getter for x-axis which is corresponding to the data.
 */
export function formatTimeSeriesData({
  timeSeriesData,
  dates,
  dateFormat,
  uniqueKeys,
  xKey = 'date'
}: {
  timeSeriesData: object[];
  dates: string[]; // 202205, 202206,...
  dateFormat: string; // %y/%m/%d..
  uniqueKeys: UniqueKeyUnit[]; // min,max,,
  xKey: string;
}) {
  return timeSeriesData
    .map((e, idx) => {
      const currentStat = e;
      return {
        [xKey]: convertToTime({ timeString: dates[idx], dateFormat }),
        ...uniqueKeys.reduce((acc, curr) => {
          return { ...acc, [curr.label]: currentStat[curr.value] };
        }, {})
      };
    })
    .sort((a, b) => a[xKey] - b[xKey]);
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
 * @param {string} xKey The key or getter for x-axis which is corresponding to the data.
 * @param {string} yKey The key or getter for y-axis which is corresponding to the data.
 * @param {string} dateFormat How the date was formatted (following d3-date-format ex. %m/%d/%Y)
 */
export function getFData({
  data,
  idKey,
  xKey,
  yKey,
  dateFormat
}: {
  data: any[];
  idKey: string;
  xKey: string;
  yKey: string;
  dateFormat: string;
}) {
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
    if (!keyObject[entry[xKey]]) {
      keyObject[entry[xKey]] = {
        [xKey]: convertToTime({
          timeString: entry[xKey],
          dateFormat
        }),
        [entry[idKey]]: parseFloat(entry[yKey])
      };
    } else {
      keyObject[entry[xKey]] = {
        ...keyObject[entry[xKey]],
        [entry[idKey]]: parseFloat(entry[yKey])
      };
    }

    return keyObject;
  }, {});

  return {
    uniqueKeys,
    fData: Object.values(fData)
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

function findMatching({
  date1,
  date2,
  formatter
}: {
  date1: Date;
  date2: Date;
  formatter: (d: Date) => string;
}) {
  const formatted1 = formatter(date1);
  const formatted2 = formatter(date2);
  if (formatted1 === formatted2) return true;
  return false;
}

/**
 * method to sync charts on the analysis page
 * active chart is the chart that user is interacting with
 * This method will iterate through with inactive chart's dateformat first
 * ex. When inactive chart's dateformat is %Y/%m 2022/03,
 * and active chart's dateformat is %Y 2022
 * active chart's date will get formatted as 2022/01 -> returns unmatch
 * then this will be iterated through with active chart's dateformat
 * so inactive chart's dateformat will be 2022 -> returns match
 *
 * @param {object} data data of active chart. coming from rechart
 * @param {object[]} chartData data for inactive chart
 * @param {string} xKey xKey for inactive chart
 * @param {string} dateFormat dateFormat for inactive chart
 */

export function syncMethodFunction({
  data,
  chartData,
  xKey,
  dateFormat
}: {
  data: any; // Recharts define data payload as any
  chartData: object[];
  xKey: string;
  dateFormat: string;
}) {
  const { activeLabel, activePayload } = data;
  const formatterFromData = activePayload[0].formatter;

  let matchingIndex: number | null = null;

  for (let i = 0; i < chartData.length; i++) {
    const e = chartData[i];
    if (
      findMatching({
        date1: e[xKey],
        date2: activeLabel,
        formatter: (value) => dateFormatter(value, dateFormat)
      })
    ) {
      matchingIndex = i;
      break;
    }
  }

  if (matchingIndex === null) {
    for (let i = 0; i < chartData.length; i++) {
      const e = chartData[i];
      if (
        findMatching({
          date1: e[xKey],
          date2: activeLabel,
          formatter: formatterFromData
        })
      ) {
        matchingIndex = i;
        break;
      }
    }
  }
  return matchingIndex;
}
