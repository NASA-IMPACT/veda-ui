import { DatasetLayer } from 'veda';
import { DataMetric } from './components/datasets/analysis-metrics';

export enum TimeDensity {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}

export enum DatasetStatus {
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
  status: DatasetStatus.IDLE;
  data: null;
  error: null;
  meta: Record<string, never>;
}
export interface TimelineDatasetAnalysisLoading {
  status: DatasetStatus.LOADING;
  data: null;
  error: null;
  meta: Partial<AnalysisMeta>;
}
export interface TimelineDatasetAnalysisError {
  status: DatasetStatus.ERROR;
  data: null;
  error: any;
  meta: Partial<AnalysisMeta>;
}
export interface TimelineDatasetAnalysisSuccess {
  status: DatasetStatus.SUCCESS;
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
  id: string;
  parentDataset: ParentDatset;
}

export interface DatasetData extends EnhancedDatasetLayer {
  isPeriodic: boolean;
  timeDensity: TimeDensity;
  domain: Date[];
}

export interface DatasetSettings {
  // Whether or not the layer should be shown on the map.
  isVisible?: boolean;
  // Opacity of the layer on the map.
  opacity?: number;
  // Active metrics for the analysis chart.
  analysisMetrics?: DataMetric[];
}

// Any sort of meta information the dataset like:
// Tile endpoints for the layer given the current map view.
type DatasetMeta = Record<string, any>;

// Holds only dataset needed for visualization (Subset of timeline dataset)
// @ TODO: Rename Timeline specific variable names
export interface VizDatasetIdle {
  status: DatasetStatus.IDLE;
  data: EnhancedDatasetLayer;
  error: null;
  settings: DatasetSettings;
  meta?: DatasetMeta;
}

export interface VizDatasetLoading {
  status: DatasetStatus.LOADING;
  data: EnhancedDatasetLayer;
  error: null;
  settings: DatasetSettings;
  meta?: DatasetMeta;
}

export interface VizDatasetError {
  status: DatasetStatus.ERROR;
  data: EnhancedDatasetLayer;
  error: unknown;
  settings: DatasetSettings;
  meta?: DatasetMeta;
}

export interface VizDatasetSuccess {
  status: DatasetStatus.SUCCESS;
  data: DatasetData;
  error: null;
  settings: DatasetSettings;
  meta?: DatasetMeta;
}

export type VizDataset =
  | VizDatasetLoading
  | VizDatasetIdle
  | VizDatasetError
  | VizDatasetSuccess;

// TimelineDataset type discriminants
export interface TimelineDatasetIdle extends VizDatasetIdle {
  analysis: TimelineDatasetAnalysisIdle;
}
export interface TimelineDatasetLoading extends VizDatasetLoading {
  analysis: TimelineDatasetAnalysisIdle;
}
export interface TimelineDatasetError extends VizDatasetError {
  analysis: TimelineDatasetAnalysisIdle;
}
export interface TimelineDatasetSuccess extends VizDatasetSuccess {
  analysis: TimelineDatasetAnalysis;
}

export type TimelineDataset =
  | TimelineDatasetIdle
  | TimelineDatasetLoading
  | TimelineDatasetError
  | TimelineDatasetSuccess;

// END TimelineDataset type discriminants

export interface TimelineDatasetForUrl {
  id: string;
  settings: DatasetSettings;
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
