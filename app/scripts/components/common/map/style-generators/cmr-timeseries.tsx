import React from 'react';
import { CMRTimeseriesProps } from '../types';
import { RasterPaintLayer } from './raster-paint-layer';
import { useCMR } from './hooks';

export function CMRTimeseries(props: CMRTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    assetUrlReplacements,
    onStatusChange,
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const assetUrl = useCMR({ id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange });
  return <RasterPaintLayer {...props} assetUrl={assetUrl} />;
}