import { timeFormat, timeParse } from 'd3-time-format';

export const chartHeight = '32rem';

export const dateFormatter = (date, dateFormat) => {
  const format = timeFormat(dateFormat);
  return format(date);
};

export const getTicks = (data, xKey) => {
  const ticks = data.map((e) => new Date(e[xKey]));
  return ticks;
};

export const getDomain = (data, xKey) => {
  if (!data.length) return [0, 0];
  const domain = [data[0][xKey], data[data.length - 1][xKey]];
  return domain;
};

export const convertToTime = ({ timeString, dateFormat, debug }) => {
  if (debug) console.log(timeString);
  const parseDate = timeParse(dateFormat);

  return parseDate(timeString).getTime();
};

export function getFData({ data, idKey, xKey, yKey, dateFormat }) {
  const uniqueKeys = Array.from(new Set(data.map((d) => d[idKey])));
  let fData = [];

  data.reduce((acc, curr) => {
    if (!acc[curr[xKey]]) {
      acc[curr[xKey]] = {
        [curr[idKey]]: parseFloat(curr[yKey])
      };
    } else {
      acc[curr[xKey]] = {
        ...acc[curr[xKey]],
        [curr[idKey]]: parseFloat(curr[yKey])
      };

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
