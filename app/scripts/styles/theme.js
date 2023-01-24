import { createUITheme, media, themeVal } from '@devseed-ui/theme-provider';
import { createGlobalStyle } from 'styled-components';
import { reactTippyStyles } from '$components/common/tip';

export default function themeOverrides() {
  return createUITheme({
    color: {
      base: '#2c3e50',
      primary: '#2276ac',
      infographicA: '#fcab10',
      infographicB: '#f4442e',
      infographicC: '#b62b6e',
      infographicD: '#2ca58d'
    },
    type: {
      base: {
        leadSize: '1.25rem',
        extrabold: '800',
        // Increments to the type.base.size for each media breakpoint.
        sizeIncrement: {
          small: '0rem',
          medium: '0rem',
          large: '0.25rem',
          xlarge: '0.25rem'
        }
      },
      heading: {
        settings: '"wdth" 100, "wght" 700'
      }
    },
    layout: {
      min: '384px',
      max: '1440px',
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
  /* stylelint-disable-next-line selector-type-no-unknown */
  ${reactTippyStyles()}

  .tether-element.tether-element {
    z-index: 700;
  }

  :root {
    --base-space-multiplier: ${themeVal('layout.glspMultiplier.xsmall')};
  }

  ${media.smallUp`
    :root {
      --base-text-increment: ${themeVal('type.base.sizeIncrement.small')};
      --base-space-multiplier: ${themeVal('layout.glspMultiplier.small')};
    }
  `}

  ${media.mediumUp`
    :root {
      --base-text-increment: ${themeVal('type.base.sizeIncrement.medium')};
      --base-space-multiplier: ${themeVal('layout.glspMultiplier.medium')};
    }
  `}

  ${media.largeUp`
    :root {
      --base-text-increment: ${themeVal('type.base.sizeIncrement.large')};
      --base-space-multiplier: ${themeVal('layout.glspMultiplier.large')};
    }
  `}

  ${media.xlargeUp`
    :root {
      --base-text-increment: ${themeVal('type.base.sizeIncrement.xlarge')};
      --base-space-multiplier: ${themeVal('layout.glspMultiplier.xlarge')};
    }
  `}
`;
