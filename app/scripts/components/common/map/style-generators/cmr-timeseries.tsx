import React from 'react';

import { BaseGeneratorParams } from '../types';
import { ZarrPaintLayer } from './zarr-timeseries';
import { useCMRSTAC } from './hooks';
import { ActionStatus } from '$utils/status';

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
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const assetUrl = useCMRSTAC({ id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange });
  return <ZarrPaintLayer {...props} assetUrl={assetUrl} />;
}