export interface DateSliderDataItem {
  index: number;
  date: Date;
  hasData: boolean;
  breakLength?: number;
}

export type DateSliderTimeDensity = 'day' | 'month' | 'year';

export const DATA_POINT_WIDTH = 32;

export const RANGE_PADDING = 24;

export const CHART_HEIGHT = 48;
