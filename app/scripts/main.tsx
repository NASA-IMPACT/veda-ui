import React, { lazy, Suspense, useEffect } from 'react';
import { render } from 'react-dom';
import T from 'prop-types';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams
} from 'react-router-dom';
import { DevseedUiThemeProvider as DsTp } from '@devseed-ui/theme-provider';
import vedaThematics from 'veda/thematics';

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
const RootHome = lazy(() => import('$components/root-home'));
const RootAbout = lazy(() => import('$components/root-about'));
const RootDevelopment = lazy(() => import('$components/root-development'));
const RootDiscoveries = lazy(() => import('$components/root-discoveries'));
const DataCatalog = lazy(() => import('$components/data-catalog'));

const Home = lazy(() => import('$components/home'));
// const DiscoveriesHub = lazy(() => import('$components/discoveries/hub'));
const DiscoveriesSingle = lazy(() => import('$components/discoveries/single'));

// const DatasetsHub = lazy(() => import('$components/datasets/hub'));
const DatasetsExplore = lazy(() => import('$components/datasets/s-explore'));
const DatasetsOverview = lazy(() => import('$components/datasets/s-overview'));

const Analysis = lazy(() => import('$components/analysis/define'));
const AnalysisResults = lazy(() => import('$components/analysis/results'));

const Sandbox = lazy(() => import('$components/sandbox'));

// Handle wrong types from devseed-ui.
const DevseedUiThemeProvider = DsTp as any;

// Contexts
import { ReactQueryProvider } from '$context/react-query';

const composingComponents = [
  // Add contexts here.
  ErrorBoundary,
  ReactQueryProvider,
  LayoutRootContextProvider
];

const hasSeveralThematicAreas = vedaThematics.length > 1;

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function ThematicAboutRedirect() {
  const params = useParams();
  return hasSeveralThematicAreas ? (
    <Navigate replace to={`/${params.thematicId}`} />
  ) : (
    <RootAbout />
  );
}

function ThematicDiscoveryRedirect() {
  const discoveryId = useParams().discoveryId;
  return <Navigate replace to={`/discoveries/${discoveryId}`} />;
}

function ThematicDatasetRedirect({ explore = false }: { explore?: boolean }) {
  const datasetId = useParams().datasetId;
  let url = `/data-catalog/${datasetId}`;
  if (explore) {
    url += '/explore';
  }
  return <Navigate replace to={url} />;
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
                {hasSeveralThematicAreas && (
                  <>
                    <Route index element={<RootHome />} />
                    <Route path='about' element={<RootAbout />} />
                    <Route path='data-catalog' element={<DataCatalog />} />
                    <Route path='discoveries' element={<RootDiscoveries />} />
                    <Route path='analysis' element={<Analysis />} />
                    <Route
                      path='analysis/results'
                      element={<AnalysisResults />}
                    />
                    <Route path='development' element={<RootDevelopment />} />
                  </>
                )}

                {process.env.NODE_ENV !== 'production' && (
                  <Route path='/sandbox/*' element={<Sandbox />} />
                )}

                <Route
                  path='/discoveries/:discoveryId'
                  element={<DiscoveriesSingle />}
                />
                <Route
                  path='/data-catalog/:datasetId'
                  element={<DatasetsOverview />}
                />
                <Route
                  path='/data-catalog/:datasetId/explore'
                  element={<DatasetsExplore />}
                />

                {/* The following routes are redirect from the legacy thematic areas structure */}
                <Route path={hasSeveralThematicAreas ? ':thematicId' : '/'}>
                  {/* TODO : Redirect to discoveries with filters preset to thematic? */}
                  {/* TODO : Enable redirection when we want to get rid of thematic area index pages */}
                  {/* <Route index element={<Navigate replace to='/' />} /> */}
                  <Route index element={<Home />} />

                  {/* TODO : Redirect to discoveries with filters preset to thematic? */}
                  <Route
                    path='discoveries'
                    element={<Navigate replace to='/discoveries' />}
                  />
                  <Route
                    path='discoveries/:discoveryId'
                    element={<ThematicDiscoveryRedirect />}
                  />

                  {/* TODO : Redirect to data-catalog with filters preset to thematic? */}
                  <Route
                    path='datasets'
                    element={<Navigate replace to='/data-catalog' />}
                  />
                  <Route
                    path='datasets/:datasetId'
                    element={<ThematicDatasetRedirect />}
                  />
                  <Route
                    path='datasets/:datasetId/explore'
                    element={<ThematicDatasetRedirect explore />}
                  />
                  <Route
                    path='analysis'
                    element={<Navigate replace to='/analysis' />}
                  />
                  <Route
                    path='analysis/results'
                    element={<Navigate replace to='/analysis/results' />}
                  />
                  <Route path='about' element={<ThematicAboutRedirect />} />
                </Route>

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
