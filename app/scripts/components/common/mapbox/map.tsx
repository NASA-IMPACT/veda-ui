import React, { useEffect, RefObject, MutableRefObject } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { round } from '$utils/format';
import { variableGlsp } from '$styles/variable-utils';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN || '';

const SingleMapContainer = styled.div`
  && {
    position: absolute;
    inset: 0;
  }

  .mapboxgl-control-container {
    position: absolute;
    inset: ${variableGlsp()};
    pointer-events: none;

    > * {
      display: flex;
      flex-flow: column nowrap;
      gap: ${glsp()};
      align-items: flex-start;
      float: none;
      pointer-events: auto;
    }

    .mapboxgl-ctrl,
    .mapboxgl-ctrl-logo {
      margin: 0;
    }

    .mapboxgl-ctrl-attrib {
      order: 3;
      padding: 0;
      background: none;
    }

    .mapboxgl-ctrl-attrib-inner {
      color: ${themeVal('color.surface')};
      border-radius: ${themeVal('shape.ellipsoid')};
      padding: ${glsp(0.125, 0.5)};
      background: ${themeVal('color.base-400a')};

      a,
      a:visited {
        color: inherit;
      }
    }
  }

  .mapboxgl-ctrl-bottom-left {
    flex-direction: row;
    align-items: flex-end;
  }

  .mapboxgl-marker:hover {
    cursor: pointer;
  }
`;

interface SimpleMapProps {
  [key: string]: unknown;
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  containerRef: RefObject<HTMLDivElement>;
  onLoad(e: mapboxgl.EventData): void;
  onMoveEnd?(e: mapboxgl.EventData): void;
  onUnmount?: () => void;
  mapOptions: Partial<Omit<mapboxgl.MapboxOptions, 'container'>>;
}

export function SimpleMap(props: SimpleMapProps): JSX.Element {
  const { mapRef, containerRef, onLoad, onMoveEnd, onUnmount, mapOptions, ...rest } =
    props;

  useEffect(() => {
    if (!containerRef.current) return;

    const mbMap = new mapboxgl.Map({
      container: containerRef.current,
      attributionControl: false,
      ...mapOptions
    });

    mapRef.current = mbMap;

    // Add zoom controls without compass.
    if (mapOptions?.interactive !== false) {
      mbMap.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left');
    }

    // Include attribution.
    mbMap.addControl(new mapboxgl.AttributionControl(), 'bottom-left');

    onLoad && mbMap.once('load', onLoad);

    onMoveEnd && mbMap.on('moveend', (e) => {
      onMoveEnd({
        // The existence of originalEvent indicates that it was not caused by
        // a method call.
        userInitiated: Object.prototype.hasOwnProperty.call(e, 'originalEvent'),
        lng: round(mbMap.getCenter().lng, 4),
        lat: round(mbMap.getCenter().lat, 4),
        zoom: round(mbMap.getZoom(), 2)
      });
    });

    // Trigger a resize to handle flex layout quirks.
    setTimeout(() => mbMap.resize(), 1);

    return () => {
      mbMap.remove();
      mapRef.current = null;
      onUnmount?.();
    };
    // Only use the props on mount. We don't want to update the map if they
    // change.
  }, []);

  return <SingleMapContainer ref={containerRef} {...rest} />;
}

SimpleMap.propTypes = {
  mapRef: T.shape({
    current: T.object
  }).isRequired,
  containerRef: T.shape({
    current: T.object
  }).isRequired,
  onLoad: T.func,
  onMoveEnd: T.func,
  mapOptions: T.object.isRequired
};
