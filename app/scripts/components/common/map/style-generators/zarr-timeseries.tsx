import React from 'react';

import { BaseTimeseriesProps } from '../types';
import { useZarr } from './hooks';
import { RasterPaintLayer } from './raster-paint-layer';
import { useRequestStatus } from './hooks';

export function ZarrTimeseries(props: BaseTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    onStatusChange,
    sourceParams,
    tileApiEndpoint,
    envApiStacEndpoint
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint ?? envApiStacEndpoint;
  const assetUrl = useZarr({
    id,
    stacCol,
    stacApiEndpointToUse,
    date,
    onStatusChange
  });
  const tileParams = {
    url: assetUrl,
    datetime: date,
    ...sourceParams
  };
  const { changeStatus } = useRequestStatus({
    id,
    onStatusChange,
    requestsToTrack: []
  });
  return (
    <RasterPaintLayer
      {...props}
      tileParams={tileParams}
      onStatusChange={changeStatus}
      generatorPrefix='zarr-timeseries'
      metadataFormatter={(tilejsonData, tileParamsAsString) => {
        return {
          xyzTileUrl: tilejsonData.tiles[0],
          wmtsTileUrl: `${tileApiEndpoint}WMTSCapabilities.xml?${tileParamsAsString}`
        };
      }}
    />
  );
}
