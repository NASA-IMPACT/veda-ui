import React from 'react';

import { RasterPaintLayer } from './raster-paint-layer';

import { MapLayerRasterTimeseriesProps } from './raster-timeseries';
import { useCMR } from '$components/common/map/style-generators/hooks';

export function MapLayerCMRTimeseries(props:MapLayerRasterTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    assetUrlReplacements,
    onStatusChange,
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const tileParams = useCMR({ id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange });
  return <RasterPaintLayer {...props} tileParams={tileParams} />;
}