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
export function utcString2userTzDate(str) {
  const date = new Date(str);
  // If the date is not valid, return it and be done.
  if (isNaN(date.getTime())) return date;
  const offset = date.getTimezoneOffset();
  date.setTime(date.getTime() + offset * 60 * 1000);
  return date;
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
