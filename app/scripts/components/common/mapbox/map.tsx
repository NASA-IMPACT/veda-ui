import React, { useEffect, RefObject, MutableRefObject } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { round } from '$utils/format';
import { variableGlsp } from '$styles/variable-utils';
import {
  createButtonGroupStyles,
  createButtonStyles
} from '@devseed-ui/button';

import {
  iconDataURI,
  CollecticonPlusSmall,
  CollecticonMinusSmall
} from '@devseed-ui/collecticons';

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
      gap: ${glsp(0.5)};
      align-items: flex-start;
      float: none;
      pointer-events: auto;
    }

    .mapboxgl-ctrl {
      margin: 0;
    }

    .mapboxgl-ctrl-attrib {
      order: 100;
      padding: 0;
      background: none;
    }

    .mapboxgl-ctrl-attrib-inner {
      color: ${themeVal('color.surface')};
      border-radius: ${themeVal('shape.ellipsoid')};
      padding: ${glsp(0.125, 0.5)};
      font-size: 0.75rem;
      line-height: 1rem;
      background: ${themeVal('color.base-400a')};
      transform: translateY(-0.075rem);

      a,
      a:visited {
        color: inherit;
        font-size: inherit;
        line-height: inherit;
        vertical-align: top;
        text-decoration: none;
      }

      a:hover {
        opacity: 0.64;
      }
    }
  }

  .mapboxgl-ctrl-logo,
  .mapboxgl-ctrl-attrib-inner {
    margin: 0;
    opacity: 0.48;
    transition: all 0.24s ease-in-out 0s;

    &:hover {
      opacity: 1;
    }
  }

  .mapboxgl-ctrl-bottom-left {
    flex-direction: row;
    align-items: flex-end;
  }

  .mapboxgl-ctrl-group {
    ${createButtonGroupStyles({ orientation: 'vertical' })}
    background: none;

    &,
    &:not(:empty) {
      box-shadow: ${themeVal('boxShadow.elevationA')};
    }

    > button {
      span {
        display: none;
      }

      &::before {
        display: inline-block;
        content: '';
        background-repeat: no-repeat;
        background-size: 1rem 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    > button:first-child:not(:last-child) {
      &,
      &::after {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }

      &::after {
        clip-path: inset(-100% -100% 0 -100%);
      }
    }
    > button:last-child:not(:first-child) {
      &,
      &::after {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }

      &::after {
        clip-path: inset(0 -100% -100% -100%);
      }
    }
    > button:not(:first-child):not(:last-child) {
      &,
      &::after {
        border-radius: 0;
      }

      &::after {
        clip-path: inset(0 -100%);
      }
    }
    > button + button {
      margin-top: -${themeVal('button.shape.border')};
    }
  }

  .mapboxgl-ctrl-zoom-in.mapboxgl-ctrl-zoom-in,
  .mapboxgl-ctrl-zoom-out.mapboxgl-ctrl-zoom-out {
    ${createButtonStyles({ variation: 'primary-fill', fitting: 'skinny' })}
  }

  .mapboxgl-ctrl-zoom-in.mapboxgl-ctrl-zoom-in::before {
    background-image: url('${({ theme }) =>
      iconDataURI(CollecticonPlusSmall, {
        color: theme.color.surface
      })}');
  }

  .mapboxgl-ctrl-zoom-out.mapboxgl-ctrl-zoom-out::before {
    background-image: url('${({ theme }) =>
      iconDataURI(CollecticonMinusSmall, {
        color: theme.color.surface
      })}');
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

    // Include attribution.
    mbMap.addControl(new mapboxgl.AttributionControl(), 'bottom-left');

    // Add zoom controls without compass.
    if (mapOptions?.interactive !== false) {
      mbMap.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-left'
      );
    }

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
