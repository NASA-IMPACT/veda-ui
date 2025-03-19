import React from 'react';

import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { BaseTimeseriesProps } from '../types';
import { RasterPaintLayer } from './raster-paint-layer';
import { userTzDate2utcString } from '$utils/date';

export function CMRTimeseries(props: BaseTimeseriesProps) {
  const { date, sourceParams } = props;
  const start_datetime = userTzDate2utcString(startOfDay(date));
  const end_datetime = userTzDate2utcString(endOfDay(date));
  const tileParams = {
    datetime: `${start_datetime}/${end_datetime}`,
    ...sourceParams
  };
  return (
    <RasterPaintLayer
      {...props}
      tileParams={tileParams}
      generatorPrefix='cmr-timeseries'
    />
  );
}
