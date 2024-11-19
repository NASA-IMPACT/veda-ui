import React, { createContext } from 'react';

interface EnvConfig {
  envMapboxToken: string;
  envApiStacEndpoint: string;
  envApiRasterEndpoint: string;
}

export const EnvConfigContext = createContext<EnvConfig>({
  envMapboxToken: '',
  envApiStacEndpoint: '',
  envApiRasterEndpoint: ''
});

export function EnvConfigProvider({
  config,
  children
}: {
  config: EnvConfig;
  children: any;
}) {
  return (
    <EnvConfigContext.Provider value={config}>
      {children}
    </EnvConfigContext.Provider>
  );
}
