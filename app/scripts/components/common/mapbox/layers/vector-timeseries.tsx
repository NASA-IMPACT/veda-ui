import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';
import qs from 'qs';
import {
  Map as MapboxMap,
  AnyLayer,
  AnySourceImpl,
  LngLatLike,
  VectorSourceImpl
} from 'mapbox-gl';
import { Feature } from 'geojson';
import { endOfDay, startOfDay } from 'date-fns';
import centroid from '@turf/centroid';
import { requestQuickCache, useFitBbox, useLayerInteraction } from './utils';
import { useMapStyle } from './styles';
import { useCustomMarker } from './custom-marker';

import { ActionStatus, S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';
import { userTzDate2utcString } from '$utils/date';

export interface MapLayerVectorTimeseriesProps {
  id: string;
  stacCol: string;
  stacApiEndpoint?: string;
  date?: Date;
  mapInstance: MapboxMap;
  sourceParams?: Record<string, any>;
  zoomExtent?: number[];
  bounds?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden?: boolean;
  idSuffix?: string;
  isPositionSet?: boolean;
}

export function MapLayerVectorTimeseries(props: MapLayerVectorTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    mapInstance,
    sourceParams,
    zoomExtent,
    bounds,
    onStatusChange,
    isHidden,
    idSuffix = '',
    isPositionSet
  } = props;

  const theme = useTheme();
  const { updateStyle } = useMapStyle();
  const [featuresApiEndpoint, setFeaturesApiEndpoint] = useState('');
  const [featuresBbox, setFeaturesBbox] =
    useState<[number, number, number, number]>();

  const [minZoom, maxZoom] = zoomExtent ?? [0, 20];

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;

  const generatorId = 'vector-timeseries' + idSuffix;

  //
  // Get the tiles url
  //
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });
        const data = await requestQuickCache({
          url: `${stacApiEndpointToUse}/collections/${stacCol}`,
          method: 'GET',
          controller
        });

        const endpoint = data.links.find((l) => l.rel === 'external').href;
        setFeaturesApiEndpoint(endpoint);

        const featuresData = await requestQuickCache({
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
  }, [mapInstance, id, stacCol, stacApiEndpointToUse, date, onStatusChange]);

  const markerLayout = useCustomMarker(mapInstance);

  //
  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );
  useEffect(() => {
    if (!date || !featuresApiEndpoint) return;

    const start = userTzDate2utcString(startOfDay(date));
    const end = userTzDate2utcString(endOfDay(date));

    const tileParams = qs.stringify({
      ...sourceParams,
      datetime: `${start}/${end}`
    });

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
        layout: {
          visibility: isHidden ? 'none' : 'visible'
        },
        paint: {
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
        layout: {
          visibility: isHidden ? 'none' : 'visible'
        },
        paint: {
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
        layout: {
          visibility: isHidden ? 'none' : 'visible'
        },
        paint: {
          'fill-color': theme.color?.infographicB,
          'fill-opacity': 0.8
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
              ...(markerLayout as any),
              visibility: isHidden ? 'none' : 'visible'
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
      layers
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
    isHidden,
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
      mapInstance.flyTo({
        zoom: minZoom,
        center
      });
    },
    [mapInstance, minZoom]
  );
  useLayerInteraction({
    layerId: `${id}-points`,
    mapInstance,
    onClick: onPointsClick
  });

  //
  // FitBounds when needed
  //
  useFitBbox(mapInstance, !!isPositionSet, bounds, featuresBbox);

  return null;
}
