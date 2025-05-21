import React from 'react';
import useFitBbox from '../hooks/use-fit-bbox';
import { BaseGeneratorParams } from '../types';
import { RasterPaintLayer } from './raster-paint-layer';
import { useRequestStatus } from '$components/common/map/style-generators/hooks';
import { ActionStatus } from '$utils/status';

export interface WebMapTimeseriesProps extends BaseGeneratorParams {
  id: string;
  date?: Date;
  stacCol: string;
  sourceParams?: Record<string, any>;
  bounds: any;
  tileApiEndpoint: string | string[];
  tileParams: Record<string, any>;
  generatorPrefix: string;
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  metadataFormatter?: (
    tileJsonData: any,
    tileParamsAsString: string
  ) => Record<string, any>;
  sourceParamFormatter?: (url: string) => Record<string, any>;
}

export function WebMapTimeseries(props: WebMapTimeseriesProps) {
  const {
    id,
    bounds,
    tileApiEndpoint,
    tileParams,
    generatorPrefix,
    onStatusChange,
    hidden,
    opacity,
    generatorOrder,
    metadataFormatter,
    sourceParamFormatter
  } = props;

  const { changeStatus } = useRequestStatus({
    id,
    onStatusChange,
    requestsToTrack: []
  });
  useFitBbox(false, undefined, bounds);

  return (
    <RasterPaintLayer
      {...props}
      id={id}
      tileApiEndpoint={tileApiEndpoint}
      tileParams={tileParams}
      generatorPrefix={generatorPrefix}
      onStatusChange={changeStatus}
      hidden={hidden}
      opacity={opacity}
      generatorOrder={generatorOrder}
      metadataFormatter={metadataFormatter}
      sourceParamFormatter={sourceParamFormatter}
    />
  );
}
