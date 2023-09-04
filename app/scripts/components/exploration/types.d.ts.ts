import { DatasetLayer } from "veda";

export enum TimeDensity {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}

export enum TimelineDatasetStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  ERRORED = 'error'
}

export interface StacDatasetData {
  isPeriodic: boolean;
  timeDensity: TimeDensity;
  domain: string[];
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

export interface TimelineDatasetData extends DatasetLayer {
  isPeriodic: boolean;
  timeDensity: TimeDensity;
  domain: Date[];
}

export interface TimelineDataset {
  status: TimelineDatasetStatus;
  data: TimelineDatasetData;
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
