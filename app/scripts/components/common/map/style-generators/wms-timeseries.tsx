import React, { useEffect, useMemo } from 'react';
import qs from 'qs';
import { RasterSourceSpecification, RasterLayerSpecification } from 'mapbox-gl';

import useGeneratorParams from '../hooks/use-generator-params';
import useMapStyle from '../hooks/use-map-style';
import { BaseGeneratorParams } from '../types';

import { useWMS } from '$components/common/map/style-generators/hooks';
import { ActionStatus } from '$utils/status';

import { userTzDate2utcString } from '$utils/date';

// @NOTE: Some ArcGIS Layers don't have a timestamp
export interface MapLayerArcProps extends BaseGeneratorParams {
  id: string;
  date?: Date;
  stacCol: string;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
}

interface ArcPaintLayerProps extends BaseGeneratorParams {
  id: string;
  sourceParams?: Record<string, any>;
  date?: Date;
  zoomExtent?: number[];
  wmsUrl: string;
}

export function ArcPaintLayer(props: ArcPaintLayerProps) {
  const {
    id,
    date,
    sourceParams,
    zoomExtent,
    wmsUrl,
    generatorOrder,
    hidden,
    opacity
  } = props;

  const { updateStyle } = useMapStyle();

  const [minZoom] = zoomExtent ?? [0, 20];

  const generatorId = 'wms-' + id;

  const generatorParams = useGeneratorParams({
    generatorOrder,
    hidden,
    opacity
  });

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
        request: 'GetMap',
        transparent: 'true', // @TODO: get from sourceparams maybe
        width: '256',
        height: '256',
        ...(date && { date: userTzDate2utcString(date) }),
        ...sourceParams
      });

      const wmsSource: RasterSourceSpecification = {
        type: 'raster',
        tiles: [`${wmsUrl}?${tileParams}&bbox={bbox-epsg-3857}`],
        tileSize: 256
      };

      const rasterOpacity = typeof opacity === 'number' ? opacity / 100 : 1;

      const wmsLayer: RasterLayerSpecification = {
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
          wmsTileUrl: `${wmsUrl}?${tileParams}`
        }
      };

      const sources = {
        [id]: wmsSource
      };
      const layers = [wmsLayer];

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
      date,
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

export function WMSTimeseries(props: MapLayerArcProps) {
  const { id, stacCol, stacApiEndpoint, onStatusChange } = props;

  const stacApiEndpointToUse = stacApiEndpoint ?? process.env.API_STAC_ENDPOINT;
  const wmsUrl = useWMS({ id, stacCol, stacApiEndpointToUse, onStatusChange });

  return <ArcPaintLayer {...props} wmsUrl={wmsUrl} />;
}
