import { useEffect, useMemo } from 'react';
import { RasterSource, RasterLayer } from 'mapbox-gl';

import { BaseGeneratorParams } from '../types';
import useMapStyle from '../hooks/use-map-style';
import useGeneratorParams from '../hooks/use-generator-params';

interface RasterPaintLayerProps extends BaseGeneratorParams {
  id: string;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  tileParams: string;
  generatorPrefix?: string;
}

export function RasterPaintLayer(props: RasterPaintLayerProps) {
  const {
    id,
    tileApiEndpoint,
    tileParams,
    zoomExtent,
    hidden,
    opacity,
    generatorPrefix = 'raster',
  } = props;

  const { updateStyle } = useMapStyle();
  const [minZoom] = zoomExtent ?? [0, 20];
  const generatorId = `${generatorPrefix}-${id}`;

  //
  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveTileParamsChanged = useMemo(
    () => JSON.stringify(tileParams),
    [tileParams]
  );

  const generatorParams = useGeneratorParams(props);

  useEffect(
    () => {
      const zarrSource: RasterSource = {
        type: 'raster',
        url: `${tileApiEndpoint}?${tileParams}`
      };

      const rasterOpacity = typeof opacity === 'number' ? opacity / 100 : 1;

      const zarrLayer: RasterLayer = {
        id: id,
        type: 'raster',
        source: id,
        paint: {
          'raster-opacity': hidden ? 0 : rasterOpacity,
          'raster-opacity-transition': {
            duration: 320,
          },
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
        layers,
        params: generatorParams
      });
    },
    // sourceParams not included, but using a stringified version of it to
    // detect changes (haveSourceParamsChanged)
    [
      updateStyle,
      id,
      minZoom,
      tileApiEndpoint,
      haveTileParamsChanged,
      generatorParams
      // generatorParams includes hidden and opacity
      // hidden,
      // opacity,
      // generatorId, // - dependent on id
      // sourceParams, // tracked by haveSourceParamsChanged
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
