import React, {
  ReactNode,
  Children,
  useMemo,
  ReactElement,
  useState,
  createContext,
  Ref
} from 'react';
import styled from 'styled-components';
import { MapboxOptions } from 'mapbox-gl';
import {
  CollecticonChevronLeftSmall,
  CollecticonChevronRightSmall,
  iconDataURI
} from '@devseed-ui/collecticons';
import { themeVal } from '@devseed-ui/theme-provider';
import { ProjectionOptions } from 'veda';
import useDimensions from 'react-cool-dimensions';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import { MapRef } from 'react-map-gl';
import MapboxStyleOverride from './mapbox-style-override';
import { ExtendedStyle, Styles } from './styles';
import useMapCompare from './hooks/use-map-compare';
import MapComponent from './map-component';
import useMaps, { useMapsContext } from './hooks/use-maps';
import { aoiCustomCursorStyle } from './controls/aoi/custom-aoi-control';
import { COMPARE_CONTAINER_NAME, CONTROLS_CONTAINER_NAME } from '.';

const chevronRightURI = () =>
  iconDataURI(CollecticonChevronRightSmall, {
    color: 'white'
  });

const chevronLeftURI = () =>
  iconDataURI(CollecticonChevronLeftSmall, {
    color: 'white'
  });

const MapsContainer = styled.div`
  ${MapboxStyleOverride}
  height: 100%;
  flex: 1; /* Necessary for Safari */
  .mapboxgl-map {
    position: absolute !important;
    inset: 0;

    &.mouse-add .mapboxgl-canvas-container {
      cursor: crosshair;
    }
    &.mouse-pointer .mapboxgl-canvas-container {
      cursor: pointer;
    }
    &.mouse-move .mapboxgl-canvas-container {
      cursor: move;
    }
    ${aoiCustomCursorStyle}
  }

  .mapboxgl-compare .compare-swiper-vertical {
    background: ${themeVal('color.primary')};
    display: flex;
    align-items: center;
    justify-content: center;

    &::before,
    &::after {
      display: inline-block;
      content: '';
      background-repeat: no-repeat;
      background-size: 1rem 1rem;
      width: 1rem;
      height: 1rem;
    }

    &::before {
      background-image: url('${chevronLeftURI()}');
    }
    &::after {
      background-image: url('${chevronRightURI()}');
    }
  }
`;

type MapsProps = Pick<
  MapsContextWrapperProps,
  'projection' | 'onStyleUpdate' | 'mapRef' | 'onMapLoad'
> & {
  children: ReactNode;
  interactive?: boolean;
};

function Maps({ children, projection, onStyleUpdate, mapRef, onMapLoad, interactive }: MapsProps) {
  // Instantiate MGL Compare, if compare is enabled
  useMapCompare();

  // Split children into layers and controls, using all children provided
  const { generators, compareGenerators, controls } = useMemo(() => {
    const childrenArr = Children.toArray(children) as ReactElement[];

    const sortedChildren = childrenArr.reduce(
      (acc, child) => {
        // This is added so that we can use the component name in production
        // where the function names are minified
        // @ts-expect-error displayName is not in the type
        const componentName = child.type.displayName ?? '';

        if (componentName === COMPARE_CONTAINER_NAME) {
          acc.compareGenerators = Children.toArray(
            child.props.children
          ) as ReactElement[];
        } else if (componentName == CONTROLS_CONTAINER_NAME) {
          acc.controls = Children.toArray(
            child.props.children
          ) as ReactElement[];
        } else {
          acc.generators = [...acc.generators, child];
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

  const { containerId } = useMapsContext();
  return (
    <MapsContainer id={containerId} ref={observe}>
      <Styles onStyleUpdate={onStyleUpdate}>
        {generators}
        <MapComponent interactive={interactive} mapRef={mapRef} onMapLoad={onMapLoad} controls={controls} projection={projection} />
      </Styles>
      {!!compareGenerators.length && (
        <Styles isCompared>
          {compareGenerators}
          <MapComponent
            interactive={interactive}
            mapRef={mapRef}
            isCompared
            controls={controls}
            projection={projection}
            onMapLoad={onMapLoad}
          />
        </Styles>
      )}
    </MapsContainer>
  );
}

export interface MapsContextWrapperProps {
  children: ReactNode;
  id: string;
  mapRef?: Ref<MapRef>;
  onMapLoad?: () => void;
  projection?: ProjectionOptions;
  onStyleUpdate?: (style: ExtendedStyle) => void;
  mapOptions?: Partial<Omit<MapboxOptions, 'container'>>;
}

export default function MapsContextWrapper(props: MapsContextWrapperProps) {
  const { id, mapOptions, mapRef, onMapLoad } = props;
  const mainId = `main-map-${id}`;
  const comparedId = `compared-map-${id}`;
  const containerId = `comparison-container-${id}`;

  // Holds the initial view state for the main map, used by compare map at mount
  const [initialViewState, setInitialViewState] = useState({
    latitude: mapOptions?.center?.[1] ?? 0,
    longitude: mapOptions?.center?.[0] ?? 0,
    zoom: mapOptions?.zoom ?? 1
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
      <Maps interactive={mapOptions?.interactive} onMapLoad={onMapLoad} mapRef={mapRef} {...props}>{props.children}</Maps>
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
