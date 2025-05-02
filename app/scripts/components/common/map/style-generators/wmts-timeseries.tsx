import React from 'react';

import useFitBbox from '../hooks/use-fit-bbox';
import { BaseGeneratorParams } from '../types';
import { RasterPaintLayer } from './raster-paint-layer';

import {
  useRequestStatus,
  useWMTS
} from '$components/common/map/style-generators/hooks';
import { ActionStatus } from '$utils/status';

import { userTzDate2utcString } from '$utils/date';

export interface MapLayerWMTSProps extends BaseGeneratorParams {
  id: string;
  date?: Date;
  stacCol: string;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
}

export function WMTSTimeseries(props: MapLayerWMTSProps) {
  const { id, stacCol, date, stacApiEndpoint, onStatusChange } = props;
  const stacApiEndpointToUse = stacApiEndpoint ?? process.env.API_STAC_ENDPOINT;
  const { wmtsUrl, bounds } = useWMTS({
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
    format: 'image/png',
    Service: 'WMTS',
    Request: 'GetTile',
    Version: '1.0.0',
    layer: stacCol,
    style: 'default',
    tilematrixset: 'GoogleMapsCompatible_Level6',
    ...(date && { TIME: userTzDate2utcString(date) })
  };

  useFitBbox(false, undefined, bounds);

  return (
    <RasterPaintLayer
      {...props}
      tileApiEndpoint={wmtsUrl}
      tileParams={tileParams}
      generatorPrefix='wmts'
      onStatusChange={changeStatus}
      metadataFormatter={(_tileJsonData, tileParamsAsString) => {
        return {
          wmtsTileUrl: `${wmtsUrl}?${tileParamsAsString}`
        };
      }}
      sourceParamFormatter={(url) => {
        const tileUrl = (url as string[]).map(
          (item) => `${item}&TileCol={x}&TileRow={y}&TileMatrix={z}`
        );
        return {
          tiles: tileUrl,
          tileSize: 256
        };
      }}
    />
  );
}
