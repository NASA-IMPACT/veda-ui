import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import qs from 'qs';
import mapboxgl, {
  AnyLayer,
  AnySourceImpl,
  GeoJSONSourceRaw,
  LngLatBoundsLike,
  RasterLayer,
  RasterSource,
  SymbolLayer
} from 'mapbox-gl';
import { featureCollection, point } from '@turf/helpers';

import { StylesContext } from './styles';
import {
  checkFitBoundsFromLayer,
  getFilterPayload,
  getMergedBBox,
  requestQuickCache
} from './utils';
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

interface MapLayerRasterTimeseriesProps {
  id: string;
  stacCol: string;
  date?: Date;
  mapInstance: mapboxgl.Map;
  sourceParams: object;
  zoomExtent?: [number, number];
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

export function MapLayerRasterTimeseries(props: MapLayerRasterTimeseriesProps) {
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

  const { updateStyle } = useContext(StylesContext);

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
        statuses.current[STATUS_KEY.StacSearch],
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
  // Load stac collection features
  //
  const [stacCollection, setStacCollection] = useState<StacFeature[]>([]);
  useEffect(() => {
    if (!id || !stacCol || !date) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        changeStatus({ status: S_LOADING, context: STATUS_KEY.StacSearch });
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(date, stacCol),
          limit: 500,
          fields: {
            include: ['bbox'],
            exclude: ['collection', 'links']
          }
        };

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cLoading STAC features',
            'color: orange;',
            id
          );
        LOG && console.log('Payload', payload);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const responseData = await requestQuickCache(
          `${process.env.API_STAC_ENDPOINT}/search`,
          payload,
          controller
        );

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cAdding STAC features',
            'color: green;',
            id
          );
        LOG && console.log('STAC response', responseData);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        setStacCollection(responseData.features);
        changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.StacSearch });
      } catch (error) {
        if (!controller.signal.aborted) {
          setStacCollection([]);
          changeStatus({ status: S_FAILED, context: STATUS_KEY.StacSearch });
        }
        LOG &&
          /* eslint-disable-next-line no-console */
          console.log(
            'MapLayerRasterTimeseries %cAborted STAC features',
            'color: red;',
            id
          );
        return;
      }
    };
    load();
    return () => {
      controller.abort();
      changeStatus({ status: 'idle', context: STATUS_KEY.StacSearch });
    };
  }, [id, changeStatus, stacCol, date]);

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
  
  //
  // Tiles
  //
  const [mosaicUrl, setMosaicUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!id || !stacCol || !date || !stacCollection.length) return;

    const controller = new AbortController();

    const load = async () => {
      changeStatus({ status: S_LOADING, context: STATUS_KEY.Layer });
      try {
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(date, stacCol)
        };

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cLoading Mosaic',
            'color: orange;',
            id
          );
        LOG && console.log('Payload', payload);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const responseData = await requestQuickCache(
          `${process.env.API_RASTER_ENDPOINT}/mosaic/register`,
          payload,
          controller
        );

        setMosaicUrl(responseData.links[1].href);

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cAdding Mosaic',
            'color: green;',
            id
          );
        // links[0] : metadata , links[1]: tile
        LOG && console.log('Url', responseData.links[1].href);
        LOG && console.log('STAC response', responseData);
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
  }, [
    // The `showMarkers` and `isHidden` dep are left out on purpose, as visibility
    // is controlled below, but we need the value to initialize the layer
    // visibility.
    stacCollection
    // This hook depends on a series of properties, but whenever they change the
    // `stacCollection` is guaranteed to change because a new STAC request is
    // needed to show the data. The following properties are therefore removed
    // from the dependency array:
    // - id
    // - changeStatus
    // - stacCol
    // - date
    // Keeping then in would cause multiple requests because for example when
    // `date` changes the hook runs, then the STAC request in the hook above
    // fires and `stacCollection` changes, causing this hook to run again. This
    // resulted in a race condition when adding the source to the map leading to
    // an error.
  ]);

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

      if (mosaicUrl) {
        const tileParams = qs.stringify(
          {
            assets: 'cog_default',
            ...sourceParams
          },
          // Temporary solution to pass different tile parameters for hls data
          { arrayFormat: id.toLowerCase().includes('hls') ? 'repeat' : 'comma' }
        );

        const mosaicSource: RasterSource = {
          type: 'raster',
          url: `${mosaicUrl}?${tileParams}`
        };

        const mosaicLayer: RasterLayer = {
          id: id,
          type: 'raster',
          source: id,
          layout: {
            visibility: isHidden ? 'none' : 'visible',
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
          [id]: mosaicSource
        };
        layers = [...layers, mosaicLayer];
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
            'icon-image': 'leaflet-marker',
            visibility: isHidden ? 'none' : 'visible',
            'icon-allow-overlap': true,
            'icon-offset': [0, -12]
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
      mosaicUrl,
      minZoom,
      points,
      haveSourceParamsChanged,
      isHidden
    ]
  );

  //
  // Listen to mouse events on the markers layer
  //
  useEffect(() => {
    const pointsSourceId = `${id}-points`;

    const onPointsClick = (e) => {
      if (!e.features.length) return;
      const bounds = JSON.parse(e.features[0].properties.bounds);
      mapInstance.fitBounds(bounds, { padding: FIT_BOUNDS_PADDING });
    };
    const onPointsEnter = () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    };
    const onPointsLeave = () => {
      mapInstance.getCanvas().style.cursor = '';
    };
    mapInstance.on('click', pointsSourceId, onPointsClick);
    mapInstance.on('mouseenter', pointsSourceId, onPointsEnter);
    mapInstance.on('mouseleave', pointsSourceId, onPointsLeave);

    return () => {
      mapInstance.off('click', pointsSourceId, onPointsClick);
      mapInstance.off('mouseenter', pointsSourceId, onPointsEnter);
      mapInstance.off('mouseleave', pointsSourceId, onPointsLeave);
    };
  }, [id, mapInstance]);

  //
  // FitBounds when needed
  //
  useEffect(() => {
    if (!stacCollection.length) return;
    const layerBounds = getMergedBBox(stacCollection);

    if (checkFitBoundsFromLayer(layerBounds, mapInstance)) {
      mapInstance.fitBounds(layerBounds, { padding: FIT_BOUNDS_PADDING });
    }
  }, [mapInstance, stacCol, stacCollection]);

  return null;
}
