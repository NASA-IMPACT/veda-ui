import { DatasetLayer } from 'veda';

export enum TimeDensity {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}

export enum TimelineDatasetStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface StacDatasetData {
  isPeriodic: boolean;
  timeDensity: TimeDensity;
  domain: string[];
}

export type AnalysisTimeseriesEntry = Record<string, number | null> & {
  date: Date;
};

// TimelineDatasetAnalysis type discriminants
export interface TimelineDatasetAnalysisIdle {
  status: TimelineDatasetStatus.IDLE;
  data: null;
  error: null;
  meta: Record<string, never>;
}
export interface TimelineDatasetAnalysisLoading {
  status: TimelineDatasetStatus.LOADING;
  data: null;
  error: null;
  meta: {
    loaded?: number;
    total?: number;
  };
}
export interface TimelineDatasetAnalysisError {
  status: TimelineDatasetStatus.ERROR;
  data: null;
  error: unknown;
  meta: {
    loaded?: number;
    total?: number;
  };
}
export interface TimelineDatasetAnalysisSuccess {
  status: TimelineDatasetStatus.SUCCESS;
  data: {
    timeseries: AnalysisTimeseriesEntry[];
  };
  error: null;
  meta: {
    loaded: number;
    total: number;
  };
}

export type TimelineDatasetAnalysis =
  | TimelineDatasetAnalysisIdle
  | TimelineDatasetAnalysisLoading
  | TimelineDatasetAnalysisError
  | TimelineDatasetAnalysisSuccess;

// END TimelineDatasetAnalysis type discriminants

export interface TimelineDatasetData extends DatasetLayer {
  isPeriodic: boolean;
  timeDensity: TimeDensity;
  domain: Date[];
}

// TimelineDataset type discriminants
export interface TimelineDatasetIdle {
  status: TimelineDatasetStatus.IDLE;
  data: DatasetLayer;
  error: null;
  settings: {
    // user defined settings like visibility, opacity
    isVisible?: boolean;
    opacity?: number;
  };
  analysis: TimelineDatasetAnalysisIdle;
}
export interface TimelineDatasetLoading {
  status: TimelineDatasetStatus.LOADING;
  data: DatasetLayer;
  error: null;
  settings: {
    // user defined settings like visibility, opacity
    isVisible?: boolean;
    opacity?: number;
  };
  analysis: TimelineDatasetAnalysisIdle;
}
export interface TimelineDatasetError {
  status: TimelineDatasetStatus.ERROR;
  data: DatasetLayer;
  error: unknown;
  settings: {
    // user defined settings like visibility, opacity
    isVisible?: boolean;
    opacity?: number;
  };
  analysis: TimelineDatasetAnalysisIdle;
}
export interface TimelineDatasetSuccess {
  status: TimelineDatasetStatus.SUCCESS;
  data: TimelineDatasetData;
  error: null;
  settings: {
    // user defined settings like visibility, opacity
    isVisible?: boolean;
    opacity?: number;
  };
  analysis: TimelineDatasetAnalysis;
}

export type TimelineDataset =
  | TimelineDatasetIdle
  | TimelineDatasetLoading
  | TimelineDatasetError
  | TimelineDatasetSuccess;

// END TimelineDataset type discriminants

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ZoomTransformPlain {
  x: number;
  y: number;
  k: number;
}
