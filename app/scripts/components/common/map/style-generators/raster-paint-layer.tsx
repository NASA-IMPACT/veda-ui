import { useEffect, useMemo } from 'react';
import qs from 'qs';
import { RasterSource, RasterLayer } from 'mapbox-gl';

import { BaseGeneratorParams } from '../types';
import useMapStyle from '../hooks/use-map-style';
import useGeneratorParams from '../hooks/use-generator-params';

interface RasterPaintLayerProps extends BaseGeneratorParams {
  id: string;
  date?: Date;
  sourceParams?: Record<string, any>;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  assetUrl?: string;
  colorMap?: string | undefined;
}

export function RasterPaintLayer(props: RasterPaintLayerProps) {
  const {
    id,
    tileApiEndpoint,
    date,
    sourceParams,
    zoomExtent,
    assetUrl,
    hidden,
    opacity,
    colorMap
  } = props;

  const { updateStyle } = useMapStyle();
  const [minZoom] = zoomExtent ?? [0, 20];
  const generatorId = `raster-timeseries-${id}`;

  const updatedSourceParams = useMemo(() => {
    return { ...sourceParams, ...colorMap &&  {colormap_name: colorMap}};
  }, [sourceParams, colorMap]);

  //
  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(updatedSourceParams),
    [updatedSourceParams]
  );

  const generatorParams = useGeneratorParams(props);

  useEffect(
    () => {
      // in the case of titiler-cmr, there is no asset url. The asset urls are determined internally by titiler-cmr.
      const tileParams = qs.stringify({
        ...(assetUrl && { url: assetUrl }), // Only include `url` if `assetUrl` is truthy (not null or undefined)
        datetime: date,
        ...updatedSourceParams,
      });

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
          layerOrderPosition: 'raster',
          colorMapVersion: colorMap,
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
      date,
      assetUrl,
      minZoom,
      tileApiEndpoint,
      haveSourceParamsChanged,
      generatorParams,
      colorMap
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
