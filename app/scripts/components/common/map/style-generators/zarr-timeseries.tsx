import React from 'react';
import { BaseGeneratorParams } from '../types';

import { useZarr } from './hooks';
import { RasterPaintLayer } from './raster-paint-layer';
import { ActionStatus } from '$utils/status';

export interface ZarrTimeseriesProps extends BaseGeneratorParams {
  id: string;
  stacCol: string;
  date?: Date;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
}

export function ZarrTimeseries(props:ZarrTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    onStatusChange,
    sourceParams
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const tileParams = useZarr({id, stacCol, stacApiEndpointToUse, date, onStatusChange, sourceParams});
  return <RasterPaintLayer {...props} tileParams={tileParams} />;
}