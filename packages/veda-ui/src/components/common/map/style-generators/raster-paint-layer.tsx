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
  /**
   * If provided, this XYZ tile URL template (e.g.
   * `https://.../cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png`) is used directly:
   * no tilejson fetch, source spec uses `tiles: [...]` instead of `url: ...`.
   * Use this when the tile template is known up-front (e.g. titiler's
   * `/cog/tiles/...` for per-item COG layers).
   */
  tilesTemplate?: string;
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
    tilesTemplate,
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
      ...(reScale && { rescale: Object.values(reScale) })
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
      if (!tileApiEndpoint && !tilesTemplate) return;
      const controller = new AbortController();
      async function run() {
        // Create a modified version of the parameters
        const tileParamsAsString = formatTitilerParameter(updatedTileParams);
        const baseUrl = tilesTemplate ?? tileApiEndpoint;
        const tileUrl = `${baseUrl}?${tileParamsAsString}`;

        try {
          let tileUrlMetadata;
          let mapSourceParams: Record<string, any>;

          if (tilesTemplate) {
            // Tile template is known up-front; skip the tilejson round trip.
            // Mapbox uses the `tiles` array directly. tileSize: 256 matches
            // titiler's default tile size.
            tileUrlMetadata = metadataFormatter
              ? metadataFormatter(null, tileParamsAsString)
              : { xyzTileUrl: tileUrl };
            mapSourceParams = { tiles: [tileUrl], tileSize: 256 };
          } else {
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
                metadataFormatter &&
                metadataFormatter(null, tileParamsAsString);
            }
            mapSourceParams = sourceParamFormatter(tileUrl);
          }

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
      tilesTemplate,
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
