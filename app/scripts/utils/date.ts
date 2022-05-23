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
 * Times I had timezone related bugs and this fn saved me: 7
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
