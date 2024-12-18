import React, { createContext, ReactNode, useContext } from 'react';

interface EnvironmentConfig {
  envMapboxToken: string;
  envApiStacEndpoint: string;
  envApiRasterEndpoint: string;
}

interface NavigationConfig {
  LinkComponent: React.ElementType<Record<string, any>>;
  linkPropName: string;
}

const defaultNavigationConfig: NavigationConfig = {
  LinkComponent: 'a',
  linkPropName: 'href'
};

interface VedaUIConfig extends EnvironmentConfig {
  navigation: NavigationConfig;
}

interface VedaUIProviderProps {
  config: EnvironmentConfig & { navigation?: Partial<NavigationConfig> };
  children: ReactNode;
}

const VedaUIContext = createContext<VedaUIConfig | null>(null);
VedaUIContext.displayName = 'VedaUIContext';

function validateConfig(config: VedaUIConfig) {
  const requiredFields = [
    'envMapboxToken',
    'envApiStacEndpoint',
    'envApiRasterEndpoint'
  ] as const;

  requiredFields.forEach((field) => {
    const value = config[field];
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      // eslint-disable-next-line no-console
      console.warn(`VedaUIProvider: ${field} is required and cannot be empty.`);
    }
  });
}

export function useVedaUI(): VedaUIConfig {
  const context = useContext(VedaUIContext);
  if (!context) {
    throw new Error('useVedaUI must be used within a VedaUIProvider');
  }
  return context;
}

export function VedaUIProvider({ config, children }: VedaUIProviderProps) {
  const fullConfig: VedaUIConfig = {
    ...config,
    navigation: {
      ...defaultNavigationConfig,
      ...config.navigation
    }
  };

  validateConfig(fullConfig);

  return (
    <VedaUIContext.Provider value={fullConfig}>
      {children}
    </VedaUIContext.Provider>
  );
}
