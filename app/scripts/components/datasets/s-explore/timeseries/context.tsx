import { ScaleTime, ZoomBehavior } from 'd3';
import { createContext, useContext } from 'react';

import { TimeseriesData, TimeseriesTimeUnit } from './constants';

type TimeseriesContextProps = {
  data: TimeseriesData;
  value?: Date;
  width: number;
  height: number;
  outerWidth: number;
  outerHeight: number;
  margin: { top: number; bottom: number; left: number; right: number };
  x: ScaleTime<number, number, never>;
  zoomXTranslation: number;
  zoomBehavior: ZoomBehavior<SVGRectElement, unknown>;
  timeUnit: TimeseriesTimeUnit;
  getUID: (base: string) => string
};

// Context
export const TimeseriesContext = createContext<TimeseriesContextProps | null>(
  null
);

// Context consumers.
export const useTimeseriesContext = () => {
  const ctx = useContext(TimeseriesContext);
  if (!ctx) {
    throw new Error('Trying to access timeseries context outside a timeseries');
  }

  return ctx;
};
