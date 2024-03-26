import React from 'react';
import {
  NavigationControl as MapboxGLNavigationControl,
  ScaleControl as MapboxGLScaleControl,
  ControlPosition
} from 'react-map-gl';

export function NavigationControl({position='top-right'}: {position?: ControlPosition}) {
  return <MapboxGLNavigationControl position={position} showCompass={false} />;
}

export function ScaleControl() {
  return <MapboxGLScaleControl position='bottom-left' />;
}
