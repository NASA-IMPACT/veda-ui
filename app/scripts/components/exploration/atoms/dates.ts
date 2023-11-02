import { atom } from 'jotai';

import { DateRange } from '../types.d.ts';
import { getStableValue } from './cache';
import { AtomValueUpdater } from './types';
import { setUrlParam, urlAtom } from './url';

const getValidDateOrNull = (value: any) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

// Main timeline date. This date defines the datasets shown on the map.
export const selectedDateAtom = atom(
  (get) => {
    const txtDate = get(urlAtom).searchParams?.get('date');
    const date = getValidDateOrNull(txtDate);
    return getStableValue('selectedDate', date);
  },
  (get, set, updates: AtomValueUpdater<Date | null>) => {
    const newData =
      typeof updates === 'function'
        ? updates(get(selectedCompareDateAtom))
        : updates;

    set(urlAtom, setUrlParam('date', newData?.toISOString() ?? ''));
  }
);

// Compare date. This is the compare date for the datasets shown on the map.
export const selectedCompareDateAtom = atom(
  (get) => {
    const txtDate = get(urlAtom).searchParams?.get('dateCompare');
    const date = getValidDateOrNull(txtDate);
    return getStableValue('selectedCompareDate', date);
  },
  (get, set, updates: AtomValueUpdater<Date | null>) => {
    const newData =
      typeof updates === 'function'
        ? updates(get(selectedCompareDateAtom))
        : updates;

    set(urlAtom, setUrlParam('dateCompare', newData?.toISOString() ?? ''));
  }
);

// Date range for L&R playheads.
export const selectedIntervalAtom = atom(
  (get) => {
    const txtDate = get(urlAtom).searchParams?.get('dateRange');
    const [start, end] = txtDate?.split('|') ?? [];

    const dateStart = getValidDateOrNull(start);
    const dateEnd = getValidDateOrNull(end);

    if (!dateStart || !dateEnd) return null;

    const range = { start: dateStart, end: dateEnd };
    return getStableValue('selectedInterval', range);
  },
  (get, set, updates: AtomValueUpdater<DateRange | null>) => {
    const newData =
      typeof updates === 'function'
        ? updates(get(selectedIntervalAtom))
        : updates;

    const value = newData
      ? `${newData.start.toISOString()}|${newData.end.toISOString()}`
      : '';

    set(urlAtom, setUrlParam('dateRange', value));
  }
);
