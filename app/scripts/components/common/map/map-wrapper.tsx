import React, {
  ReactNode,
  Children,
  useMemo,
  ReactElement,
  JSXElementConstructor,
  useState,
  createContext,
} from 'react';
import styled from 'styled-components';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import MapboxStyleOverride from './mapbox-style-override';
import { Styles } from './styles';
import useMapCompare from './hooks/useMapCompare';
import MapComponent from './map-component';

const MapWrapperContainer = styled.div`
  && {
    inset: 0;
  }

  & > * {
    position: absolute !important;
    top: 0;
    bottom: 0;
    left: 0;
  }

  ${MapboxStyleOverride}
`;

export default function MapWrapper({ children }: { children: ReactNode }) {
  useMapCompare();
  const { generators, compareGenerators, controls } = useMemo(() => {
    const childrenArr = Children.toArray(children) as ReactElement[];

    // Split children into layers and controls, using all children provided
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

  // Hols the initial view state for the main map, used by compare map at mount
  const [initialViewState, setInitialViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1
  });

  return (
    <MapWrapperContext.Provider
      value={{ initialViewState, setInitialViewState }}
    >
      <MapWrapperContainer id='comparison-container'>
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
      </MapWrapperContainer>
    </MapWrapperContext.Provider>
  );
}


interface MapWrapperContextType {
  initialViewState: any;
  setInitialViewState: (viewState: any) => void;
}

export const MapWrapperContext = createContext<MapWrapperContextType>({
  initialViewState: {},
  setInitialViewState: () => undefined
});
