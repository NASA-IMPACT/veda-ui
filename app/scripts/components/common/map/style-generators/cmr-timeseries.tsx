import React from 'react';

import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
// import startOfMonth from 'date-fns/startOfMonth';
// import endOfMonth from 'date-fns/endOfMonth';
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

  // Function to replace variables in curly braces with their values
  const interpolateVariables = (
    str: string,
    variables: Record<string, string>
  ) => {
    return str.replace(/\{(\w+)\}/g, (match, variableName) => {
      return variables[variableName] || match;
    });
  };

  // Replace any variables in curly braces in sel parameter
  const processedSourceParams = {
    ...sourceParams,
    sel: sourceParams?.sel
      ? Array.isArray(sourceParams.sel)
        ? sourceParams.sel.map((sel) =>
            interpolateVariables(sel, { start_datetime })
          )
        : interpolateVariables(sourceParams.sel, { start_datetime })
      : undefined
  };

  const tileParams = {
    datetime: `${start_datetime}/${end_datetime}`,
    ...processedSourceParams
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
