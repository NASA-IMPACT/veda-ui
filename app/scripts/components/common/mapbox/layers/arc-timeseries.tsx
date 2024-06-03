import React, { useEffect, useMemo } from 'react';
import qs from 'qs';
import { RasterSource, RasterLayer } from 'mapbox-gl';

import { useMapStyle } from './styles';
import { useArc } from '$components/common/map/style-generators/hooks';

import { ActionStatus } from '$utils/status';

export interface MapLayerArcTimeseriesProps {
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

interface ArcPaintLayerProps {
  id: string;
  date?: Date;
  sourceParams?: Record<string, any>;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  isHidden?: boolean;
  idSuffix?: string;
  wmsUrl: string;
}

export function ArcPaintLayer(props: ArcPaintLayerProps) {
  const {
    id,
    tileApiEndpoint,
    date,
    sourceParams,
    zoomExtent,
    isHidden,
    wmsUrl,
    idSuffix = ''
  } = props;

  const { updateStyle } = useMapStyle();

  const [minZoom] = zoomExtent ?? [0, 20];

  const generatorId = 'arc-timeseries' + idSuffix;

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
        service: "WMS",
        version: "1.3.0",
        request: "GetMap",
        crs: "EPSG:3857",
        transparent: "true",
        width: "256",
        height: "256",
        layers: 1,
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

export function MapLayerArcTimeseries(props:MapLayerArcTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    onStatusChange,
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const wmsUrl = useArc({id, stacCol, stacApiEndpointToUse, date, onStatusChange});

  return <ArcPaintLayer {...props} wmsUrl={wmsUrl} />;
}
