import React from 'react';
import { render } from '@testing-library/react';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';

import theme from '$styles/theme';

export function renderWithTheme(tree, t = theme, options = {}) {
  /* eslint-disable-next-line react/prop-types */
  const WrappingThemeProvider = ({ children }) => (
    <DevseedUiThemeProvider theme={t}>{children}</DevseedUiThemeProvider>
  );

  return render(tree, { wrapper: WrappingThemeProvider, ...options });
}

export default renderWithTheme;
