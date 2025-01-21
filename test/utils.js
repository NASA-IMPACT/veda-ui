import React from 'react';
import { Link } from 'react-router-dom';
import { render } from '@testing-library/react';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';

import theme from '$styles/theme';
import { VedaUIProvider } from '$context/veda-ui-provider';

export function renderWithTheme(tree, t = theme, options = {}) {
  /* eslint-disable-next-line react/prop-types */
  const WrappingThemeProvider = ({ children }) => (
    <DevseedUiThemeProvider theme={t}>{children}</DevseedUiThemeProvider>
  );

  return render(tree, { wrapper: WrappingThemeProvider, ...options });
}

export function VedaUIConfigProvider({ children }) {
  return (
    <VedaUIProvider
      config={{
        envMapboxToken: '',
        envApiStacEndpoint: '',
        envApiRasterEndpoint: '',
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
  );
}

export default renderWithTheme;
