import React, { useEffect, useMemo } from 'react';
import qs from 'qs';
import { RasterSource, RasterLayer } from 'mapbox-gl';

import useGeneratorParams from '../hooks/use-generator-params';
import useMapStyle from '../hooks/use-map-style';
import { BaseGeneratorParams } from '../types';

import { useArc } from '$components/common/map/style-generators/hooks';
import { ActionStatus } from '$utils/status';

// @NOTE: ArcGIS Layer doens't have a timestamp
export interface MapLayerArcProps extends BaseGeneratorParams {
  id: string;
  stacCol: string;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
}

interface ArcPaintLayerProps extends BaseGeneratorParams{
  id: string;
  sourceParams?: Record<string, any>;
  zoomExtent?: number[];
  wmsUrl: string;
}

export function ArcPaintLayer(props: ArcPaintLayerProps) {
  const {
    id,
    sourceParams,
    zoomExtent,
    wmsUrl,
    generatorOrder,
    hidden,
    opacity
  } = props;

  const { updateStyle } = useMapStyle();

  const [minZoom] = zoomExtent ?? [0, 20];

  const generatorId = 'arc-' + id;
  
  const generatorParams = useGeneratorParams( {generatorOrder, hidden, opacity });

  // Generate Mapbox GL layers and sources for raster layer
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

      const rasterOpacity = typeof opacity === 'number' ? opacity / 100 : 1;

      const arcLayer: RasterLayer = {
        id: id,
        type: 'raster',
        source: id,
        layout: {
          visibility: hidden ? 'none' : 'visible'
        },
        paint: {
          'raster-opacity': hidden ? 0 : rasterOpacity,
          'raster-opacity-transition': {
            duration: 320
          }
        },
        minzoom: minZoom,
        metadata: {
          id,
          layerOrderPosition: 'raster',
          xyzTileUrl: '',
          wmtsTileUrl: `${wmsUrl}?${tileParams}`
        }
      };

      const sources = {
        [id]: arcSource
      };
      const layers = [arcLayer];

      updateStyle({
        generatorId,
        sources,
        layers,
        params: generatorParams
      });
    },
    // sourceParams not included, but using a stringified version of it to detect changes (haveSourceParamsChanged)
    [
      updateStyle,
      id,
      wmsUrl,
      minZoom,
      haveSourceParamsChanged,
      hidden,
      opacity,
      generatorId,
      generatorParams,
      sourceParams
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

export function Arc(props:MapLayerArcProps) {
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
