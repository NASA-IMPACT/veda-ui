import { createUITheme, media, themeVal } from '@devseed-ui/theme-provider';
import { createGlobalStyle } from 'styled-components';

export default function themeOverrides() {
  return createUITheme({
    color: {
      base: '#2c3e50',
      primary: '#2276ac'
    },
    type: {
      base: {
        extrabold: '800',
        sizeMultiplier: {
          xsmall: 1,
          small: 1,
          medium: 1.25,
          large: 1.25,
          xlarge: 1.5
        }
      }
    },
    layout: {
      glspMultiplier: {
        xsmall: 1,
        small: 1,
        medium: 1.5,
        large: 2,
        xlarge: 2
      }
    }
  });
}

/**
 * Print values for all variables across media queries.
 */
export const GlobalStyles = createGlobalStyle`
  :root {
    --base-text-multiplier: ${themeVal('type.base.sizeMultiplier.xsmall')};
    --base-space-multiplier: ${themeVal('layout.glspMultiplier.xsmall')};
  }

  ${media.smallUp`
    :root {
      --base-text-multiplier: ${themeVal('type.base.sizeMultiplier.small')};
      --base-space-multiplier: ${themeVal('layout.glspMultiplier.small')};
    }
  `}

  ${media.mediumUp`
    :root {
      --base-text-multiplier: ${themeVal('type.base.sizeMultiplier.medium')};
      --base-space-multiplier: ${themeVal('layout.glspMultiplier.medium')};
    }
  `}

  ${media.largeUp`
    :root {
      --base-text-multiplier: ${themeVal('type.base.sizeMultiplier.large')};
      --base-space-multiplier: ${themeVal('layout.glspMultiplier.large')};
    }
  `}

  ${media.xlargeUp`
    :root {
      --base-text-multiplier: ${themeVal('type.base.sizeMultiplier.xlarge')};
      --base-space-multiplier: ${themeVal('layout.glspMultiplier.xlarge')};
    }
  `}
`;
