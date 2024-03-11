import React from 'react';
import {
  NavigationControl as MapboxGLNavigationControl,
  ScaleControl as MapboxGLScaleControl,
  AttributionControl as MapboxAttributionControl
} from 'react-map-gl';

export function AttributionControl({message}: {message: string}) {
  return <MapboxAttributionControl customAttribution={message} compact={true} />;
}

export function NavigationControl() {
  return <MapboxGLNavigationControl position='top-right' showCompass={false} />;
}

export function ScaleControl() {
  return <MapboxGLScaleControl position='bottom-left' />;
}
