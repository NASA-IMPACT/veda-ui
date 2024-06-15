import React from 'react';
import { RasterPaintLayer } from './raster-paint-layer';
import { RasterTimeseriesProps } from './raster-timeseries';
import { useTitilerCMR } from '$components/common/map/style-generators/hooks';

export function TitilerCMRTimeseries(props: RasterTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    onStatusChange,
    sourceParams,
  } = props;
 
  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const tileParams = useTitilerCMR({ id, stacCol, stacApiEndpointToUse, date, stacApiEndpoint, onStatusChange, sourceParams });
  return <RasterPaintLayer {...props} tileParams={tileParams} />;
}