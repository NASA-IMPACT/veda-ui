import { createGlobalStyle } from 'styled-components';
import { createUITheme, media, themeVal } from '@devseed-ui/theme-provider';
import { defaultsDeep } from 'lodash';
import { theme } from 'veda';

import { reactTippyStyles } from '$components/common/tip';

export const VEDA_OVERRIDE_THEME = {
  zIndices: {
    hide: -1,
    docked: 10,
    sticky: 900,
    dropdown: 1550,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },
  color: {
    base: '#2c3e50',
    primary: '#2276ac',
    danger: '#FC3D21',
    infographicA: '#83868A', // Min
    infographicB: '#6138BE', // Ave
    infographicC: '#83868A', // Max
    infographicD: '#F2F2F2', // STD
    infographicE: '#3094E3', // Median
    infographicF: '#1D5C5D' // Sum
  },
  type: {
    base: {
      family: '"Public Sans",sans-serif',
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
};

export default function themeOverrides() {
  if (theme) {
    return createUITheme(defaultsDeep({}, theme, VEDA_OVERRIDE_THEME));
  } else {
    return createUITheme(VEDA_OVERRIDE_THEME);
  }
}

/**
 * Print values for all variables across media queries.
 */
export const GlobalStyles = createGlobalStyle`
  /* stylelint-disable-next-line selector-type-no-unknown */
  ${reactTippyStyles()}

  .tether-element.tether-element {
    z-index: ${themeVal('zIndices.dropdown')};
  }

  :root {
    --base-space-multiplier: ${themeVal('layout.glspMultiplier.xsmall')};
    --base-font-family: ${themeVal('type.base.family')};
    --veda-color-primary: ${themeVal('color.primary')};
    --veda-color-secondary: ${themeVal('color.secondary')};
    --veda-color-link: ${themeVal('color.link')};
    --veda-color-base: ${themeVal('color.base')};
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
