import React from 'react';
import { Link } from 'react-router-dom';
import { VedaUIProvider } from '$context/veda-ui-provider';

export default function UIProviders({ children }: { children: any }) {
  return (
    <VedaUIProvider
      config={{
        envMapboxToken: process.env.MAPBOX_TOKEN ?? '',
        envApiStacEndpoint: process.env.API_STAC_ENDPOINT ?? '',
        envApiRasterEndpoint: process.env.API_RASTER_ENDPOINT ?? '',
        navigation: {
          LinkComponent: Link,
          linkProps: {
            pathAttributeKeyName: 'to'
          }
        }
      }}
    >
      {children}
    </VedaUIProvider>
  );
}
