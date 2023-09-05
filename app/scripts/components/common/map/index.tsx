import React, {
  useCallback,
  ReactNode,
  Children,
  useMemo,
  useEffect,
  ReactElement,
  JSXElementConstructor
} from 'react';
import styled from 'styled-components';
import Map, { MapProvider, useMap } from 'react-map-gl';
import MapboxCompare from 'mapbox-gl-compare';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import MapboxStyleOverride from './mapbox-style-override';
import { Styles } from './styles';

const MapContainer = styled.div`
  {
    position: absolute;
    inset: 0;
    width: 100%;
    top: 0,
    bottom: 0,
    left: 0
  }
  ${MapboxStyleOverride}
`;

function CompareHandler() {
  const { main, compared } = useMap();
  useEffect(() => {
    if (!main) return;

    let compare;
    if (compared) {
      compare = new MapboxCompare(main, compared, '#comparison-container', {
        mousemove: false,
        orientation: 'vertical'
      });
    }

    return () => {
      if (compare) compare.remove();
    };
  }, [main, compared]);

  return <div>sdsd</div>;
}

export default function MapWrapper({ children }: { children: ReactNode }) {
  const onStyleUpdate = useCallback((style) => {
    console.log('style', style);
  }, []);

  const { layers, compareLayers, controls } = useMemo(() => {
    const childrenArr = Children.toArray(children) as ReactElement[];

    // Split children into layers and controls
    let layers: ReactElement[] = [];
    let controls: ReactElement[] = [];
    let compareLayers: ReactElement[] = [];

    childrenArr.forEach((child) => {
      const componentName = (child.type as JSXElementConstructor<any>).name;
      if (componentName === 'Compare') {
        compareLayers = Children.toArray(
          child.props.children
        ) as ReactElement[];
      } else if (['Basemap', 'RasterTimeseries'].includes(componentName)) {
        layers = [...layers, child];
      } else {
        controls = [...controls, child];
      }
    });
    return {
      layers,
      controls,
      compareLayers
    };
  }, [children]);

  return (
    <MapContainer id='comparison-container'>
      <MapProvider>
        <CompareHandler />
        <Map
          id='main'
          mapboxAccessToken={process.env.MAPBOX_TOKEN}
          initialViewState={{
            longitude: 0,
            latitude: 0,
            zoom: 1
          }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0 }}
          mapStyle='mapbox://styles/mapbox/streets-v9'
        >
          {controls}
          <Styles onStyleUpdate={onStyleUpdate}>{layers}</Styles>
        </Map>
        {compareLayers.length && (
          <Map
            id='compared'
            mapboxAccessToken={process.env.MAPBOX_TOKEN}
            initialViewState={{
              longitude: 1,
              latitude: 1,
              zoom: 1
            }}
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0 }}
            mapStyle='mapbox://styles/mapbox/light-v10'
          >
            {/* {controls} */}
            {/* <Styles onStyleUpdate={onStyleUpdate}>{layers}</Styles> */}
          </Map>
        )}
      </MapProvider>
    </MapContainer>
  );
}

export function Compare({ children }: { children: ReactNode }) {
  return children;
}

export function Basemap() {
  return null;
}
