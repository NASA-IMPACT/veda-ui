import React from 'react';
import { BaseTimeseriesProps } from '../types';
import { RasterPaintLayer } from './raster-paint-layer';

export function CMRTimeseries(props: BaseTimeseriesProps) {
  return <RasterPaintLayer {...props} />;
}