import { useEffect, useMemo } from 'react';
import qs from 'qs';
import {
  Map as MapboxMap,
  AnyLayer,
  AnySourceImpl,
  RasterLayer,
  RasterSource,
} from 'mapbox-gl';

import { useMapStyle } from './styles';

interface MapLayerZarrTimeseriesProps {
  id: string;
  date?: Date;
  sourceParams: object;
  zoomExtent?: [number, number];
  assetUrl?: string;
  isHidden: boolean;
}

export function MapLayerZarrTimeseries(props: MapLayerZarrTimeseriesProps) {
  const {
    id,
    date,
    sourceParams,
    zoomExtent,
    assetUrl,
    isHidden
  } = props;

  const { updateStyle } = useMapStyle();

  const minZoom = zoomExtent?.[0] ?? 0;
  const tilesUrl = process.env.API_XARRAY_ENDPOINT;
  //
  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );
  useEffect(
    () => {
      let layers: AnyLayer[] = [];
      let sources: Record<string, AnySourceImpl> = {};

      if (tilesUrl) {
        const tileParams = qs.stringify(
          {
            url: assetUrl,
            time_slice: date,
            ...sourceParams
          }
        );

        const zarrSource: RasterSource = {
          type: 'raster',
          url: `${tilesUrl}?${tileParams}`
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

        sources = {
          ...sources,
          [id]: zarrSource
        };
        layers = [...layers, zarrLayer];
      }

      updateStyle({
        generatorId: 'raster-timeseries',
        sources,
        layers
      });
    },
    // sourceParams not included, but using a stringified version of it to detect changes (haveSourceParamsChanged)
    [
      updateStyle,
      id,
      date,
      tilesUrl,
      minZoom,
      haveSourceParamsChanged,
      isHidden
    ]
  );

  //
  // Cleanup layers on unmount.
  //
  useEffect(() => {
    return () => {
      updateStyle({
        generatorId: 'raster-timeseries',
        sources: {},
        layers: []
      });
    };
  }, [updateStyle]);

  return null;
}
