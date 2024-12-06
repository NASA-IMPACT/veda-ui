import { useEffect, useMemo } from 'react';
import qs from 'qs';
import { RasterSource, RasterLayer } from 'mapbox-gl';

import { BaseGeneratorParams } from '../types';
import useMapStyle from '../hooks/use-map-style';
import useGeneratorParams from '../hooks/use-generator-params';

interface RasterPaintLayerProps extends BaseGeneratorParams {
  id: string;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  colorMap?: string | undefined;
  tileParams: Record<string, any>;
  generatorPrefix?: string;
  reScale?: { min: number; max: number };
}

export function RasterPaintLayer(props: RasterPaintLayerProps) {
  const {
    id,
    tileApiEndpoint,
    tileParams,
    zoomExtent,
    hidden,
    opacity,
    colorMap,
    reScale,
    generatorPrefix = 'raster'
  } = props;
  const { updateStyle } = useMapStyle();
  const [minZoom] = zoomExtent ?? [0, 20];
  const generatorId = `${generatorPrefix}-${id}`;

  const updatedTileParams = useMemo(() => {
    return {
      ...tileParams,
      ...(colorMap && { colormap_name: colorMap }),
      ...(reScale && { reScale: Object.values(reScale) })
    };
  }, [tileParams, colorMap, reScale]);

  //
  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveTileParamsChanged = useMemo(
    () => JSON.stringify(updatedTileParams),
    [updatedTileParams]
  );

  const generatorParams = useGeneratorParams(props);

  useEffect(
    () => {
      const tileParamsAsString = qs.stringify(updatedTileParams, {
        arrayFormat: 'comma'
      });

      const zarrSource: RasterSource = {
        type: 'raster',
        url: `${tileApiEndpoint}?${tileParamsAsString}`
      };

      const rasterOpacity = typeof opacity === 'number' ? opacity / 100 : 1;

      const zarrLayer: RasterLayer = {
        id: id,
        type: 'raster',
        source: id,
        paint: {
          'raster-opacity': hidden ? 0 : rasterOpacity,
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
      generatorParams,
      colorMap,
      reScale
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
