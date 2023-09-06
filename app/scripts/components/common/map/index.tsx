import React, { ReactNode } from 'react';
import { MapProvider } from 'react-map-gl';
import MapWrapper from './map-wrapper';

export function Compare({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default function MapProviderWrapper({
  children
}: {
  children: ReactNode;
}) {
  return (
    <MapProvider>
      <MapWrapper>{children}</MapWrapper>
    </MapProvider>
  );
}
