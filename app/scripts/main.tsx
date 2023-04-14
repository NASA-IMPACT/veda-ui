import React, { lazy, Suspense, useEffect } from 'react';
import { render } from 'react-dom';
import T from 'prop-types';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DevseedUiThemeProvider as DsTp } from '@devseed-ui/theme-provider';

import { thematicRoutes } from './thematic-redirect';

import theme, { GlobalStyles } from '$styles/theme';
import { getAppURL } from '$utils/history';
import LayoutRoot, {
  LayoutRootContextProvider
} from '$components/common/layout-root';
import { useScrollbarWidthAsCssVar } from '$utils/use-scrollbar-width-css';

// Page loading
import { PageLoading } from '$components/common/loading-skeleton';

// Views
import UhOh from '$components/uhoh';
import ErrorBoundary from '$components/uhoh/fatal-error';
const Home = lazy(() => import('$components/home'));
const About = lazy(() => import('$components/about'));
const Development = lazy(() => import('$components/development'));

const DiscoveriesHub = lazy(() => import('$components/discoveries/hub'));
const DiscoveriesSingle = lazy(() => import('$components/discoveries/single'));

const DataCatalog = lazy(() => import('$components/data-catalog'));
const DatasetsExplore = lazy(() => import('$components/datasets/s-explore'));
const DatasetsOverview = lazy(() => import('$components/datasets/s-overview'));

const Analysis = lazy(() => import('$components/analysis/define'));
const AnalysisResults = lazy(() => import('$components/analysis/results'));

const Sandbox = lazy(() => import('$components/sandbox'));

// Handle wrong types from devseed-ui.
const DevseedUiThemeProvider = DsTp as any;

// Contexts
import { ReactQueryProvider } from '$context/react-query';
import {
  ABOUT_PATH,
  ANALYSIS_PATH,
  ANALYSIS_RESULTS_PATH,
  DATASETS_PATH,
  DISCOVERIES_PATH
} from '$utils/routes';

const composingComponents = [
  // Add contexts here.
  ErrorBoundary,
  ReactQueryProvider,
  LayoutRootContextProvider
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
                <Route
                  path={`${DATASETS_PATH}/:datasetId/explore`}
                  element={<DatasetsExplore />}
                />
                <Route path={DISCOVERIES_PATH} element={<DiscoveriesHub />} />
                <Route
                  path={`${DISCOVERIES_PATH}/:discoveryId`}
                  element={<DiscoveriesSingle />}
                />
                <Route path={ANALYSIS_PATH} element={<Analysis />} />
                <Route
                  path={ANALYSIS_RESULTS_PATH}
                  element={<AnalysisResults />}
                />
                <Route path='development' element={<Development />} />

                {process.env.NODE_ENV !== 'production' && (
                  <Route path='/sandbox/*' element={<Sandbox />} />
                )}

                {/* Legacy: Routes related to thematic areas redirect. */}
                {thematicRoutes}

                <Route path='*' element={<UhOh />} />
              </Route>
            </Routes>
          </Suspense>
        </Composer>
      </DevseedUiThemeProvider>
    </BrowserRouter>
  );
}

render(<Root />, document.getElementById('app-container'));

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
