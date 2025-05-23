import React from 'react';

import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { BaseTimeseriesProps } from '../types';
import { RasterPaintLayer } from './raster-paint-layer';
import { useRequestStatus } from './hooks';
import { userTzDate2utcString } from '$utils/date';

export function CMRTimeseries(props: BaseTimeseriesProps) {
  const {
    id,
    date,
    sourceParams,
    onStatusChange,
    hidden,
    opacity,
    generatorOrder
  } = props;
  const start_datetime = userTzDate2utcString(startOfDay(date));
  const end_datetime = userTzDate2utcString(endOfDay(date));
  const tileParams = {
    datetime: `${start_datetime}/${end_datetime}`,
    ...sourceParams
  };

  const { changeStatus } = useRequestStatus({
    id,
    onStatusChange,
    requestsToTrack: []
  });

  return (
    <RasterPaintLayer
      {...props}
      tileParams={tileParams}
      generatorPrefix='cmr-timeseries'
      onStatusChange={changeStatus}
      hidden={hidden}
      opacity={opacity}
      generatorOrder={generatorOrder}
      metadataFormatter={(tilejsonData) => {
        return {
          xyzTileUrl: tilejsonData?.tiles[0]
        };
      }}
    />
  );
}
