import React from 'react';
import { Map as MapboxMap } from 'mapbox-gl';
import { ZarrPaintLayer } from './zarr-timeseries';
import { ActionStatus } from '$utils/status';

import { useCMR } from '$components/common/map/style-generators/hooks';

interface AssetUrlReplacement {
  from: string;
  to: string;
}

export interface MapLayerCMRTimeseriesProps {
  id: string;
  stacCol: string;
  date?: Date;
  mapInstance: MapboxMap;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
  assetUrlReplacements?: AssetUrlReplacement;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden?: boolean;
  idSuffix?: string;
}

export function MapLayerCMRTimeseries(props:MapLayerCMRTimeseriesProps) {
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
  return <ZarrPaintLayer {...props} assetUrl={assetUrl} />;
}