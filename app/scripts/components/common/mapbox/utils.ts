import { format } from 'date-fns';

import { TimeDensity } from '$context/layer-data';

// @DEPRECATED: File to be DELETED once components referencing these methods have been removed.
// These have moved to "/common/maps/utils"

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
