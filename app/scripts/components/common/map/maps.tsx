import React, {
  ReactNode,
  Children,
  useMemo,
  ReactElement,
  JSXElementConstructor,
  useState,
  createContext,
  useContext
} from 'react';
import styled from 'styled-components';
import useDimensions from 'react-cool-dimensions';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import MapboxStyleOverride from './mapbox-style-override';
import { Styles } from './styles';
import useMapCompare from './hooks/use-map-compare';
import MapComponent from './map-component';
import { useMaps } from './hooks/use-maps';

const MapsContainer = styled.div`
  ${MapboxStyleOverride}

  height: 100%;
`;

function Maps({ children }: { children: ReactNode }) {
  // Instanciate MGL Compare, if compare is enabled
  useMapCompare();

  // Split children into layers and controls, using all children provided
  const { generators, compareGenerators, controls } = useMemo(() => {
    const childrenArr = Children.toArray(children) as ReactElement[];

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

  const maps = useMaps();

  const { observe } = useDimensions({
    onResize: () => {
      setTimeout(() => {
        maps.main?.resize();
        maps.compared?.resize();
      }, 0);
    }
  });

  const { containerId } = useContext(MapsContext);

  return (
    <MapsContainer id={containerId} ref={observe}>
      <Styles>
        {generators}
        <MapComponent controls={controls} />
      </Styles>
      {!!compareGenerators.length && (
        <Styles>
          {compareGenerators}
          <MapComponent controls={[]} isCompared />
        </Styles>
      )}
    </MapsContainer>
  );
}

export interface MapsProps {
  children: ReactNode;
  id: string;
}

export default function MapsContextWrapper(props: MapsProps) {
  const { id } = props;
  const mainId = `main-map-${id}`;
  const comparedId = `compared-map-${id}`;
  const containerId = `comparison-container-${id}`;

  // Holds the initial view state for the main map, used by compare map at mount
  const [initialViewState, setInitialViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1
  });

  return (
    <MapsContext.Provider
      value={{
        initialViewState,
        setInitialViewState,
        mainId,
        comparedId,
        containerId
      }}
    >
      <Maps {...props}>{props.children}</Maps>
    </MapsContext.Provider>
  );
}

interface MapsContextType {
  initialViewState: any;
  setInitialViewState: (viewState: any) => void;
  mainId: string;
  comparedId: string;
  containerId: string;
}

export const MapsContext = createContext<MapsContextType>({
  initialViewState: {},
  setInitialViewState: () => undefined,
  mainId: '',
  comparedId: '',
  containerId: ''
});
