import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  RefObject,
  MutableRefObject
} from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CompareMbGL from 'mapbox-gl-compare';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';

import {
  DatasetLayer,
  DatasetLayerCompareInternal,
  DatasetLayerCompareSTAC,
  datasets
} from 'delta/thematics';
import {
  getCompareLayerData,
  getLayerComponent,
  resolveConfigFunctions
} from './layers/utils';
import { SimpleMap } from './map';

console.log('🚀 ~ file: map.js ~ line 8 ~ datasets', datasets);

// TODO: Token from config
mapboxgl.accessToken =
  'pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJja2F6eHBobTUwMzVzMzFueGJuczF6ZzdhIn0.8va1fkyaWgM57_gZ2rBMMg';

const MapsContainer = styled.div`
  position: relative;
`;

const SingleMapContainer = styled.div`
  && {
    position: absolute;
    inset: 0;
  }
`;

const mapOptions = {
  style: 'mapbox://styles/covid-nasa/ckb01h6f10bn81iqg98ne0i2y',
  logoPosition: 'bottom-left',
  pitchWithRotate: false,
  dragRotate: false,
  zoom: 3
};

type DatasetLayerWithDatasetId = DatasetLayer & { datasetId: string };

function useLayerData(
  datasetId?: string,
  layerId?: string
): DatasetLayerWithDatasetId | null {
  return useMemo(() => {
    if (!datasetId || !layerId) return null;

    const layer = datasets[datasetId]?.data.layers?.find(
      (l) => l.id === layerId
    );
    if (!layer) {
      throw new Error(`Layer [${layerId}] not found in dataset [${datasetId}]`);
    }
    return { datasetId, ...layer };
  }, [datasetId, layerId]);
}

function MapboxMapComponent(props) {
  const { className, id, as, datasetId, layerId, date, isComparing } = props;

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const mapCompareContainer = useRef<HTMLDivElement>(null);
  const mapCompareRef = useRef<mapboxgl.Map>(null);

  const [isMapLoaded, setMapLoaded] = useState(false);
  const [isMapCompareLoaded, setMapCompareLoaded] = useState(false);

  const dataset = useMemo(() => datasets[datasetId]?.data, [datasetId]);
  const layerData = useLayerData(datasetId, layerId);

  console.log('🚀 ~ MapboxMapComponent', datasetId, layerId, date);
  console.log('🚀 ~ file: map.js ~ MapboxMapComponent ~ layerData', layerData);
  console.log('🚀 ~ file: map.js ~ MapboxMapComponent ~ dataset', dataset);

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

  // const isTimeseries = layerData?.timeseries;
  const isTimeseries = true;
  const layerType = layerData?.type;
  const MapLayerComponent = getLayerComponent(isTimeseries, layerType);
  const shouldRenderCompare = isMapLoaded && isComparing;

  // Some properties defined in the dataset layer config may be functions that
  // need to be resolved before rendering them. These functions accept data to
  // return the correct value.
  const resolverBag = useMemo(() => ({ datetime: date }), [date]);

  // Layers source parameters.
  const layerSourceParams = useMemo(
    () =>
      layerData && resolveConfigFunctions(layerData.sourceParams, resolverBag),
    [layerData, resolverBag]
  );

  // Compare data
  // The values for the compare layer will depend on how it is defined:
  // is if from a dataset?
  // is it a layer defined in-line?
  // Also, we need to resolve any function that may be defined by the compare.
  const compareData = useMemo(
    () => resolveConfigFunctions(getCompareLayerData(layerData), resolverBag),
    [layerData, resolverBag]
  );
  console.log('🚀 ~ file: index.tsx ~ compareData', compareData);

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
      {isMapLoaded && MapLayerComponent && (
        <MapLayerComponent
          id={`base-${layerId}`}
          layerId={layerId}
          mapInstance={mapRef.current}
          date={date}
          sourceParams={layerSourceParams}
        />
      )}

      {/*
        Adding a layer to the comparison map is also done through a component,
        which is this case targets a different map instance.
      */}
      {isMapCompareLoaded && isComparing && compareData && (
        <MapLayerComponent
          id={`compare-${compareData.id}`}
          layerId={compareData.id}
          mapInstance={mapCompareRef.current}
          date={compareData.datetime}
          sourceParams={compareData.sourceParams}
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

MapboxMapComponent.propTypes = {
  as: T.string,
  className: T.string,
  id: T.string
};

/**
 * Mapbox map component
 *
 * @param {string} id Id to apply to the map wrapper.
 *    Defaults to mapbox-container
 * @param {string} className Css class for styling
 */
export default styled(MapboxMapComponent)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;
