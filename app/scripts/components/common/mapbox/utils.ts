import { format } from 'date-fns';

import { TimeDensity } from '$context/layer-data';

const dateFormats = {
  year: 'yyyy',
  month: 'LLL yyyy',
  day: 'LLL do, yyyy'
};

export function formatSingleDate(date: Date, timeDensity?: TimeDensity) {
  return format(date, dateFormats[timeDensity || 'day']);
}

export function formatCompareDate(
  dateA: Date,
  dateB: Date,
  timeDensityA?: TimeDensity,
  timeDensityB?: TimeDensity
) {
  return `${formatSingleDate(dateA, timeDensityA)} VS ${formatSingleDate(
    dateB,
    timeDensityB
  )}`;
}
