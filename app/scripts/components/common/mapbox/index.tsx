import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CompareMbGL from 'mapbox-gl-compare';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';

import { getLayerComponent, resolveConfigFunctions } from './layers/utils';
import { SimpleMap } from './map';
import { useDatasetAsyncLayer } from '$context/layer-data';

const MapsContainer = styled.div`
  position: relative;
`;

const mapOptions = {
  style: 'mapbox://styles/covid-nasa/ckb01h6f10bn81iqg98ne0i2y',
  logoPosition: 'bottom-left',
  pitchWithRotate: false,
  dragRotate: false,
  zoom: 3
};

function MapboxMapComponent(props, ref) {
  // eslint-disable-next-line react/prop-types
  const { className, id, as, datasetId, layerId, date, isComparing } = props;

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const mapCompareContainer = useRef<HTMLDivElement>(null);
  const mapCompareRef = useRef<mapboxgl.Map>(null);

  const [isMapLoaded, setMapLoaded] = useState(false);
  const [isMapCompareLoaded, setMapCompareLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    resize: () => {
      mapRef.current?.resize();
      mapCompareRef.current?.resize();
    }
  }));

  // const dataset = useMemo(() => datasets[datasetId]?.data, [datasetId]);
  // console.log('🚀 ~ file: map.js ~ MapboxMapComponent ~ dataset', dataset);
  const { baseLayer, compareLayer } = useDatasetAsyncLayer(datasetId, layerId);

  console.log('🚀 ~ MapboxMapComponent', datasetId, layerId, date);
  console.log('🚀 ~ file: map.js ~ MapboxMapComponent ~ baseLayer', baseLayer);
  console.log(
    '🚀 ~ file: map.js ~ MapboxMapComponent ~ compareLayer',
    compareLayer
  );

  const shouldRenderCompare = isMapLoaded && isComparing;

  // Compare control
  useEffect(() => {
    if (!isMapLoaded || !isComparing || !isMapCompareLoaded) {
      return;
    }
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
  const resolverBag = useMemo(() => ({ datetime: date }), [date]);

  // Resolve data needed for the base layer once the layer is loaded
  const [baseLayerResolvedData, BaseLayerComponent] = useMemo(() => {
    if (baseLayer?.status !== 'succeeded') {
      return [null, null];
    }
    const data = resolveConfigFunctions(baseLayer.data, resolverBag);

    return [data, getLayerComponent(data.timeseries, data.type)];
  }, [baseLayer, resolverBag]);

  // Resolve data needed for the compare layer once it is loaded.
  const [compareLayerResolvedData, CompareLayerComponent] = useMemo(() => {
    if (compareLayer?.status !== 'succeeded') {
      return [null, null];
    }
    const data = resolveConfigFunctions(compareLayer.data, resolverBag);

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
          />
        )}
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
          mapOptions={mapOptions}
        />
        {shouldRenderCompare && (
          <SimpleMap
            mapRef={mapCompareRef}
            containerRef={mapCompareContainer}
            onLoad={() => setMapCompareLoaded(true)}
            mapOptions={{
              ...mapOptions,
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
