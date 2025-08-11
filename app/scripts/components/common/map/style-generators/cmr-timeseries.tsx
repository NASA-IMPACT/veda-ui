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
  // shouldn't this depend on the time_density?
  const start_datetime = userTzDate2utcString(startOfDay(date));
  const end_datetime = userTzDate2utcString(endOfDay(date));

  const processSourceParams = () => {
    const parseSelAttribute = () =>
      sourceParams?.sel.map((sel) => {
        if (sel.includes('{start_datetime}')) {
          return sel.replace('{start_datetime}', start_datetime);
        } else return sel;
      }); // "start_datetime" is currently the only variable to be interpolated

    return {
      ...sourceParams,
      ...(sourceParams?.sel ? { sel: parseSelAttribute() } : {})
    };
  };

  const tileParams = {
    datetime: `${start_datetime}/${end_datetime}`,
    ...processSourceParams()
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
