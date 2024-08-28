import React from 'react';
import { StacTimeseriesProps } from '../types';
import { RasterPaintLayer } from './raster-paint-layer';

export function CMRTimeseries(props: StacTimeseriesProps) {
  return <RasterPaintLayer {...props} />;
}