import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CompareMbGL from 'mapbox-gl-compare';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import * as dateFns from 'date-fns';

import { ActionStatus, S_FAILED, S_IDLE, S_LOADING, S_SUCCEEDED } from '$utils/status';
import { getLayerComponent, resolveConfigFunctions } from './layers/utils';
import { useDatasetAsyncLayer } from '$context/layer-data';
import { MapLoading } from '$components/common/loading-skeleton';
import { SimpleMap } from './map';
import MapMessage from './map-message';
import LayerLegend from './layer-legend';
import { DatasetDatumFnResolverBag } from 'delta/thematics';

const MapsContainer = styled.div`
  position: relative;
`;

const mapOptions: Partial<mapboxgl.MapboxOptions> = {
  style: process.env.MAPBOX_STYLE_URL,
  logoPosition: 'bottom-left',
  trackResize: true,
  pitchWithRotate: false,
  dragRotate: false,
  zoom: 1
};

const getMapPositionOptions = (position) => {
  const opts = {} as Pick<typeof mapOptions, 'center' | 'zoom'>;
  if (position?.lng !== undefined && position?.lat !== undefined) {
    opts.center = [position.lng, position.lat];
  }

  if (position?.zoom) {
    opts.zoom = position.zoom;
  }

  return opts;
};

function MapboxMapComponent(props: MapboxMapProps, ref) {
  /* eslint-disable react/prop-types */
  const {
    className,
    id,
    as,
    datasetId,
    layerId,
    date,
    compareDate,
    compareLabel,
    isComparing,
    cooperativeGestures,
    onPositionChange,
    initialPosition,
    withGeocoder
  } = props;
  /* eslint-enable react/prop-types */

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const mapCompareContainer = useRef<HTMLDivElement>(null);
  const mapCompareRef = useRef<mapboxgl.Map>(null);

  const [isMapLoaded, setMapLoaded] = useState(false);
  const [isMapCompareLoaded, setMapCompareLoaded] = useState(false);

  // This baseLayerStatus is for BaseLayerComponent
  // ex. RasterTimeSeries uses this variable to track the status of registering mosaic
  const [baseLayerStatus, setBaseLayerStatus] = useState<ActionStatus>(S_IDLE);
  const onBaseLayerStatusChange = useCallback(
    ({status}) => setBaseLayerStatus(status),
    []
  );
  const [compareLayerStatus, setCompareLayerStatus] =
    useState<ActionStatus>(S_IDLE);
  const onCompareLayerStatusChange = useCallback(
    (status) => setCompareLayerStatus(status),
    []
  );

  // Add ref control operations to allow map to be controlled by the parent.
  useImperativeHandle(ref, () => ({
    resize: () => {
      mapRef.current?.resize();
      mapCompareRef.current?.resize();
    }
  }));

  const { baseLayer, compareLayer } = useDatasetAsyncLayer(datasetId, layerId);

  const shouldRenderCompare = isMapLoaded && isComparing;

  // Compare control
  useEffect(() => {
    if (!isMapLoaded || !isComparing || !isMapCompareLoaded) return;

    const compareControl = new CompareMbGL(
      mapRef.current,
      mapCompareRef.current,
      `#${id || 'mapbox-container'}`,
      {
        mousemove: false,
        orientation: 'vertical'
      }
    );

    return () => {
      compareControl.remove();
    };
  }, [id, isComparing, isMapCompareLoaded, isMapLoaded]);

  // Some properties defined in the dataset layer config may be functions that
  // need to be resolved before rendering them. These functions accept data to
  // return the correct value.
  const resolverBag = useMemo<DatasetDatumFnResolverBag>(
    () => ({ datetime: date, userCompareDatetime: compareDate, dateFns }),
    [date, compareDate]
  );

  // Resolve data needed for the base layer once the layer is loaded
  const [baseLayerResolvedData, BaseLayerComponent] = useMemo(() => {
    if (baseLayer?.status !== S_SUCCEEDED || !baseLayer.data)
      return [null, null];

    // Include access to raw data.
    const bag = { ...resolverBag, raw: baseLayer.data };
    const data = resolveConfigFunctions(baseLayer.data, bag);

    return [data, getLayerComponent(!!data.timeseries, data.type)];
  }, [baseLayer, resolverBag]);

  // Resolve data needed for the compare layer once it is loaded.
  const [compareLayerResolvedData, CompareLayerComponent] = useMemo(() => {
    if (compareLayer?.status !== S_SUCCEEDED || !compareLayer.data)
      return [null, null];

    // Include access to raw data.
    const bag = { ...resolverBag, raw: compareLayer.data };
    const data = resolveConfigFunctions(compareLayer.data, bag);

    return [data, getLayerComponent(!!data.timeseries, data.type)];
  }, [compareLayer, resolverBag]);

  // Get the compare to date.
  // If a compare date is specified use the given one, otherwise use the result
  // from the resolved config function.
  // A custom date may be specified in the MDX map block.
  // If no date is specified anywhere we just use the same.
  const compareToDate = useMemo(() => {
    const theDate = compareDate || compareLayerResolvedData?.datetime || date;
    return theDate instanceof Date && !isNaN(theDate.getTime())
      ? theDate
      : null;
  }, [compareLayerResolvedData?.datetime, compareDate, date]);

  const computedCompareLabel = useMemo(() => {
    // Use a provided label if it exist.
    const providedLabel = compareLabel || compareLayerResolvedData?.mapLabel;
    if (providedLabel) return providedLabel;

    // Default to date comparison.
    return date && compareToDate
      ? `${dateFns.format(date, 'yyyy/MM/dd')} VS ${dateFns.format(
          compareToDate,
          'yyyy/MM/dd'
        )}`
      : null;
  }, [compareLabel, compareLayerResolvedData?.mapLabel, date, compareToDate]);

  return (
    <>
      {/*
        Each layer type is added to the map through a component. This component
        has all the logic needed to add/update/remove the layer.
        Which component to use will depend on the characteristics of the layer
        and dataset.
        The function getLayerComponent() should be used to get the correct
        component.
      */}
      {isMapLoaded && baseLayerResolvedData && BaseLayerComponent && (
        <BaseLayerComponent
          id={`base-${baseLayerResolvedData.id}`}
          layerId={baseLayerResolvedData.id}
          mapInstance={mapRef.current}
          date={date}
          sourceParams={baseLayerResolvedData.sourceParams}
          zoomExtent={baseLayerResolvedData.zoomExtent}
          onStatusChange={onBaseLayerStatusChange}
        />
      )}

      {/*
        Adding a layer to the comparison map is also done through a component,
        which is this case targets a different map instance.
      */}
      {isMapCompareLoaded &&
        isComparing &&
        compareLayerResolvedData &&
        CompareLayerComponent && (
          <CompareLayerComponent
            id={`compare-${compareLayerResolvedData.id}`}
            layerId={compareLayerResolvedData.id}
            mapInstance={mapCompareRef.current}
            date={compareToDate}
            sourceParams={compareLayerResolvedData.sourceParams}
            onStatusChange={onCompareLayerStatusChange}
          />
        )}

      {/*
        Normally we only need 1 loading which is centered. If we're comparing we
        need to render a loading for each layer, but instead of centering them,
        we show them on top of their respective map.
      */}
      {baseLayerStatus === S_LOADING && (
        <MapLoading position={shouldRenderCompare ? 'left' : 'center'} />
      )}
      {shouldRenderCompare && compareLayerStatus === S_LOADING && (
        <MapLoading position='right' />
      )}

        <MapMessage
          id='mosaic-base-fail-message'
          active={baseLayerStatus === S_FAILED}
        >
          Failed to register layer {baseLayer?.data.id}
        </MapMessage>
      
        <MapMessage
          id='mosaic-compare-fail-message'
          active={compareLayerStatus === S_FAILED}
        >
          Failed to register layer {compareLayer?.data.id}
        </MapMessage>
      

      {/*
        Map overlay element
        Message shown when the map is in compare mode to indicate what's
        being compared.
        If the user provided an override value (compareLabel), use that.
      */}
      <MapMessage
        id='compare-message'
        active={!!(shouldRenderCompare && compareLayerResolvedData && !(compareLayerStatus === S_FAILED))}
      >
        {computedCompareLabel}
      </MapMessage>

      {/*
        Map overlay element
        Layer legend for the active layer.
      */}
      {baseLayerResolvedData?.legend && (
        <LayerLegend
          id={`base-${baseLayerResolvedData.id}`}
          title={baseLayerResolvedData.name}
          description={baseLayerResolvedData.description}
          {...baseLayerResolvedData.legend}
        />
      )}

      {/*
        Maps container
      */}
      <MapsContainer
        as={as}
        className={className}
        id={id || 'mapbox-container'}
      >
        <SimpleMap
          className='root'
          mapRef={mapRef}
          containerRef={mapContainer}
          onLoad={() => setMapLoaded(true)}
          onMoveEnd={onPositionChange}
          mapOptions={{
            ...mapOptions,
            ...getMapPositionOptions(initialPosition),
            cooperativeGestures
          }}
          withGeocoder={withGeocoder}
        />
        {shouldRenderCompare && (
          <SimpleMap
            mapRef={mapCompareRef}
            containerRef={mapCompareContainer}
            onLoad={() => setMapCompareLoaded(true)}
            onUnmount={() => setMapCompareLoaded(false)}
            mapOptions={{
              ...mapOptions,
              cooperativeGestures,
              center: mapRef.current?.getCenter(),
              zoom: mapRef.current?.getZoom()
            }}
            withGeocoder={withGeocoder}
          />
        )}
      </MapsContainer>
    </>
  );
}

type MapPosition = {
  lng: number;
  lat: number;
  zoom: number;
};

export interface MapboxMapProps {
  as?: any;
  className?: string;
  id: string;
  datasetId: string;
  layerId: string;
  date?: Date;
  compareDate?: Date;
  compareLabel?: string;
  isComparing?: boolean;
  cooperativeGestures?: boolean;
  initialPosition?: Partial<MapPosition>;
  onPositionChange?: (
    result: MapPosition & {
      userInitiated: boolean;
    }
  ) => void;
  withGeocoder?: boolean;
  children?: React.ReactNode;
}

type MapboxMapRef = {
  resize: () => void;
};

const MapboxMapComponentFwd = React.forwardRef<MapboxMapRef, MapboxMapProps>(
  MapboxMapComponent
);

/**
 * Mapbox map component
 *
 * @param {string} id Id to apply to the map wrapper.
 *    Defaults to mapbox-container
 * @param {string} className Css class for styling
 */
export default styled(MapboxMapComponentFwd)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;
