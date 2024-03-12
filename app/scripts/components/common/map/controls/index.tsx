import React from 'react';
import {
  NavigationControl as MapboxGLNavigationControl,
  ScaleControl as MapboxGLScaleControl,
  AttributionControl as MapboxAttributionControl,
  ControlPosition
} from 'react-map-gl';

export function AttributionControl({message}: {message: string}) {
  return <MapboxAttributionControl customAttribution={message} compact={true} />;
}

export function NavigationControl({position='top-right'}: {position?: ControlPosition}) {
  return <MapboxGLNavigationControl position={position} showCompass={false} />;
}

export function ScaleControl() {
  return <MapboxGLScaleControl position='bottom-left' />;
}
