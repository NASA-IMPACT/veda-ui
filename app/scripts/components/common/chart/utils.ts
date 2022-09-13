import { timeFormat, timeParse } from 'd3-time-format';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { object } from 'prop-types';
import { accessToken } from 'mapbox-gl';

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
 * @param {number} bandIndex
 */
export function formatTimeSeriesData({
  timeSeriesData,
  dates,
  dateFormat,
  uniqueKeys,
  xKey = 'date',
  bandIndex = 1
}: {
  timeSeriesData: object[];
  dates: string[]; // 202205, 202206,...
  dateFormat: string; // %y/%m/%d..
  uniqueKeys: string[]; // min,max,,
  xKey: string;
  bandIndex?: number;
}) {
  return timeSeriesData.map((e, idx) => {
    const currentStat = e.properties.statistics[bandIndex];
    return {
      [xKey]: convertToTime({ timeString: dates[idx], dateFormat }),
      ...uniqueKeys.reduce(
        (acc, curr) => ({ ...acc, [curr]: currentStat[curr] }),
        {}
      )
    };
  });
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
