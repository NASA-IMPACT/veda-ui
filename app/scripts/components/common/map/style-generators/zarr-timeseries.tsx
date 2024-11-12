import React from 'react';

import { BaseTimeseriesProps } from '../types';
import { useZarr } from './hooks';
import { RasterPaintLayer } from './raster-paint-layer';

export function ZarrTimeseries(props: BaseTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    onStatusChange,
    sourceParams,
    envApiStacEndpoint
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint ?? envApiStacEndpoint;
  const assetUrl = useZarr({
    id,
    stacCol,
    stacApiEndpointToUse,
    date,
    onStatusChange
  });
  const tileParams = {
    url: assetUrl,
    datetime: date,
    ...sourceParams
  };
  return (
    <RasterPaintLayer
      {...props}
      tileParams={tileParams}
      generatorPrefix='zarr-timeseries'
    />
  );
}
