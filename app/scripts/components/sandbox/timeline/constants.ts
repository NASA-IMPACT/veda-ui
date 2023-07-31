export const RIGHT_AXIS_SPACE = 80;
export const HEADER_COLUMN_WIDTH = 320;

export enum TimeDensity {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}

export interface TimelineDataset {
  title: string;
  timeDensity: TimeDensity;
  domain: Date[];
}
