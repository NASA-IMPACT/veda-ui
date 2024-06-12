import React from 'react';

import { RasterPaintLayer } from './raster-paint-layer';

import { MapLayerRasterTimeseriesProps } from './raster-timeseries';
import { useCMRSTAC } from '$components/common/map/style-generators/hooks';

export function MapLayerCMRTimeseries(props:MapLayerRasterTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    assetUrlReplacements,
    onStatusChange,
    sourceParams,
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const tileParams = useCMRSTAC({ id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange, sourceParams });
  return <RasterPaintLayer {...props} tileParams={tileParams} />;
}