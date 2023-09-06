import React, {
  useCallback,
  ReactNode,
  Children,
  useMemo,
  useEffect,
  ReactElement,
  JSXElementConstructor,
  useState,
  createContext,
  useContext
} from 'react';
import styled from 'styled-components';
import ReactMapGlMap, { MapProvider, useMap } from 'react-map-gl';
import { Style } from 'mapbox-gl';
import MapboxCompare from 'mapbox-gl-compare';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import MapboxStyleOverride from './mapbox-style-override';
import { Styles } from './styles';
import { MapId } from './types';

const MapContainer = styled.div`
  && {
    position: absolute;
    inset: 0;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
  }
  ${MapboxStyleOverride}
`;

export function Compare({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

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

function Map({
  id,
  controls,
  generators
}: {
  id: MapId;
  controls: ReactElement[];
  generators: ReactElement[];
}) {
  const [style, setStyle] = useState<Style | undefined>();
  const onStyleUpdate = useCallback((style) => {
    setStyle(style);
  }, []);

  const { initialViewState, setInitialViewState } =
    useContext(MapContainerContext);

  const onMove = useCallback(
    (evt) => {
      if (id === 'main') {
        setInitialViewState(evt.viewState);
      }
    },
    [id, setInitialViewState]
  );

  return (
    <Styles onStyleUpdate={onStyleUpdate}>
      {style && (
        <ReactMapGlMap
          id={id}
          mapboxAccessToken={process.env.MAPBOX_TOKEN}
          initialViewState={initialViewState}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0 }}
          mapStyle={style as any}
          onMove={onMove}
        >
          {controls}
          {generators}
        </ReactMapGlMap>
      )}
    </Styles>
  );
}

export default function MapWrapper({ children }: { children: ReactNode }) {
  const { generators, compareGenerators, controls } = useMemo(() => {
    const childrenArr = Children.toArray(children) as ReactElement[];

    // Split children into layers and controls
    let generators: ReactElement[] = [];
    let controls: ReactElement[] = [];
    let compareGenerators: ReactElement[] = [];

    childrenArr.forEach((child) => {
      const componentName = (child.type as JSXElementConstructor<any>).name;
      if (componentName === 'Compare') {
        compareGenerators = Children.toArray(
          child.props.children
        ) as ReactElement[];
      } else if (['Basemap', 'RasterTimeseries'].includes(componentName)) {
        generators = [...generators, child];
      } else {
        controls = [...controls, child];
      }
    });
    return {
      generators,
      controls,
      compareGenerators
    };
  }, [children]);

  const [initialViewState, setInitialViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1
  });

  const [activeMap, setActiveMap] = useState<MapId>('main');

  return (
    <MapContainerContext.Provider
      value={{ initialViewState, setInitialViewState, activeMap, setActiveMap }}
    >
      <MapContainer id='comparison-container'>
        <MapProvider>
          <CompareHandler />
          <Map id='main' generators={generators} controls={controls} />
          {compareGenerators.length && (
            <Map
              id='compared'
              generators={compareGenerators}
              controls={controls}
            />
          )}
        </MapProvider>
      </MapContainer>
    </MapContainerContext.Provider>
  );
}

interface MapContainerContextType {
  initialViewState: any;
  setInitialViewState: (viewState: any) => void;
  activeMap: MapId;
  setActiveMap: (mapId: MapId) => void;
}

const MapContainerContext = createContext<MapContainerContextType>({
  initialViewState: {},
  setInitialViewState: () => undefined,
  activeMap: 'main',
  setActiveMap: () => undefined
});
