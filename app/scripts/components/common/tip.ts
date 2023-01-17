import Typpy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

// Re-export.
// Keeping everything tippy related in a single file
export const Tip = Typpy;

// Wrap in body to increase specificity.
export const reactTippyStyles = () => css`
  body {
    [data-tippy-root] {
      z-index: 800 !important;
    }

    .tippy-box {
      background-color: ${themeVal('color.base')};
      border-radius: ${themeVal('shape.rounded')};
    }

    .tippy-arrow {
      color: ${themeVal('color.base')};
    }

    .tippy-content {
      padding: ${glsp(0.25, 0.5)};
    }
  }
`;
