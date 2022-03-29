import React, { lazy, Suspense, useEffect } from 'react';
import { render } from 'react-dom';
import T from 'prop-types';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import deltaThematics from 'delta/thematics';

import theme, { GlobalStyles } from '$styles/theme';
import history from '$utils/history';
import LayoutRoot, {
  LayoutRootContextProvider
} from '$components/common/layout-root';

// Views
import UhOh from '$components/uhoh';
import ErrorBoundary from '$components/uhoh/fatal-error';
const RootHome = lazy(() => import('$components/root-home'));
const RootAbout = lazy(() => import('$components/root-about'));

const Home = lazy(() => import('$components/home'));
const About = lazy(() => import('$components/about'));
const DiscoveriesHub = lazy(() => import('$components/discoveries/hub'));
const DiscoveriesSingle = lazy(() => import('$components/discoveries/single'));

const DatasetsHub = lazy(() => import('$components/datasets/hub'));
const DatasetsExplore = lazy(() => import('$components/datasets/s-explore'));
const DatasetsUsage = lazy(() => import('$components/datasets/s-usage'));
const DatasetsOverview = lazy(() => import('$components/datasets/s-overview'));

const Sandbox = lazy(() => import('$components/sandbox'));

// Contexts
import { LayerDataProvider } from './context/layer-data';

const composingComponents = [
  // Add contexts here.
  ErrorBoundary,
  LayoutRootContextProvider,
  LayerDataProvider
];

const hasSeveralThematicAreas = deltaThematics.length > 1;

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

// Root component.
function Root() {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      window.innerWidth - document.documentElement.clientWidth + 'px'
    );
  }, []);

  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner?.classList.add('dismissed');
    setTimeout(() => banner?.remove(), 500);
  }, []);

  return (
    <BrowserRouter history={history}>
      <ScrollTop />
      <DevseedUiThemeProvider theme={theme}>
        <GlobalStyles />
        <Composer components={composingComponents}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path='/' element={<LayoutRoot />}>
                {hasSeveralThematicAreas && (
                  <>
                    <Route index element={<RootHome />} />
                    <Route path='about' element={<RootAbout />} />
                  </>
                )}

                {process.env.NODE_ENV !== 'production' && (
                  <Route path='/sandbox/*' element={<Sandbox />} />
                )}

                <Route path={hasSeveralThematicAreas ? ':thematicId' : '/'}>
                  <Route index element={<Home />} />
                  <Route path='about' element={<About />} />
                  <Route path='discoveries' element={<DiscoveriesHub />} />{' '}
                  <Route
                    path='discoveries/:discoveryId'
                    element={<DiscoveriesSingle />}
                  />
                  <Route path='datasets' element={<DatasetsHub />} />
                  <Route
                    path='datasets/:datasetId'
                    element={<DatasetsOverview />}
                  />
                  <Route
                    path='datasets/:datasetId/usage'
                    element={<DatasetsUsage />}
                  />
                  <Route
                    path='datasets/:datasetId/explore'
                    element={<DatasetsExplore />}
                  />
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

Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  configurable: true,
  get: function () {
    return this[this.length - 1];
  },
  set: undefined
});
