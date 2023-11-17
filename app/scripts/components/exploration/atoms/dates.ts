import { DateRange } from '../types.d.ts';
import { atomWithUrlValueStability } from './atom-with-url-value-stability';

// We cannot start a date with null.
// We need to load the params at the start, otherwise when the
// atomWithUrlValueStability compares a date from the url with the initial null,
// it will always return the url value, which will always be a new Date object.
const initialParams = new URLSearchParams(window.location.search);

const getValidDateOrNull = (value: any) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

const hydrateDate = (serialized) => {
  return getValidDateOrNull(serialized);
};

// Main timeline date. This date defines the datasets shown on the map.
export const selectedDateAtom = atomWithUrlValueStability<Date | null>({
  initialValue: hydrateDate(initialParams.get('date')),
  urlParam: 'date',
  hydrate: hydrateDate,
  dehydrate: (date) => {
    return date?.toISOString() ?? '';
  }
});

// Compare date. This is the compare date for the datasets shown on the map.
export const selectedCompareDateAtom = atomWithUrlValueStability<Date | null>({
  initialValue: hydrateDate(initialParams.get('dateCompare')),
  urlParam: 'dateCompare',
  hydrate: hydrateDate,
  dehydrate: (date) => {
    return date?.toISOString() ?? '';
  }
});

const hydrateRange = (serialized) => {
  const [start, end] = serialized?.split('|') ?? [];

  const dateStart = getValidDateOrNull(start);
  const dateEnd = getValidDateOrNull(end);

  if (!dateStart || !dateEnd) return null;

  const range: DateRange = { start: dateStart, end: dateEnd };
  return range;
};

// Date range for L&R playheads.
export const selectedIntervalAtom = atomWithUrlValueStability<DateRange | null>(
  {
    initialValue: hydrateRange(initialParams.get('dateRange')),
    urlParam: 'dateRange',
    hydrate: hydrateRange,
    dehydrate: (range) => {
      return range
        ? `${range.start.toISOString()}|${range.end.toISOString()}`
        : '';
    }
  }
);
