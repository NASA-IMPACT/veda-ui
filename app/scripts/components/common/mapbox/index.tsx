import React, {
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

import { getLayerComponent, resolveConfigFunctions } from './layers/utils';
import { useDatasetAsyncLayer } from '$context/layer-data';
import {
  MapLoading,
  LoadingSkeleton
} from '$components/common/loading-skeleton';
import { SimpleMap } from './map';
import MapMessage from './map-message';
import LayerLegend from './layer-legend';

const MapsContainer = styled.div`
  position: relative;
`;

const mapOptions = {
  style: 'mapbox://styles/covid-nasa/ckb01h6f10bn81iqg98ne0i2y',
  logoPosition: 'bottom-left',
  pitchWithRotate: false,
  dragRotate: false,
  zoom: 1
};

function MapboxMapComponent(props, ref) {
  /* eslint-disable react/prop-types */
  const {
    className,
    id,
    as,
    datasetId,
    layerId,
    date,
    isComparing,
    cooperativeGestures
  } = props;
  /* eslint-enable react/prop-types */

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const mapCompareContainer = useRef<HTMLDivElement>(null);
  const mapCompareRef = useRef<mapboxgl.Map>(null);

  const [isMapLoaded, setMapLoaded] = useState(false);
  const [isMapCompareLoaded, setMapCompareLoaded] = useState(false);

  const [baseLayerStatus, setBaseLayerStatus] = useState('idle');
  const [compareLayerStatus, setCompareLayerStatus] = useState('idle');

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
  const resolverBag = useMemo(() => ({ datetime: date, dateFns }), [date]);

  // Resolve data needed for the base layer once the layer is loaded
  const [baseLayerResolvedData, BaseLayerComponent] = useMemo(() => {
    if (baseLayer?.status !== 'succeeded') return [null, null];

    // Include access to raw data.
    const bag = { ...resolverBag, raw: baseLayer.data };
    const data = resolveConfigFunctions(baseLayer.data, bag);

    return [data, getLayerComponent(data.timeseries, data.type)];
  }, [baseLayer, resolverBag]);

  // Resolve data needed for the compare layer once it is loaded.
  const [compareLayerResolvedData, CompareLayerComponent] = useMemo(() => {
    if (compareLayer?.status !== 'succeeded') return [null, null];

    // Include access to raw data.
    const bag = { ...resolverBag, raw: compareLayer.data };
    const data = resolveConfigFunctions(compareLayer.data, bag);

    return [data, getLayerComponent(data.timeseries, data.type)];
  }, [compareLayer, resolverBag]);

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
          onStatusChange={setBaseLayerStatus}
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
            date={compareLayerResolvedData.datetime}
            sourceParams={compareLayerResolvedData.sourceParams}
            onStatusChange={setCompareLayerStatus}
          />
        )}

      {/*
        Normally we only need 1 loading which is centered. If we're comparing we
        need to render a loading for each layer, but instead of centering them,
        we show them on top of their respective map.
      */}
      {baseLayerStatus === 'loading' && (
        <MapLoading position={shouldRenderCompare ? 'left' : 'center'}>
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </MapLoading>
      )}
      {shouldRenderCompare && compareLayerStatus === 'loading' && (
        <MapLoading position='right'>
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </MapLoading>
      )}

      {/*
        Map overlay element
        Message shown when the map is in compare mode to indicate what's
        being compared.
      */}
      <MapMessage
        id='compare-message'
        active={!!(shouldRenderCompare && compareLayerResolvedData)}
      >
        {compareLayerResolvedData?.mapLabel}
      </MapMessage>

      {/*
        Map overlay element
        Layer legend for the active layer.
      */}
      {baseLayerResolvedData?.legend && (
        <LayerLegend
          title={baseLayerResolvedData.name}
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
          mapOptions={{ ...mapOptions, cooperativeGestures }}
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
          />
        )}
      </MapsContainer>
    </>
  );
}

interface MapboxMapProps {
  as: string;
  className: string;
  id: string;
  datasetId: string;
  layerId: string;
  date: Date;
  isComparing: boolean;
  cooperativeGestures: boolean;
}

const MapboxMapComponentFwd =
  React.forwardRef<MapboxMapProps>(MapboxMapComponent);

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
