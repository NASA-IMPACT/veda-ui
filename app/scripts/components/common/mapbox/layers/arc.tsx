import React, { useEffect, useMemo } from 'react';
import qs from 'qs';
import { RasterSource, RasterLayer } from 'mapbox-gl';

import { useMapStyle } from './styles';
import { useArc } from '$components/common/map/style-generators/hooks';

import { ActionStatus } from '$utils/status';

// @NOTE: ArcGIS Layer doens't have a timestamp
export interface MapLayerArcProps {
  id: string;
  stacCol: string;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden?: boolean;
  idSuffix?: string;
}

interface ArcPaintLayerProps {
  id: string;
  date?: Date;
  sourceParams?: Record<string, any>;
  zoomExtent?: number[];
  isHidden?: boolean;
  idSuffix?: string;
  wmsUrl: string;
}

export function ArcPaintLayer(props: ArcPaintLayerProps) {
  const {
    id,
    date,
    sourceParams,
    zoomExtent,
    isHidden,
    wmsUrl,
    idSuffix = ''
  } = props;

  const { updateStyle } = useMapStyle();

  const [minZoom] = zoomExtent ?? [0, 20];

  const generatorId = 'arc-' + idSuffix;

  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );

  useEffect(
    () => {
      if (!wmsUrl) return;

      const tileParams = qs.stringify({
        format: 'image/png',
        service: 'WMS',
        version: '1.3.0',
        request: 'GetMap',
        crs: 'EPSG:3857',
        transparent: 'true',
        width: '256',
        height: '256',
        styles: '',
        ...sourceParams
      });
      
      const arcSource: RasterSource = {
        type: 'raster',
        tiles: [`${wmsUrl}?${tileParams}&bbox={bbox-epsg-3857}`],
        tileSize: 256,
      };

      const arcLayer: RasterLayer = {
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
        [id]: arcSource
      };
      const layers = [arcLayer];

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
      wmsUrl,
      minZoom,
      haveSourceParamsChanged,
      isHidden,
      generatorId
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

export function MapLayerArc(props:MapLayerArcProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    onStatusChange,
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const wmsUrl = useArc({id, stacCol, stacApiEndpointToUse, onStatusChange});

  return <ArcPaintLayer {...props} wmsUrl={wmsUrl} />;
}
