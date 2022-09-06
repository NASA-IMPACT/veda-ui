import { timeFormat, timeParse } from 'd3-time-format';
import * as d3ScaleChromatic from 'd3-scale-chromatic';

const groupBy = require('lodash/groupby');

export const dateFormatter = (date: Date, dateFormat: string) => {
  const format = timeFormat(dateFormat);
  return format(date);
};

export const convertToTime = ({ timeString, dateFormat}: {timeString: string, dateFormat: string}) => {
  if (!timeString) return null;

  const parseDate = timeParse(dateFormat);
  return parseDate(timeString).getTime();
};

/**
 * Returns 
 * uniqueKeys: an array of unique keys to represent each line of the chart (and accompanying components such as legend, tooltip)
 * fData: data to feed chart. one unit looks like below
 * { xKeyValue: Date, otherPropertiesDrivenFromUniqueKeys }
 * if uniqueKeys are =['no2', 'so2'], xKey is Year, the object will look like
 * { Year: Date, no2: value, so2: value}
 * 
 * @param {object[]} data 
 * @param {string} idKey The key or getter of a group of data which should be unique in a Chart
 * @param {string} xKey The key or getter for x-axis which is corresponding to the data.
 * @param {string} yKey The key or getter for y-axis which is corresponding to the data.
 * @param {string} dateFormat How the date was formatted (following d3-date-format ex. %m/%d/%Y)
 */

export function getFData({ data, idKey, xKey, yKey, dateFormat }: { data: any[], idKey: string, xKey: string, yKey: string, dateFormat: string }) {
  const uniqueKeys = [...Array.from(new Set(data.map((d) => d[idKey])))].sort();

  const fData: object[] = [];

  // Format ex. [{Year: 2005, no2: 0 }, {Year: 2005, so2: 10}] to [{Year: 2005, no2: 0, so2: 10}]
  // Using an object with xKeyValue as Keys as a midpoint
  // ex. {2005: [{no2: 0, so2:10}]} 
  // once the array length equals to reaches to uniqueKeys length, the unit gest pushed to final data to return
  data.reduce((acc, curr) => {
    // Use acc object so we don't have to iterate (ex.Array.find) the array to find an element
    if (!acc[curr[xKey]]) {
      acc[curr[xKey]] = {
        [curr[idKey]]: parseFloat(curr[yKey])
      };
    } else {
      acc[curr[xKey]] = {
        ...acc[curr[xKey]],
        [curr[idKey]]: parseFloat(curr[yKey])
      };
      // once the array length equals to reaches to uniqueKeys length, the unit gest pushed to final data to return
      if (Object.keys(acc[curr[xKey]]).length === uniqueKeys.length) {
        fData.push({
          ...acc[curr[xKey]],
          [xKey]: convertToTime({
            timeString: curr[xKey],
            dateFormat
          })
        });
      }
    }

    return acc;
  }, {});

  return {
    uniqueKeys,
    fData
  };
}

function getInterpoateFunction(colorScheme: string) {
  const fnName = `interpolate${
    colorScheme[0].toUpperCase() + colorScheme.slice(1)
  }`;
  return d3ScaleChromatic[fnName];
}

export const getColors = function ({ steps, colorScheme } : {steps: number, colorScheme: string}) {
  const colorFn = getInterpoateFunction(colorScheme);
  return new Array(steps).fill(0).map((e, idx) => {
    return colorFn(idx / steps);
  });
};
