import React from 'react';

import { BaseGeneratorParams } from '../types';
import { useCMRSTAC } from './hooks';
import { ActionStatus } from '$utils/status';
import { RasterPaintLayer } from '$components/common/mapbox/layers/raster-paint-layer';

interface AssetUrlReplacement {
  from: string;
  to: string;
}

export interface CMRTimeseriesProps extends BaseGeneratorParams {
  id: string;
  stacCol: string;
  date?: Date;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
  assetUrlReplacements?: AssetUrlReplacement;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
}

export function CMRTimeseries(props:CMRTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    assetUrlReplacements,
    onStatusChange,
    sourceParams
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const tileParams = useCMRSTAC({ id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange, sourceParams });
  return <RasterPaintLayer {...props} tileParams={tileParams} />;
}