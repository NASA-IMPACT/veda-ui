import React from 'react';
import qs from 'qs';
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
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const assetUrl = useZarr({id, stacCol, stacApiEndpointToUse, date, onStatusChange});
  const tileParams = qs.stringify({
    url: assetUrl,
    datetime: date,
    ...sourceParams,
  });
  return <RasterPaintLayer {...props} tileParams={tileParams} generatorPrefix='zarr-timeseries' />;
}
