import React from 'react';
import {
  NavigationControl as MapboxGLNavigationControl,
  ScaleControl as MapboxGLScaleControl
} from 'react-map-gl';

export function NavigationControl() {
  return <MapboxGLNavigationControl position='top-left' showCompass={false} />;
}

NavigationControl.displayName = 'NavigationControl';

export function ScaleControl() {
  return <MapboxGLScaleControl position='bottom-left' />;
}

ScaleControl.displayName = 'ScaleControl';
