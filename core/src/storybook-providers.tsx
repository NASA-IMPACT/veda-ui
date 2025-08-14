import React from 'react';
import { VedaUIProvider } from '$context/veda-ui-provider';
import DevseedUiThemeProvider from '$context/theme-provider';
import ReactQueryProvider from '$context/react-query';

export const StorybookProviders: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <VedaUIProvider
      config={{
        envMapboxToken: import.meta.env.MAPBOX_TOKEN ?? '',
        envApiStacEndpoint: import.meta.env.API_STAC_ENDPOINT ?? '',
        envApiRasterEndpoint: import.meta.env.API_RASTER_ENDPOINT ?? '',
        envApiCMREndpoint: import.meta.env.API_CMR_ENDPOINT ?? ''
      }}
    >
      <DevseedUiThemeProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </DevseedUiThemeProvider>
    </VedaUIProvider>
  );
};
