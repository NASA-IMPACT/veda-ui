import React from 'react';

import { StacTimeseriesProps } from '../types';
import { useZarr } from './hooks';
import { RasterPaintLayer } from './raster-paint-layer';

export function ZarrTimeseries(props: StacTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    onStatusChange,
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const assetUrl = useZarr({id, stacCol, stacApiEndpointToUse, date, onStatusChange});
  return <RasterPaintLayer {...props} assetUrl={assetUrl} />;
}