import { useEffect, useMemo } from 'react';
import { RasterSourceSpecification, RasterLayerSpecification } from 'mapbox-gl';
import { requestQuickCache } from '../utils';
import { BaseGeneratorParams } from '../types';
import useMapStyle from '../hooks/use-map-style';
import useGeneratorParams from '../hooks/use-generator-params';
import { STATUS_KEY } from './hooks';

import { formatTitilerParameter } from './utils';
import { TileJSON } from '$types/veda';
import { ActionStatus, S_SUCCEEDED } from '$utils/status';

interface RasterPaintLayerProps extends BaseGeneratorParams {
  id: string;
  tileApiEndpoint?: string | string[];
  zoomExtent?: number[];
  colorMap?: string | undefined;
  tileParams: Record<string, any>;
  generatorPrefix?: string;
  reScale?: { min: number; max: number };
  metadataFormatter?: (
    tileJsonData: TileJSON | null,
    tileParamsAsString: string
  ) => Record<string, any>;
  sourceParamFormatter?: (tileUrl: string) => Record<string, any>;
  onStatusChange?: (params: {
    status: ActionStatus;
    context: STATUS_KEY;
  }) => void;
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
    generatorPrefix = 'raster',
    metadataFormatter,
    sourceParamFormatter = (tileUrl) => ({ url: tileUrl }),
    onStatusChange
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
      if (!tileApiEndpoint) return;
      const controller = new AbortController();
      async function run() {
        // Create a modified version of the parameters
        const tileParamsAsString = formatTitilerParameter(updatedTileParams);
        const tileUrl = `${tileApiEndpoint}?${tileParamsAsString}`;

        try {
          let tileUrlMetadata;
          if (
            !generatorPrefix.includes('wms') &&
            !generatorPrefix.includes('wmts')
          ) {
            // wms data doesn't have an endpoint for tilejson
            const tileJsonData = await requestQuickCache<any>({
              url: tileUrl,
              method: 'GET',
              payload: null,
              controller
            });

            tileUrlMetadata =
              metadataFormatter &&
              metadataFormatter(tileJsonData, tileParamsAsString);
          } else {
            tileUrlMetadata =
              metadataFormatter && metadataFormatter(null, tileParamsAsString);
          }
          const mapSourceParams = sourceParamFormatter(tileUrl);

          const rasterSource: RasterSourceSpecification = {
            type: 'raster',
            ...mapSourceParams
          };
          const rasterOpacity = typeof opacity === 'number' ? opacity / 100 : 1;

          const rasterLayer: RasterLayerSpecification = {
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
              id,
              layerOrderPosition: 'raster',
              ...tileUrlMetadata
            }
          };

          const sources = {
            [id]: rasterSource
          };
          const layers = [rasterLayer];

          updateStyle({
            generatorId,
            sources,
            layers,
            params: generatorParams
          });
          if (onStatusChange)
            onStatusChange({
              status: S_SUCCEEDED,
              context: STATUS_KEY.Layer
            });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          throw e;
        }
      }
      run();
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
