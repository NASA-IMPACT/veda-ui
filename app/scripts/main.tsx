import React, { lazy, Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import T from 'prop-types';
import {
  Link,
  BrowserRouter,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('$styles/styles.scss');
}

import '$static/styles/theme.css';

import '$styles/veda-styles.scss';

import { userPages } from 'veda';
import DevseedUiThemeProvider from './theme-provider';

import { discoveryRoutes } from './redirects';
import theme, { GlobalStyles } from '$styles/theme';
import { getAppURL } from '$utils/history';
import LayoutRoot from '$components/common/layout-root';
import { LayoutRootContextProvider } from '$components/common/layout-root/context';
import { useScrollbarWidthAsCssVar } from '$utils/use-scrollbar-width-css';
// Page loading
import { PageLoading } from '$components/common/loading-skeleton';
// Views
import UhOh from '$components/uhoh';
import ErrorBoundary from '$components/uhoh/fatal-error';

import '$types/array.d';

const Home = lazy(() => import('$components/home'));
const About = lazy(() => import('$components/about'));
const Development = lazy(() => import('$components/development'));

const StoriesHub = lazy(() => import('$components/stories/hub/container'));
const StoriesSingle = lazy(() => import('$components/stories/single'));

const DataCatalog = lazy(() => import('$components/data-catalog/container'));

const DatasetsOverview = lazy(() => import('$components/datasets/s-overview'));

const ExplorationAndAnalysis = lazy(
  () => import('$components/exploration/container')
);

const Sandbox = lazy(() => import('$components/sandbox'));

const UserPagesComponent = lazy(() => import('$components/user-pages'));

// Contexts
import ReactQueryProvider from '$context/react-query';
import {
  ABOUT_PATH,
  DATASETS_PATH,
  STORIES_PATH,
  EXPLORATION_PATH
} from '$utils/routes';
import { VedaUIProvider } from '$context/veda-ui-provider';

const composingComponents = [
  // Add contexts here.
  ErrorBoundary,
  ReactQueryProvider,
  LayoutRootContextProvider,
  ({ children }) => (
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
  )
];

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

// Root component.
function Root() {
  useScrollbarWidthAsCssVar();

  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner?.classList.add('dismissed');
    setTimeout(() => banner?.remove(), 500);
  }, []);

  return (
    <BrowserRouter basename={getAppURL().pathname}>
      <ScrollTop />
      <DevseedUiThemeProvider theme={theme}>
        <GlobalStyles />
        <Composer components={composingComponents}>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path='/' element={<LayoutRoot />}>
                <Route index element={<Home />} />
                <Route path={ABOUT_PATH} element={<About />} />
                <Route path={DATASETS_PATH} element={<DataCatalog />} />
                <Route
                  path={`${DATASETS_PATH}/:datasetId`}
                  element={<DatasetsOverview />}
                />
                <Route path={STORIES_PATH} element={<StoriesHub />} />
                <Route
                  path={`${STORIES_PATH}/:storyId`}
                  element={<StoriesSingle />}
                />

                <Route path='development' element={<Development />} />

                <Route
                  path={EXPLORATION_PATH}
                  element={<ExplorationAndAnalysis />}
                />

                {process.env.NODE_ENV !== 'production' && (
                  <Route path='/sandbox/*' element={<Sandbox />} />
                )}

                {/* Legacy: Routes related to renaming /discoveries to /stories. */}
                {discoveryRoutes}

                {userPages.map((p) => (
                  <Route
                    key={p}
                    path={p}
                    element={<UserPagesComponent id={p} />}
                  />
                ))}

                <Route path='*' element={<UhOh />} />
              </Route>
            </Routes>
          </Suspense>
        </Composer>
      </DevseedUiThemeProvider>
    </BrowserRouter>
  );
}

const container = document.getElementById('app-container')!;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Root />);

/**
 * Composes components to to avoid deep nesting trees. Useful for contexts.
 *
 * @param {node} children Component children
 * @param {array} components The components to compose.
 */
function Composer(props) {
  const { children, components } = props;
  /* eslint-disable-next-line fp/no-mutating-methods */
  const itemToCompose = [...components].reverse();

  return itemToCompose.reduce(
    (acc, Component) => <Component>{acc}</Component>,
    children
  );
}

Composer.propTypes = {
  components: T.array,
  children: T.node
};

// Adding .last property to array
/* eslint-disable-next-line fp/no-mutating-methods */
Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  configurable: true,
  get: function () {
    return this[this.length - 1];
  },
  set: undefined
});
