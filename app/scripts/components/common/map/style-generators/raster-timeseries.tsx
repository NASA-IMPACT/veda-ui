import { useCallback, useEffect, useMemo } from 'react';
import {
  AnyLayer,
  AnySourceImpl,
  GeoJSONSourceRaw,
  LngLatBoundsLike,
  RasterLayer,
  RasterSource,
  SymbolLayer
} from 'mapbox-gl';
import { useTheme } from 'styled-components';
import { featureCollection, point } from '@turf/helpers';
import { BaseGeneratorParams } from '../types';
import useMapStyle from '../hooks/use-map-style';
import {
  FIT_BOUNDS_PADDING,
  getMergedBBox,
} from '../utils';
import useFitBbox from '../hooks/use-fit-bbox';
import useLayerInteraction from '../hooks/use-layer-interaction';
import { MARKER_LAYOUT } from '../hooks/use-custom-marker';
import useMaps from '../hooks/use-maps';
import useGeneratorParams from '../hooks/use-generator-params';
import { StacFeature } from '$components/common/map/types';

import {
  ActionStatus,
  S_FAILED,
} from '$utils/status';

// Whether or not to print the request logs.
const LOG = true;

interface AssetUrlReplacement {
  from: string;
  to: string;
}

export interface RasterTimeseriesProps extends BaseGeneratorParams {
  id: string;
  stacCollection: StacFeature[];
  sourceParams?: Record<string, any>;
  zoomExtent?: number[];
  bounds?: number[];
  onStatusChange?: (result: { status: ActionStatus; context: string }) => void;
  isPositionSet?: boolean;
  // For replacing HTTPS asset URLs with S3 in the CMR STAC response.
  // eslint-disable-next-line react/no-unused-prop-types  
  assetUrlReplacements?: AssetUrlReplacement;
  hidden?: boolean;
  tileUrlWithParams?: string | undefined;
  wmtsTilesUrl?: string | undefined;
}

export function RasterTimeseries(props: RasterTimeseriesProps) {
  const {
    id,
    stacCollection,
    sourceParams,
    zoomExtent,
    bounds,
    onStatusChange,
    isPositionSet,
    hidden,
    opacity,
    tileUrlWithParams,
    wmtsTilesUrl
  } = props;

  const { current: mapInstance } = useMaps();

  const theme = useTheme();
  const { updateStyle } = useMapStyle();

  const minZoom = zoomExtent?.[0] ?? 0;
  const generatorId = `raster-timeseries-${id}`;

  //
  // Markers
  //
  const points = useMemo(() => {
    if (!stacCollection.length) return null;
    const points = stacCollection.map((f) => {
      const [w, s, e, n] = f.bbox;
      return {
        bounds: [
          [w, s],
          [e, n]
        ] as LngLatBoundsLike,
        center: [(w + e) / 2, (s + n) / 2] as [number, number]
      };
    });

    return points;
  }, [stacCollection]);


  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );

  const generatorParams = useGeneratorParams(props);

  // update layers and sources
  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      let layers: AnyLayer[] = [];
      let sources: Record<string, AnySourceImpl> = {};

      try {
        if (!tileUrlWithParams) return;

        const rasterSource: RasterSource = {
          type: 'raster',
          url: tileUrlWithParams 
        };

        const rasterOpacity = typeof opacity === 'number' ? opacity / 100 : 1;

        const rasterLayer: RasterLayer = {
          id: id,
          type: 'raster',
          source: id,
          layout: {
            visibility: hidden ? 'none' : 'visible'
          },
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
            xyzTileUrl: tileUrlWithParams,
            wmtsTilesUrl
          }
        };

        sources = {
          ...sources,
          [id]: rasterSource
        };
        layers = [...layers, rasterLayer];
      } catch (error) {
        if (!controller.signal.aborted) {
          sources = {};
          layers = [];
          onStatusChange?.({
            status: S_FAILED,
            context: 'StacSearch'
          });
        }
        LOG &&
          /* eslint-disable-next-line no-console */
          console.log(
            'MapLayerRasterTimeseries %cAborted Mosaic',
            'color: red;',
            id
          );
        // Continue to the style is updated to empty.
      }

      if (points && minZoom > 0) {
        const pointsSourceId = `${id}-points`;
        const pointsSource: GeoJSONSourceRaw = {
          type: 'geojson',
          data: featureCollection(
            points.map((p) => point(p.center, { bounds: p.bounds }))
          )
        };

        const pointsLayer: SymbolLayer = {
          type: 'symbol',
          id: pointsSourceId,
          source: pointsSourceId,
          layout: {
            ...(MARKER_LAYOUT as any),
            'icon-allow-overlap': true
          },
          paint: {
            'icon-color': theme.color?.primary,
            'icon-halo-color': theme.color?.base,
            'icon-halo-width': 1
          },
          maxzoom: minZoom,
          metadata: {
            layerOrderPosition: 'markers'
          }
        };
        sources = {
          ...sources,
          [pointsSourceId]: pointsSource as AnySourceImpl
        };
        layers = [...layers, pointsLayer];
      }

      updateStyle({
        generatorId,
        sources,
        layers,
        params: generatorParams
      });
    }

    run();

    return () => {
      controller.abort();
    };
  }, [
    points,
    minZoom,
    haveSourceParamsChanged,
    generatorParams,
    // This hook depends on a series of properties, but whenever they change the
    // `mosaicUrl` is guaranteed to change because a new STAC request is
    // needed to show the data. The following properties are therefore removed
    // from the dependency array:
    // - id
    // - changeStatus
    // - stacCol
    // - date
    // Keeping then in would cause multiple requests because for example when
    // `date` changes the hook runs, then the request in the hook above
    // fires and `mosaicUrl` changes, causing this hook to run again. This
    // resulted in a race condition when adding the source to the map leading to
    // an error.
    // Other:
    // -- generatorParams includes hidden and opacity
    // -- sourceParams is tracked by haveSourceParamsChanged
    // -- theme and updateStyle are stable
  ]);

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

  //
  // Listen to mouse events on the markers layer
  //
  const onPointsClick = useCallback(
    (features) => {
      const bounds = JSON.parse(features[0].properties.bounds);
      mapInstance?.fitBounds(bounds, { padding: FIT_BOUNDS_PADDING });
    },
    [mapInstance]
  );
  useLayerInteraction({
    layerId: `${id}-points`,
    onClick: onPointsClick
  });

  //
  // FitBounds when needed
  //
  const layerBounds = useMemo(
    () => (stacCollection.length ? getMergedBBox(stacCollection) : undefined),
    [stacCollection]
  );
  useFitBbox(!!isPositionSet, bounds, layerBounds);

  return null;
}
