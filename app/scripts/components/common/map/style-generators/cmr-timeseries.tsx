import React from 'react';
import qs from 'qs';
import { BaseTimeseriesProps } from '../types';
import { RasterPaintLayer } from './raster-paint-layer';

export function CMRTimeseries(props: BaseTimeseriesProps) {
  const { date, sourceParams } = props;
  const tileParams = qs.stringify({
    datetime: date,
    ...sourceParams,
  });
  return <RasterPaintLayer {...props} tileParams={tileParams} />;
}
