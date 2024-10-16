import React from 'react';

import { BaseTimeseriesProps } from '../types';
import { RasterPaintLayer } from './raster-paint-layer';

export function CMRTimeseries(props: BaseTimeseriesProps) {
  const { date, sourceParams } = props;
  const tileParams = { datetime: date, ...sourceParams };
  return <RasterPaintLayer {...props} tileParams={tileParams} generatorPrefix='cmr-timeseries' />;
}
