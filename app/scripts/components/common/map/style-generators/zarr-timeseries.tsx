import React from 'react';

import { useZarr } from './hooks';
import { RasterTimeseriesProps } from './raster-timeseries';
import { RasterPaintLayer } from './raster-paint-layer';

export function ZarrTimeseries(props: RasterTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    onStatusChange,
    sourceParams,
    hidden
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const tileParams = useZarr({id, stacCol, stacApiEndpointToUse, date, onStatusChange, sourceParams});
  return <RasterPaintLayer {...props} tileParams={tileParams} />;
}