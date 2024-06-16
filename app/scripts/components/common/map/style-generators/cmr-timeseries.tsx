import React from 'react';

import { useCMRSTAC } from './hooks';
import { RasterTimeseriesProps } from './raster-timeseries';
import { RasterPaintLayer } from '$components/common/map/style-generators/raster-paint-layer';

export function CMRTimeseries(props: RasterTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    assetUrlReplacements,
    onStatusChange,
    sourceParams,
    hidden
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const tileParams = useCMRSTAC({ id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange, sourceParams });
  return <RasterPaintLayer {...props} tileParams={tileParams} />;
}