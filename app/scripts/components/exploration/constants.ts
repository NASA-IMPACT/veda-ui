export const RIGHT_AXIS_SPACE = 80;
export const HEADER_COLUMN_WIDTH = 320;
export const DATASET_TRACK_BLOCK_HEIGHT = 16;

export const DAY_SIZE_MIN = 2;
export const DAY_SIZE_MAX = 100;

export const emptyDateRange = {
  start: null,
  end: null
};

export enum TimeDensity {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}

export enum TimelineDatasetStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'succeeded',
  ERRORED = 'errored'
}

export interface TimelineDataset {
  status: TimelineDatasetStatus;
  data: any;
  error: any;
  settings: {
    // user defined settings like visibility, opacity
    isVisible?: boolean;
    opacity?: number;
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
