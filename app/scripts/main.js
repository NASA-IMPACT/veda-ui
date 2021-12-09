import React, { lazy, Suspense, useEffect } from 'react';
import { render } from 'react-dom';
import T from 'prop-types';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';

import theme from './styles/theme';
import history from './utils/history';

// Views
import UhOh from './components/uhoh';
import ErrorBoundary from './components/uhoh/fatal-error';
const Home = lazy(() => import('./components/home'));
const DatasetOverview = lazy(
  () => import('./components/datasets/single/overview')
);

// Contexts

const composingComponents = [
  // Add contexts here.
  ErrorBoundary
];

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
      <Composer components={composingComponents}>
        <DevseedUiThemeProvider theme={theme}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/dataset-overview' element={<DatasetOverview />} />
              <Route path='*' element={<UhOh />} />
            </Routes>
          </Suspense>
        </DevseedUiThemeProvider>
      </Composer>
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
