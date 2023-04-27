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

import { requestQuickCache, useLayerInteraction } from './utils';
import { useMapStyle } from './styles';

import { ActionStatus, S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';
import { userTzDate2utcString } from '$utils/date';

interface MapLayerVectorTimeseriesProps {
  id: string;
  stacCol: string;
  date?: Date;
  mapInstance: MapboxMap;
  sourceParams: object;
  zoomExtent?: [number, number];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden: boolean;
}

export function MapLayerVectorTimeseries(props: MapLayerVectorTimeseriesProps) {
  const {
    id,
    stacCol,
    date,
    mapInstance,
    sourceParams,
    zoomExtent,
    onStatusChange,
    isHidden
  } = props;

  const theme = useTheme();
  const { updateStyle } = useMapStyle();
  const [featuresApiEndpoint, setFeaturesApiEndpoint] = useState('');

  const [minZoom, maxZoom] = zoomExtent ?? [0, 20];

  //
  // Get the tiles url
  //
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });
        const data = await requestQuickCache({
          url: `${process.env.API_STAC_ENDPOINT}/collections/${stacCol}`,
          method: 'GET',
          controller
        });

        setFeaturesApiEndpoint(data.links.find((l) => l.rel === 'child').href);
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
  }, [mapInstance, id, stacCol, date, onStatusChange]);

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
          'line-color': theme.color?.['base-300'],
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
          layerOrderPosition: 'raster'
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
          'line-color': theme.color?.primary,
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
          'fill-color': theme.color?.primary,
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
              'icon-image': 'leaflet-marker',
              visibility: isHidden ? 'none' : 'visible',
              'icon-offset': [0, -12]
            },
            maxzoom: minZoom,
            metadata: {
              layerOrderPosition: 'markers'
            }
          }
        : undefined
    ].filter(Boolean) as AnyLayer[];

    updateStyle({
      generatorId: 'vector-timeseries',
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
    haveSourceParamsChanged
  ]);

  //
  // Cleanup layers on unmount.
  //
  useEffect(() => {
    return () => {
      updateStyle({
        generatorId: 'vector-timeseries',
        sources: {},
        layers: []
      });
    };
  }, [updateStyle]);

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

  return null;
}
