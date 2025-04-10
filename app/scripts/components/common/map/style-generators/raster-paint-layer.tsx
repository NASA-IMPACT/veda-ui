import { useEffect, useMemo } from 'react';
import qs from 'qs';
import { RasterSourceSpecification, RasterLayerSpecification } from 'mapbox-gl';

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
      // Create a modified version of the parameters
      const processedParams = { ...updatedTileParams } as {
        reScale?: number[];
        colormap_name?: string;
        bands?: string[];
        assets?: string[];
        [key: string]: any;
      };

      // bands and assets need to be sent as repeat query params
      const { bands, assets, bbox, ...regularParams } = processedParams;

      const repeatParams: Record<string, string[] | undefined> = {};
      if (Array.isArray(bands)) repeatParams.bands = bands;
      if (Array.isArray(assets)) repeatParams.assets = assets;

      const regularParamsString = qs.stringify(regularParams, {
        arrayFormat: 'comma'
      });

      const repeatParamsString = qs.stringify(repeatParams, {
        arrayFormat: 'repeat'
      });

      // Need to use raw query params for bbox, because it's a mapbox template query param
      const bboxString = bbox ? `bbox=${bbox}` : '';

      const tileParamsAsString = [
        regularParamsString,
        repeatParamsString,
        bboxString
      ]
        .filter(Boolean) // Remove empty strings
        .join('&');

      // Use url only if the request is being made to a tilejson endpoint (eg. raster)
      // otherwise use tiles array (eg. wms)
      const mapSourceParams = tileApiEndpoint?.includes('tilejson')
        ? {
            url: `${tileApiEndpoint}?${tileParamsAsString}`
          }
        : {
            tiles: [`${tileApiEndpoint}?${tileParamsAsString}`],
            tileSize: 256
          };

      const zarrSource: RasterSourceSpecification = {
        type: 'raster',
        ...mapSourceParams
      };

      const rasterOpacity = typeof opacity === 'number' ? opacity / 100 : 1;

      const zarrLayer: RasterLayerSpecification = {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
