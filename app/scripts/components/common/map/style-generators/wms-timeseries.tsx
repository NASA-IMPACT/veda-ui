import React from 'react';

import useFitBbox from '../hooks/use-fit-bbox';
import { BaseGeneratorParams } from '../types';
import { RasterPaintLayer } from './raster-paint-layer';

import {
  useRequestStatus,
  useWebMapService
} from '$components/common/map/style-generators/hooks';
import { ActionStatus } from '$utils/status';

import { userTzDate2utcString } from '$utils/date';

// @NOTE: Some WMS Layers don't have a timestamp
export interface MapLayerWMSProps extends BaseGeneratorParams {
  id: string;
  date?: Date;
  stacCol: string;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
}

export function WMSTimeseries(props: MapLayerWMSProps) {
  const {
    id,
    stacCol,
    date,
    stacApiEndpoint,
    sourceParams,
    onStatusChange,
    hidden,
    opacity,
    generatorOrder
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint ?? process.env.API_STAC_ENDPOINT;
  const { urls: wmsUrls, bounds } = useWebMapService({
    id,
    stacCol,
    stacApiEndpointToUse,
    onStatusChange
  });

  const { changeStatus } = useRequestStatus({
    id,
    onStatusChange,
    requestsToTrack: []
  });

  const tileParams = {
    // these are mostly gonna be same for wms layers, but users can override using sourceParams
    format: 'image/png',
    service: 'WMS',
    request: 'GetMap',
    transparent: 'true',
    width: '256',
    height: '256',
    version: '1.3.0',
    crs: 'EPSG:3857',
    bbox: '{bbox-epsg-3857}',
    ...sourceParams,
    ...(date && { time: userTzDate2utcString(date) })
  };
  const wmsUrl = wmsUrls && wmsUrls[0];

  useFitBbox(false, undefined, bounds);
  return (
    <RasterPaintLayer
      {...props}
      id={id}
      hidden={hidden}
      opacity={opacity}
      generatorOrder={generatorOrder}
      tileApiEndpoint={wmsUrl}
      tileParams={tileParams}
      generatorPrefix='wms'
      onStatusChange={changeStatus}
      metadataFormatter={(_, tileParamsAsString) => ({
        wmsTileUrl: `${wmsUrl}?${tileParamsAsString}`
      })}
      sourceParamFormatter={(tileUrl) => ({
        tiles: [tileUrl],
        tileSize: 256
      })}
    />
  );
}
