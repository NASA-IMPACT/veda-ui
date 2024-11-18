import React, { createContext } from 'react';

interface VedauiConfig {
  envMapboxToken: string;
  envApiStacEndpoint: string;
  envApiRasterEndpoint: string;
}

export const VedauiConfigContext = createContext<VedauiConfig>({
  envMapboxToken: '',
  envApiStacEndpoint: '',
  envApiRasterEndpoint: ''
});

export function VedauiConfigProvider({
  config,
  children
}: {
  config: VedauiConfig;
  children: any;
}) {
  return (
    <VedauiConfigContext.Provider value={config}>
      {children}
    </VedauiConfigContext.Provider>
  );
}
