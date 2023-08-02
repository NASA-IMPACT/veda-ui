export const RIGHT_AXIS_SPACE = 80;
export const HEADER_COLUMN_WIDTH = 320;
export const DATASET_TRACK_BLOCK_HEIGHT = 16;

export const emptyDateRange = {
  start: null,
  end: null
};

export enum TimeDensity {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}

export interface TimelineDataset {
  status: 'idle' | 'loading' | 'succeeded' | 'errored';
  data: any;
  error: any;
  settings: {
    // user defined settings like visibility, opacity
  };
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ZoomTransformPlain {
  x: number;
  y: number;
  k: number;
}
