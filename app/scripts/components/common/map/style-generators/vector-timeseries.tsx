import { useCallback, useEffect, useMemo, useState } from 'react';
import qs from 'qs';
import { AnyLayer, AnySourceImpl, VectorSourceImpl } from 'mapbox-gl';
import { useTheme } from 'styled-components';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';

import centroid from '@turf/centroid';
import { LngLatLike } from 'react-map-gl';
import { Feature } from 'geojson';

import { BaseGeneratorParams } from '../types';
import useMapStyle from '../hooks/use-map-style';
import { requestQuickCache } from '../utils';
import useFitBbox from '../hooks/use-fit-bbox';
import useLayerInteraction from '../hooks/use-layer-interaction';
import { MARKER_LAYOUT } from '../hooks/use-custom-marker';
import useMaps from '../hooks/use-maps';
import useGeneratorParams from '../hooks/use-generator-params';

import { ActionStatus, S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';
import { userTzDate2utcString } from '$utils/date';

export interface VectorTimeseriesProps extends BaseGeneratorParams {
  id: string;
  stacCol: string;
  date: Date;
  sourceParams?: Record<string, any>;
  zoomExtent?: number[];
  bounds?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isPositionSet?: boolean;
  stacApiEndpoint?: string;
  envApiStacEndpoint: string;
}

export function VectorTimeseries(props: VectorTimeseriesProps) {
  const {
    id,
    stacCol,
    date,
    sourceParams,
    zoomExtent,
    bounds,
    onStatusChange,
    isPositionSet,
    hidden,
    opacity,
    stacApiEndpoint,
    envApiStacEndpoint
  } = props;

  const { current: mapInstance } = useMaps();

  const theme = useTheme();
  const { updateStyle } = useMapStyle();
  const [featuresApiEndpoint, setFeaturesApiEndpoint] = useState('');
  const [featuresBbox, setFeaturesBbox] =
    useState<[number, number, number, number]>();

  const [minZoom, maxZoom] = zoomExtent ?? [0, 20];
  const generatorId = `vector-timeseries-${id}`;

  const stacApiEndpointToUse = stacApiEndpoint ?? envApiStacEndpoint ?? '';

  //
  // Get the tiles url
  //
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });
        const data = await requestQuickCache<any>({
          url: `${stacApiEndpointToUse}/collections/${stacCol}`,
          method: 'GET',
          controller
        });

        const endpoint = data.links.find((l) => l.rel === 'external').href;
        setFeaturesApiEndpoint(endpoint);

        const featuresData = await requestQuickCache<any>({
          url: endpoint,
          method: 'GET',
          controller
        });

        if (featuresData.extent.spatial.bbox) {
          setFeaturesBbox(featuresData.extent.spatial.bbox[0]);
        }

        onStatusChange?.({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setFeaturesApiEndpoint('');
          onStatusChange?.({ status: S_FAILED, id });
        }
        return;
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, stacCol, stacApiEndpointToUse, onStatusChange]);

  //
  // Generate Mapbox GL layers and sources for vector timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );

  const generatorParams = useGeneratorParams(props);

  useEffect(() => {
    if (!date || !featuresApiEndpoint) return;

    const start = userTzDate2utcString(startOfDay(date));
    const end = userTzDate2utcString(endOfDay(date));

    const tileParams = qs.stringify({
      ...sourceParams,
      datetime: `${start}/${end}`
    });

    const vectorOpacity = typeof opacity === 'number' ? opacity / 100 : 1;

    const sources: Record<string, AnySourceImpl> = {
      [id]: {
        type: 'vector',
        tiles: [`${featuresApiEndpoint}/tiles/{z}/{x}/{y}?${tileParams}`]
      } as VectorSourceImpl
    };

    const layers = [
      {
        id: `${id}-line-bg`,
        type: 'line',
        source: id,
        'source-layer': 'default',
        paint: {
          'line-opacity': hidden ? 0 : vectorOpacity,
          'line-opacity-transition': {
            duration: 320
          },
          'line-color': theme.color?.['danger-300'],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            minZoom,
            4,
            maxZoom,
            10
          ]
        },
        // filter: ['==', '$type', 'LineString'],
        minzoom: minZoom,
        metadata: {
          id,
          layerOrderPosition: 'raster',
          xyzTileUrl: `${featuresApiEndpoint}/tiles/{z}/{x}/{y}?${tileParams}`
        }
      },
      {
        id: `${id}-line-fg`,
        type: 'line',
        source: id,
        'source-layer': 'default',
        paint: {
          'line-opacity': hidden ? 0 : vectorOpacity,
          'line-opacity-transition': {
            duration: 320
          },
          'line-color': theme.color?.infographicB,
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            minZoom,
            2,
            maxZoom,
            5
          ]
        },
        filter: ['==', '$type', 'LineString'],
        minzoom: minZoom,
        metadata: {
          layerOrderPosition: 'raster'
        }
      },
      {
        id: `${id}-fill-fg`,
        type: 'fill',
        source: id,
        'source-layer': 'default',
        paint: {
          'fill-opacity': hidden ? 0 : Math.min(vectorOpacity, 0.8),
          'fill-opacity-transition': {
            duration: 320
          },
          'fill-color': theme.color?.infographicB
        },
        filter: ['==', '$type', 'Polygon'],
        minzoom: minZoom,
        metadata: {
          layerOrderPosition: 'raster'
        }
      },
      minZoom > 0
        ? {
            type: 'symbol',
            id: `${id}-points`,
            source: id,
            'source-layer': 'default',
            layout: {
              ...(MARKER_LAYOUT as any),
              visibility: hidden ? 'none' : 'visible'
            },
            paint: {
              'icon-color': theme.color?.infographicB,
              'icon-halo-color': theme.color?.base,
              'icon-halo-width': 1
            },
            maxzoom: minZoom,
            metadata: {
              layerOrderPosition: 'markers'
            }
          }
        : undefined
    ].filter(Boolean) as AnyLayer[];

    updateStyle({
      generatorId,
      sources,
      layers,
      params: generatorParams
    });
    // sourceParams not included, but using a stringified version of it to
    // detect changes (haveSourceParamsChanged)
    // `theme` will not change throughout the app use
  }, [
    id,
    updateStyle,
    date,
    featuresApiEndpoint,
    minZoom,
    maxZoom,
    hidden,
    opacity,
    generatorParams,
    haveSourceParamsChanged,
    generatorId
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
      const extractedFeat = {
        type: 'Feature',
        geometry: features[0].geometry
      } as Feature<any>;

      const center = centroid(extractedFeat).geometry.coordinates as LngLatLike;

      // Zoom past the min zoom centering on the clicked feature.
      mapInstance?.flyTo({
        zoom: minZoom,
        center
      });
    },
    [mapInstance, minZoom]
  );
  useLayerInteraction({
    layerId: `${id}-points`,
    onClick: onPointsClick
  });

  //
  // FitBounds when needed
  //
  useFitBbox(!!isPositionSet, bounds, featuresBbox);

  return null;
}
