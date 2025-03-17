import { css, createGlobalStyle } from 'styled-components';
import { themeVal, media } from '@devseed-ui/theme-provider';
import { reactTippyStyles } from '$components/common/tip';
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

export const legacyGlobalStyleCSSBlock = css`
  font-family: ${themeVal('type.base.family')};
  line-height: calc(0.5rem + 1em);
`;
