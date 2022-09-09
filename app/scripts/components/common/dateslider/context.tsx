import { ScaleTime, ZoomBehavior } from 'd3';
import { createContext, useContext } from 'react';

import { DateSliderData, DateSliderTimeDensity } from './constants';

type DateSliderContextProps = {
  data: DateSliderData;
  hoveringDataPoint: Date | null;
  value?: Date;
  width: number;
  height: number;
  outerWidth: number;
  outerHeight: number;
  margin: { top: number; bottom: number; left: number; right: number };
  x: ScaleTime<number, number, never>;
  zoomXTranslation: number;
  zoomBehavior: ZoomBehavior<SVGRectElement, unknown>;
  timeDensity: DateSliderTimeDensity;
  getUID: (base: string) => string
};

// Context
export const DateSliderContext = createContext<DateSliderContextProps | null>(
  null
);

// Context consumers.
export const useDateSliderContext = () => {
  const ctx = useContext(DateSliderContext);
  if (!ctx) {
    throw new Error('Trying to access DateSlider context outside a DateSlider');
  }

  return ctx;
};
