import { DatasetLayer } from 'veda';
import { DataMetric } from './components/datasets/analysis-metrics';

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

export interface AnalysisTimeseriesEntry {
  date: Date;
  min: number;
  max: number;
  mean: number;
  count: number;
  sum: number;
  std: number;
  median: number;
  majority: number;
  minority: number;
  unique: number;
  histogram: [number[], number[]];
  valid_percent: number;
  masked_pixels: number;
  valid_pixels: number;
  percentile_2: number;
  percentile_98: number;
}

interface AnalysisMeta {
  loaded: number;
  total: number;
}

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
  meta: Partial<AnalysisMeta>
}
export interface TimelineDatasetAnalysisError {
  status: TimelineDatasetStatus.ERROR;
  data: null;
  error: any;
  meta: Partial<AnalysisMeta>
}
export interface TimelineDatasetAnalysisSuccess {
  status: TimelineDatasetStatus.SUCCESS;
  data: {
    timeseries: AnalysisTimeseriesEntry[];
  };
  error: null;
  meta: AnalysisMeta;
}

export type TimelineDatasetAnalysis =
  | TimelineDatasetAnalysisIdle
  | TimelineDatasetAnalysisLoading
  | TimelineDatasetAnalysisError
  | TimelineDatasetAnalysisSuccess;

// END TimelineDatasetAnalysis type discriminants
export interface ParentDatset {
  id: string;
  name: string;
}
export interface EnhancedDatasetLayer extends DatasetLayer {
  parentDataset: ParentDatset;
}

export interface TimelineDatasetData extends EnhancedDatasetLayer {
  isPeriodic: boolean;
  timeDensity: TimeDensity;
  domain: Date[];
}

export interface TimelineDatasetSettings {
  // Whether or not the layer should be shown on the map.
  isVisible?: boolean;
  // Opacity of the layer on the map.
  opacity?: number;
  // Active metrics for the analysis chart.
  analysisMetrics?: DataMetric[];
}

// Any sort of meta information the dataset like:
// Tile endpoints for the layer given the current map view.
type TimelineDatasetMeta = Record<string, any>;

// TimelineDataset type discriminants
export interface TimelineDatasetIdle {
  status: TimelineDatasetStatus.IDLE;
  data: EnhancedDatasetLayer;
  error: null;
  // User controlled settings like visibility, opacity.
  settings: TimelineDatasetSettings;
  analysis: TimelineDatasetAnalysisIdle;
  meta?: TimelineDatasetMeta;
}
export interface TimelineDatasetLoading {
  status: TimelineDatasetStatus.LOADING;
  data: EnhancedDatasetLayer;
  error: null;
  // User controlled settings like visibility, opacity.
  settings: TimelineDatasetSettings;
  analysis: TimelineDatasetAnalysisIdle;
  meta?: TimelineDatasetMeta;
}
export interface TimelineDatasetError {
  status: TimelineDatasetStatus.ERROR;
  data: EnhancedDatasetLayer;
  error: unknown;
  // User controlled settings like visibility, opacity.
  settings: TimelineDatasetSettings;
  analysis: TimelineDatasetAnalysisIdle;
  meta?: TimelineDatasetMeta;
}
export interface TimelineDatasetSuccess {
  status: TimelineDatasetStatus.SUCCESS;
  data: TimelineDatasetData;
  error: null;
  // User controlled settings like visibility, opacity.
  settings: TimelineDatasetSettings;
  analysis: TimelineDatasetAnalysis;
  meta?: TimelineDatasetMeta;
}

export type TimelineDataset =
  | TimelineDatasetIdle
  | TimelineDatasetLoading
  | TimelineDatasetError
  | TimelineDatasetSuccess;

// END TimelineDataset type discriminants

export interface TimelineDatasetForUrl {
  id: string;
  settings?: TimelineDatasetSettings;
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
