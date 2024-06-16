import { useEffect, useMemo } from 'react';
import qs from 'qs';
import { RasterSource, RasterLayer } from 'mapbox-gl';

import useMapStyle from '../hooks/use-map-style';

interface RasterPaintLayerProps {
  id: string;
  tileParams?: Record<string, any>;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  hidden?: boolean;
  idSuffix?: string;
  opacity?: number;
}

export function RasterPaintLayer(props: RasterPaintLayerProps) {
  const {
    id,
    tileApiEndpoint,
    tileParams,
    zoomExtent,
    hidden,
    opacity,
    idSuffix = ''
  } = props;

  const { updateStyle } = useMapStyle();

  const [minZoom] = zoomExtent ?? [0, 20];

  const generatorId = 'zarr-timeseries' + idSuffix;

  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(tileParams),
    [tileParams]
  );

  useEffect(
    () => {

    // Customize qs to use comma separated values for arrays
    // e.g. rescale: [[0, 100]] -> rescale=0,100
    // TODO: test this with multiple rescale values, for multiple bands
    const options = {
        arrayFormat: 'comma',
    };

      const tileParamsAsString = qs.stringify(tileParams, options);
      const tileServerUrl = `${tileApiEndpoint}?${tileParamsAsString}`;
      const layerSource: RasterSource = {
        type: 'raster',
        url: tileServerUrl
      };
      const rasterOpacity = typeof opacity === 'number' ? opacity / 100 : 1;
      const layer: RasterLayer = {
        id: id,
        type: 'raster',
        source: id,
        layout: {
          visibility: hidden ? 'none' : 'visible'
        },
        paint: {
          //'raster-opacity': hidden ? 0 : rasterOpacity,
          'raster-opacity-transition': {
            duration: 320
          }
        },
        minzoom: minZoom,
        metadata: {
          id,
          layerOrderPosition: 'raster',
          xyzTileUrl: tileServerUrl,
        }
      };

      const sources = {
        [id]: layerSource
      };
      const layers = [layer];

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
      tileParams,
      minZoom,
      haveSourceParamsChanged,
      hidden,
      generatorId,
      tileApiEndpoint,
      opacity

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