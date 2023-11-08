import { DateRange } from '../types.d.ts';
import { atomWithUrlValueStability } from './atom-with-url-value-stability';

const getValidDateOrNull = (value: any) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

// Main timeline date. This date defines the datasets shown on the map.
export const selectedDateAtom = atomWithUrlValueStability<Date | null>({
  initialValue: null,
  urlParam: 'date',
  hydrate: (serialized) => {
    return getValidDateOrNull(serialized);
  },
  dehydrate: (date) => {
    return date?.toISOString() ?? '';
  }
});

// Compare date. This is the compare date for the datasets shown on the map.
export const selectedCompareDateAtom = atomWithUrlValueStability<Date | null>({
  initialValue: null,
  urlParam: 'dateCompare',
  hydrate: (serialized) => {
    return getValidDateOrNull(serialized);
  },
  dehydrate: (date) => {
    return date?.toISOString() ?? '';
  }
});

// Date range for L&R playheads.
export const selectedIntervalAtom = atomWithUrlValueStability<DateRange | null>(
  {
    initialValue: null,
    urlParam: 'dateRange',
    hydrate: (serialized) => {
      const [start, end] = serialized?.split('|') ?? [];

      const dateStart = getValidDateOrNull(start);
      const dateEnd = getValidDateOrNull(end);

      if (!dateStart || !dateEnd) return null;

      const range: DateRange = { start: dateStart, end: dateEnd };
      return range;
    },
    dehydrate: (range) => {
      return range
        ? `${range.start.toISOString()}|${range.end.toISOString()}`
        : '';
    }
  }
);
