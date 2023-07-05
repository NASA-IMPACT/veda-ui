import { useEffect, useMemo } from 'react';
import qs from 'qs';
import { AnyLayer, AnySourceImpl, RasterLayer, RasterSource } from 'mapbox-gl';

import { useMapStyle } from './styles';

export interface MapLayerZarrTimeseriesProps {
  id: string;
  date?: Date;
  sourceParams?: object;
  zoomExtent?: number[];
  assetUrl: string;
  isHidden?: boolean;
}

export function MapLayerZarrTimeseries(props: MapLayerZarrTimeseriesProps) {
  const { id, date, isHidden } = props;
  const { sourceParams = {}, zoomExtent, assetUrl } = props;

  const { updateStyle } = useMapStyle();

  const minZoom = zoomExtent?.[0] ?? 0;
  const tilerUrl = process.env.API_XARRAY_ENDPOINT;

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

      if (tilerUrl) {
        const tileParams = qs.stringify({
          url: assetUrl,
          time_slice: date,
          ...sourceParams
        });

        const zarrSource: RasterSource = {
          type: 'raster',
          url: `${tilerUrl}?${tileParams}`
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
          [id]: zarrSource
        };
        layers = [zarrLayer];
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
      assetUrl,
      tilerUrl,
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
