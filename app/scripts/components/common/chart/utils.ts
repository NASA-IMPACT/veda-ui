import { timeFormat, timeParse } from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { UniqueKeyUnit } from '.';
import { formatAsScientificNotation, round } from '$utils/format';
import { HintedError } from '$utils/hinted-error';

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
  if (!parseDate(timeString))
    throw new HintedError(
      `Failed to parse time with the dateFormat provided: ${dateFormat}.`,
      [
        `The data has "${timeString}" as value.`,
        `Please check if you are using the right time format: https://github.com/d3/d3-time-format.`
      ]
    );
  return parseDate(timeString)?.getTime();
};

export type FormattedTimeSeriesData = Record<string, number | string> & {
  date: number;
  dateFormat: string;
};
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
  uniqueKeys
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
      const date: number =
        convertToTime({ timeString: dates[idx], dateFormat }) ?? 0;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]; // This type should get specified once the chart is put together
  idKey: string;
  xKey: string;
  yKey: string;
  dateFormat: string;
}): { uniqueKeys: any[]; fData: FormattedTimeSeriesData[] } {
  // Throw an error if no key is found.
  const columnErrors = [xKey, yKey, idKey]
    .map((key) => ({ key, noErr: Object.keys(data[0]).includes(key) }))
    .filter((e) => !e.noErr)
    .map(
      (e) =>
        `"${e.key}" is not found in columns. Please check if the data has "${e.key}" column.`
    );
  if (columnErrors.length > 0)
    throw new HintedError('Key not found', columnErrors);

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
    if (!keyObject[entry[xKey]]) {
      keyObject[entry[xKey]] = {
        date: convertToTime({
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

export function getNumForChart(x?: number) {
  if (x === undefined || isNaN(x)) return 'n/a';
  if (x === 0) return '0';
  // Between 0.001 and 1000 just round.
  if (Math.abs(x) < 1000 && Math.abs(x) >= 0.001) return round(x, 3).toString();
  return formatAsScientificNotation(x);
}
