import React, { ReactNode } from 'react';
import { MapProvider } from 'react-map-gl';
import Maps, { MapsContextWrapperProps } from './maps';

export function Compare({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default function MapProviderWrapper(props: MapsContextWrapperProps) {
  return (
    <MapProvider>
      <Maps {...props}>{props.children}</Maps>
    </MapProvider>
  );
}
