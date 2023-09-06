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
import MapboxCompare from 'mapbox-gl-compare';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import MapboxStyleOverride from './mapbox-style-override';
import { Styles, StylesContext } from './styles';
import { MapId } from './types';

const MapContainer = styled.div`
  && {
    inset: 0;
  }

  & > * {
    border: 1px solid red;
    position: absolute !important;
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

    if (compared) {
      const compare = new MapboxCompare(
        main,
        compared,
        '#comparison-container',
        {
          mousemove: false,
          orientation: 'vertical'
        }
      );

      return () => {
        compare.remove();
      };
    }
  }, [main, compared]);

  return null;
}

function MapComponent({
  id,
  controls
}: {
  id: MapId;
  controls: ReactElement[];
}) {
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

  const { style } = useContext(StylesContext);

  if (!style) return null;

  return (
    <ReactMapGlMap
      id={id}
      mapboxAccessToken={process.env.MAPBOX_TOKEN}
      initialViewState={initialViewState}
      mapStyle={style as any}
      onMove={onMove}
    >
      {controls}
    </ReactMapGlMap>
  );
}

export default function MapWrapper({ children }: { children: ReactNode }) {
  const { generators, compareGenerators, controls } = useMemo(() => {
    const childrenArr = Children.toArray(children) as ReactElement[];

    // Split children into layers and controls
    const sortedChildren = childrenArr.reduce(
      (acc, child) => {
        const componentName = (child.type as JSXElementConstructor<any>).name;
        if (componentName === 'Compare') {
          acc.compareGenerators = Children.toArray(
            child.props.children
          ) as ReactElement[];
        } else if (['Basemap', 'RasterTimeseries'].includes(componentName)) {
          acc.generators = [...acc.generators, child];
        } else {
          acc.controls = [...acc.controls, child];
        }
        return acc;
      },
      {
        generators: [] as ReactElement[],
        controls: [] as ReactElement[],
        compareGenerators: [] as ReactElement[]
      }
    );

    return sortedChildren;
  }, [children]);

  const [initialViewState, setInitialViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1
  });

  return (
    <MapContainerContext.Provider
      value={{ initialViewState, setInitialViewState }}
    >
      <MapContainer id='comparison-container'>
        <MapProvider>
          <CompareHandler />
          <Styles>
            {generators}
            <MapComponent id='main' controls={controls} />
          </Styles>
          {compareGenerators.length && (
            <Styles>
              {compareGenerators}
              <MapComponent id='compared' controls={[]} />
            </Styles>
          )}
        </MapProvider>
      </MapContainer>
    </MapContainerContext.Provider>
  );
}

interface MapContainerContextType {
  initialViewState: any;
  setInitialViewState: (viewState: any) => void;
}

const MapContainerContext = createContext<MapContainerContextType>({
  initialViewState: {},
  setInitialViewState: () => undefined,
});
