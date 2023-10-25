import React, { ReactNode } from 'react';
import { MapProvider } from 'react-map-gl';
import Maps, { MapsContextWrapperProps } from './maps';

export const COMPARE_NAME = 'Compare';
export function Compare({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

Compare.displayName = COMPARE_NAME;

export const CONTROLS_CONTAINER_NAME = 'MapControlsContainer';
export function MapControls({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

MapControls.displayName = CONTROLS_CONTAINER_NAME;

export default function MapProviderWrapper(props: MapsContextWrapperProps) {
  return (
    <MapProvider>
      <Maps {...props}>{props.children}</Maps>
    </MapProvider>
  );
}
