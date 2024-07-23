import * as process from 'process';
import React, { useEffect, useMemo } from 'react';
import qs from 'qs';
import { RasterSource, RasterLayer } from 'mapbox-gl';
import { useMapStyle } from './styles';

import { ActionStatus } from '$utils/status';
import { useZarr } from '$components/common/map/style-generators/hooks';

export interface MapLayerZarrTimeseriesProps {
  id: string;
  stacCol: string;
  date?: Date;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden?: boolean;
  idSuffix?: string;
}

interface ZarrPaintLayerProps {
  id: string;
  date?: Date;
  sourceParams?: Record<string, any>;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  isHidden?: boolean;
  idSuffix?: string;
  assetUrl: string;
}

export function ZarrPaintLayer(props: ZarrPaintLayerProps) {
  const {
    id,
    tileApiEndpoint,
    date,
    sourceParams,
    zoomExtent,
    isHidden,
    assetUrl,
    idSuffix = ''
  } = props;

  const { updateStyle } = useMapStyle();

  const [minZoom] = zoomExtent ?? [0, 20];

  const generatorId = 'zarr-timeseries' + idSuffix;

  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );

  useEffect(
    () => {
      if (!assetUrl) return;

      const tileParams = qs.stringify({
        url: assetUrl,
        time_slice: date,
        ...sourceParams
      });

      const zarrSource: RasterSource = {
        type: 'raster',
        url: `${tileApiEndpoint}?${tileParams}`
      };

      const zarrLayer: RasterLayer = {
        id: id,
        type: 'raster',
        source: id,
        layout: {
          visibility: isHidden ? 'none' : 'visible'
        },
        paint: {
          'raster-opacity': Number(!isHidden),
          'raster-opacity-transition': {
            duration: 320
          }
        },
        minzoom: minZoom,
        metadata: {
          layerOrderPosition: 'raster'
        }
      };

      const sources = {
        [id]: zarrSource
      };
      const layers = [zarrLayer];

      updateStyle({
        generatorId,
        sources,
        layers
      });
    },
    // sourceParams not included, but using a stringified version of it to detect changes (haveSourceParamsChanged)
    [
      updateStyle,
      id,
      date,
      assetUrl,
      minZoom,
      haveSourceParamsChanged,
      isHidden,
      generatorId,
      tileApiEndpoint
    ]
  );

  //
  // Cleanup layers on unmount.
  //
  useEffect(() => {
    return () => {
      updateStyle({
        generatorId,
        sources: {},
        layers: []
      });
    };
  }, [updateStyle, generatorId]);

  return null;
}

export function MapLayerZarrTimeseries(props:MapLayerZarrTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    onStatusChange,
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const assetUrl = useZarr({id, stacCol, stacApiEndpointToUse, date, onStatusChange});
  return <ZarrPaintLayer {...props} assetUrl={assetUrl} />;
}