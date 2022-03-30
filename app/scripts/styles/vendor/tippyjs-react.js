import { css } from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

// Wrap in body to increase specificity.
export default () => css`
  body {
    .tippy-box {
      background-color: ${themeVal('color.base')};
      border-radius: ${themeVal('shape.rounded')};
    }

    .tippy-arrow {
      color: ${themeVal('color.base')};
    }
  }
`;
