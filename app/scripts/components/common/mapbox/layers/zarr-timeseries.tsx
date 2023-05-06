import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import qs from 'qs';
import {
  Map as MapboxMap,
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

import { useMapStyle } from './styles';
import {
  checkFitBoundsFromLayer,
  getFilterPayload,
  getMergedBBox,
  requestQuickCache,
  useLayerInteraction
} from './utils';
import { useCustomMarker } from './custom-marker';

import {
  ActionStatus,
  S_FAILED,
  S_IDLE,
  S_LOADING,
  S_SUCCEEDED
} from '$utils/status';

// Whether or not to print the request logs.
const LOG = true;

const FIT_BOUNDS_PADDING = 32;

interface MapLayerZarrTimeseriesProps {
  id: string;
  stacCol: string;
  date?: Date;
  mapInstance: MapboxMap;
  sourceParams: object;
  zoomExtent?: [number, number];
  assetUrl?: string;
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden: boolean;
}

export interface StacFeature {
  bbox: [number, number, number, number];
}

enum STATUS_KEY {
  Global,
  Layer,
  StacSearch
}

interface Statuses {
  [STATUS_KEY.Global]: ActionStatus;
  [STATUS_KEY.Layer]: ActionStatus;
  [STATUS_KEY.StacSearch]: ActionStatus;
}

export function MapLayerZarrTimeseries(props: MapLayerZarrTimeseriesProps) {
  const {
    id,
    stacCol,
    date,
    mapInstance,
    sourceParams,
    zoomExtent,
    assetUrl,
    onStatusChange,
    isHidden
  } = props;

  const theme = useTheme();
  const { updateStyle } = useMapStyle();

  const minZoom = zoomExtent?.[0] ?? 0;

  // Status tracking.
  // A raster timeseries layer has a base layer and may have markers.
  // The status is succeeded only if all requests succeed.
  const statuses = useRef<Statuses>({
    [STATUS_KEY.Global]: S_IDLE,
    [STATUS_KEY.Layer]: S_IDLE,
    [STATUS_KEY.StacSearch]: S_IDLE
  });

  const changeStatus = useCallback(
    ({
      status,
      context
    }: {
      status: ActionStatus;
      context: STATUS_KEY.StacSearch | STATUS_KEY.Layer;
    }) => {
      // Set the new status
      statuses.current[context] = status;

      const layersToCheck = [
        statuses.current[STATUS_KEY.Layer]
      ];

      let newStatus = statuses.current[STATUS_KEY.Global];
      // All must succeed to be considered successful.
      if (layersToCheck.every((s) => s === S_SUCCEEDED)) {
        newStatus = S_SUCCEEDED;

        // One failed status is enough for all.
        // Failed takes priority over loading.
      } else if (layersToCheck.some((s) => s === S_FAILED)) {
        newStatus = S_FAILED;
        // One loading status is enough for all.
      } else if (layersToCheck.some((s) => s === S_LOADING)) {
        newStatus = S_LOADING;
      } else if (layersToCheck.some((s) => s === S_IDLE)) {
        newStatus = S_IDLE;
      }

      // Only emit on status change.
      if (newStatus !== statuses.current[STATUS_KEY.Global]) {
        statuses.current[STATUS_KEY.Global] = newStatus;
        onStatusChange?.({ status: newStatus, id });
      }
    },
    [id, onStatusChange]
  );


  //
  // Markers
  //
  // TODO(aimee): Pull these from Zarr metadata
  const points = useMemo(() => {
    const [w, s, e, n] = [-180, -90, 180, 90];
    return [{
      bounds: [
        [w, s],
        [e, n]
      ] as LngLatBoundsLike,
      center: [(w + e) / 2, (s + n) / 2] as [number, number]
    }];
  }, []);

  //
  // Tiles
  //
  let [tilesUrl, setTilesUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!id || !sourceParams['variable'] || !date) return;

    const controller = new AbortController();

    const load = async () => {
      changeStatus({ status: S_LOADING, context: STATUS_KEY.Layer });
      try {
        const payload = {};

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerZarrTimeseries %cLoading Zarr',
            'color: orange;',
            id
          );
        LOG && console.log('Payload', payload);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        // TODO(aimee: fetch CATALOG)

        setTilesUrl('https://enjmncj3p2.execute-api.us-west-2.amazonaws.com/tilejson.json');

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cAdding Mosaic',
            'color: green;',
            id
          );
        // links[0] : metadata , links[1]: tile
        // LOG && console.log('Url', responseData.links[1].href);
        // LOG && console.log('STAC response', responseData);
        LOG && console.groupEnd();
        /* eslint-enable no-console */
        changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.Layer });
      } catch (error) {
        if (!controller.signal.aborted) {
          changeStatus({ status: S_FAILED, context: STATUS_KEY.Layer });
        }
        LOG &&
          /* eslint-disable-next-line no-console */
          console.log(
            'MapLayerRasterTimeseries %cAborted Mosaic',
            'color: red;',
            id
          );
        return;
      }
    };

    load();

    return () => {
      controller.abort();
      changeStatus({ status: 'idle', context: STATUS_KEY.Layer });
    };
  }, []);

  const markerLayout = useCustomMarker(mapInstance);

  //
  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );
  useEffect(
    () => {
      let layers: AnyLayer[] = [];
      let sources: Record<string, AnySourceImpl> = {};

      if (tilesUrl) {
        let tileParams = qs.stringify(
          {
            url: assetUrl,
            ...sourceParams
          }
        );

        const zarrSource: RasterSource = {
          type: 'raster',
          url: `${tilesUrl}?${tileParams}`
        };

        const zarrLayer: RasterLayer = {
          id: id,
          type: 'raster',
          source: id,
          layout: {
            visibility: isHidden ? 'none' : 'visible'
          },
          paint: {
            'raster-opacity': Number(!isHidden),
            'raster-opacity-transition': {
              duration: 320
            }
          },
          minzoom: minZoom,
          metadata: {
            layerOrderPosition: 'raster'
          }
        };

        sources = {
          ...sources,
          [id]: zarrSource
        };
        layers = [...layers, zarrLayer];
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
            ...(markerLayout as any),
            visibility: isHidden ? 'none' : 'visible',
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
        generatorId: 'raster-timeseries',
        sources,
        layers
      });
    },
    // sourceParams not included, but using a stringified version of it to detect changes (haveSourceParamsChanged)
    [
      updateStyle,
      id,
      tilesUrl,
      minZoom,
      points,
      haveSourceParamsChanged,
      isHidden
    ]
  );

  //
  // Cleanup layers on unmount.
  //
  useEffect(() => {
    return () => {
      updateStyle({
        generatorId: 'raster-timeseries',
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
      const bounds = JSON.parse(features[0].properties.bounds);
      mapInstance.fitBounds(bounds, { padding: FIT_BOUNDS_PADDING });
    },
    [mapInstance]
  );
  useLayerInteraction({
    layerId: `${id}-points`,
    mapInstance,
    onClick: onPointsClick
  });

  return null;
}
