import React from 'react';

import { RasterPaintLayer } from './raster-paint-layer';

import { MapLayerRasterTimeseriesProps } from './raster-timeseries';
import { useZarr } from '$components/common/map/style-generators/hooks';

export function MapLayerZarrTimeseries(props:MapLayerRasterTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    onStatusChange,
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const tileParams = useZarr({id, stacCol, stacApiEndpointToUse, date, onStatusChange});

  return <RasterPaintLayer {...props} tileParams={tileParams} />;
}