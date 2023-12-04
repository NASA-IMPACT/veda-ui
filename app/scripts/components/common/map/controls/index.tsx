import React from 'react';
import {
  NavigationControl as MapboxGLNavigationControl,
  ScaleControl as MapboxGLScaleControl
} from 'react-map-gl';

export function NavigationControl() {
  return <MapboxGLNavigationControl position='top-right' showCompass={false} />;
}

export function ScaleControl() {
  return <MapboxGLScaleControl position='bottom-left' />;
}
