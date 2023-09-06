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

export type AnalysisTimeseriesEntry = Record<string, number | null> & {
  date: Date;
};

export interface TimelineDatasetAnalysis {
  status: TimelineDatasetStatus;
  data: {
    timeseries?: AnalysisTimeseriesEntry[];
  };
  error: any;
  meta: {
    loaded?: number;
    total?: number;
  };
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
  analysis: TimelineDatasetAnalysis;
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