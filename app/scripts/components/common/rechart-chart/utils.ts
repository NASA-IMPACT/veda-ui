import { timeFormat, timeParse } from 'd3-time-format';

export const dateFormatter = (date: Date, dateFormat: string) => {
  const format = timeFormat(dateFormat);
  return format(date);
};

export const convertToTime = ({ timeString, dateFormat}: {timeString: string, dateFormat: string}) => {
  if (!timeString) return null;

  const parseDate = timeParse(dateFormat);
  return parseDate(timeString).getTime();
};

export function getFData({ data, idKey, xKey, yKey, dateFormat }: { data: any[], idKey: string, xKey: string, yKey: string, dateFormat: string }) {
  const uniqueKeys = [...Array.from(new Set(data.map((d) => d[idKey])))].sort();

  const fData: object[] = [];
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
      // Once the object got all the attributes with matching xKey, push it to final data
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
