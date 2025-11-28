import format from 'date-fns/format';
import isSameMonth from 'date-fns/isSameMonth';
import isSameYear from 'date-fns/isSameYear';
import parse from 'date-fns/parse';
import startOfYear from 'date-fns/startOfYear';
import sub from 'date-fns/sub';

/**
 * Create a date which matches the input date offsetting the timezone to match
 * the user's.
 * If the user is in UTC-5 time and the date string is in UTC the date will be
 * constructed disregarding the input date's timezone.
 * Ex:
 * input: 2019-01-01T00:00:00Z
 * normal output: 2018-12-31T19:00:00 -05:00
 * utcDate output: 2019-01-01T00:00:00 -05:00
 *
 * Basically it parses the date ignoring the timezone and treats it as if the
 * date is already in the user's Tz.
 * Times I had timezone related bugs and this fn saved me: 8
 *
 * Reverse function of userTzDate2utcString()
 *
 * @param {string} str Date String
 * @returns Date
 */
export function utcString2userTzDate(str?: string | null) {
  // Always return a Date even if invalid
  if (typeof str !== 'string') {
    return new Date('invalid');
  }

  // The date should always be in the user's TZ but the input string affects
  // how the date is constructed.
  // An input string of only year or with `-` (2020-01 | 2020-1-1) will be
  // considered to be in ISO format, meaning that the user date will be this
  // date +- the TZ offset. For example:
  // 2020-01-01
  //   Tue Dec 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)
  //   Wed Jan 01 2020 01:00:00 GMT+0100 (Central European Time)
  //
  // whereas 2020/01/01
  //   Wed Jan 01 2020 00:00:00 GMT-0500 (Eastern Standard Time)
  //   Wed Jan 01 2020 00:00:00 GMT+0100 (Central European Time)
  // and if converted to ISO
  //   2020-01-01T05:00:00.000Z
  //   2020-01-01T01:00:00.000Z
  //
  // The code below ensures that all dates behave the same.
  //
  const isoYearOrMonth = str.match(/^([0-9]{4})(?:-([0-9]{1,2}))?$/);
  const isoMatch = str.match(/^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/);

  if (isoYearOrMonth || isoMatch) {
    const date = new Date(str);
    // If the date is not valid, return it and be done.
    if (isNaN(date.getTime())) return date;
    const offset = date.getTimezoneOffset();
    date.setTime(date.getTime() + offset * 60 * 1000);
    // @TODO: needed?
    date.setMinutes(date.getMinutes());
    date.setSeconds(date.getSeconds());
    return date;
  } else {
    // For the full date view Date does a good job, except with the ordinal
    // numbers. Remove those from the date before parsing.
    return new Date(str.replace(/([0-9])(st|nd|rd|th)/g, '$1'));
  }
}

/**
 * Converts the date to a ISO string offsetting the timezone.
 *
 * Basically it coverts the date to a string ignoring the timezone and treating
 * it as if the date is already in UTC.
 *
 * Reverse function of utcString2userTzDate()
 *
 * @param date The Date
 * @returns string
 */
export function userTzDate2utcString(date) {
  const tz = date.getTimezoneOffset();
  const d = new Date(date.getTime() - tz * 60000);
  return d.toISOString();
}

/**
 * Check if the date is yyyy-mm-dd format
 * Ex. 2019/10-03 : invalid
 * 2019/01/02: invalid
 * 2019/13/01: invalid
 */
export function isValidDate(dateString?: string | null) {
  const date = utcString2userTzDate(dateString);
  return !isNaN(date.getTime());
}

/**
 * Format the date in a pretty way as to not repeat values if the month or
 * year are the same.
 * Examples:
 * Jan 1st, 2020 to Dec 31st, 2021
 * Jan 1st - Dec 31st, 2020
 * Dec 01-31, 2020
 * Dec 31st, 2020
 *
 * @param {object} start Start date to format
 * @param {object} end End date to format
 * @param {string} datesSeparator Separator to use with dates without any common
 * element. Defaults to " to "
 * @param {boolean} useOrdinalDays Whether or not to use ordinal days: 1st, 2nd
 */
export function formatDateRange(
  start: Date,
  end: Date,
  datesSeparator = ' to ',
  useOrdinalDays = true
) {
  const DATE_FORMAT_FULL = useOrdinalDays ? 'MMM do, yyyy' : 'MMM dd, yyyy';

  // Format the label in a pretty way as to not repeat values if the month or
  // year are the same.
  // Examples:
  // Jan 1st, 2020 to Dec 31st, 2021
  // Jan 1st — Dec 31st, 2020
  // Dec 01-31, 2020
  // Dec 31st, 2020

  const startStr = format(start, DATE_FORMAT_FULL);
  const endStr = format(end, DATE_FORMAT_FULL);

  if (startStr === endStr) {
    return startStr;
  }

  // Things get trickier when we have to compare dates. Here the range plays a
  // role.
  if (isSameMonth(start, end) && isSameYear(start, end)) {
    return `${format(start, 'MMM dd')}-${format(end, 'dd, yyyy')}`;
  } else if (isSameYear(start, end)) {
    const monthDayFormat = useOrdinalDays ? 'MMM do' : 'MMM dd';
    return `${format(start, monthDayFormat)}${datesSeparator}${endStr}`;
  } else {
    return `${startStr}${datesSeparator}${endStr}`;
  }
}

/**
 * Converts a native JS date to the format accepted by HTML inputs
 * @param date
 * @returns string
 */
export function dateToInputFormat(date?: Date) {
  if (!date) return undefined;
  return format(date, 'yyyy-MM-dd');
}

export function inputFormatToDate(inputFormat: string) {
  const d = parse(inputFormat, 'yyyy-MM-dd', new Date());
  return isNaN(d.getTime()) ? null : d;
}

export type DateRangePreset =
  | 'yearToDate'
  | 'last30Days'
  | 'lastYear'
  | 'last10Years'
  | '2018-2022';

export function getRangeFromPreset(preset: DateRangePreset): {
  start: Date;
  end: Date;
} {
  let end = new Date();
  let start = startOfYear(new Date());
  if (preset === 'last30Days') {
    start = sub(end, { days: 30 });
  } else if (preset === 'lastYear') {
    start = sub(end, { years: 1 });
  } else if (preset === 'last10Years') {
    start = sub(end, { years: 10 });
  } else if (preset === '2018-2022') {
    start = new Date(2018, 0, 1);
    end = new Date(2022, 11, 31);
  }
  return {
    start,
    end
  };
}
