import { timeFormat, timeParse } from 'd3-time-format';

export const dateFormatter = (date, dateFormat) => {
  const format = timeFormat(dateFormat);
  return format(date);
};

export const getTicks = (data, xKey) => {
  return data.map((e) => new Date(e[xKey]));
};

export const getDomain = (data, xKey) => {
  if (!data.length) return [0, 0];
  return [data[0][xKey], data[data.length - 1][xKey]];
};

export const convertToTime = ({ timeString, dateFormat, debug }) => {
  if (debug) console.log(timeString);
  const parseDate = timeParse(dateFormat);

  return parseDate(timeString).getTime();
};

export function getFData({ data, idKey, xKey, yKey, dateFormat }) {
  const uniqueKeys = Array.from(new Set(data.map((d) => d[idKey])));

  const fData = data.map((d) => {
    return {
      [xKey]: convertToTime({ timeString: d[xKey], dateFormat }),
      [d[idKey]]: parseFloat(d[yKey])
    };
  });
  return {
    uniqueKeys,
    fData
  };
}
