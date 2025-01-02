import React, { createContext, ReactNode, useContext } from 'react';
import { DATASETS_PATH, STORIES_PATH } from '$utils/routes';

interface EnvironmentConfig {
  envMapboxToken: string;
  envApiStacEndpoint: string;
  envApiRasterEndpoint: string;
}

interface LinkProps {
  to: string;
  children: ReactNode;
  [key: string]: any;
}

interface NavigationConfig {
  LinkComponent: React.ElementType<Record<string, any>>;
  linkPropName: string;
}

interface RoutesConfig {
  dataCatalogPath?: string;
  storiesCatalogPath?: string;
}

interface VedaUIConfig extends EnvironmentConfig {
  navigation: NavigationConfig;
  routes: RoutesConfig;
  Link: React.FC<LinkProps>;
}

interface VedaUIProviderProps {
  config: EnvironmentConfig & {
    navigation?: Partial<NavigationConfig>;
    routes?: RoutesConfig;
  };
  children: ReactNode;
}

const defaultNavigation: NavigationConfig = {
  LinkComponent: 'a',
  linkPropName: 'href'
};

const defaultRoutes: RoutesConfig = {
  dataCatalogPath: DATASETS_PATH,
  storiesCatalogPath: STORIES_PATH
};

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
    if (!value.trim()) {
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
  const navigation = {
    ...defaultNavigation,
    ...config.navigation
  };

  const routes = {
    ...defaultRoutes,
    ...config.routes
  }

  const Link: React.FC<LinkProps> = ({ to, children, ...props }) => {
    const { LinkComponent, linkPropName } = navigation;
    return (
      <LinkComponent {...{ [linkPropName]: to }} {...props}>
        {children}
      </LinkComponent>
    );
  };

  const fullConfig: VedaUIConfig = {
    ...config,
    navigation,
    routes,
    Link
  };

  validateConfig(fullConfig);

  return (
    <VedaUIContext.Provider value={fullConfig}>
      {children}
    </VedaUIContext.Provider>
  );
}
