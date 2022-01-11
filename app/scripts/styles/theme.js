import { createUITheme, media, themeVal } from '@devseed-ui/theme-provider';
import { Heading, Lead, Prose } from '@devseed-ui/typography';
import styled, { createGlobalStyle, css } from 'styled-components';

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
      // },
      // heading: {
      //   sizeMultiplier: {
      //     xsmall: 1,
      //     small: 1,
      //     medium: 2,
      //     large: 2,
      //     xlarge: 2
      //   }
      }
    },
    layout: {
      // The gap is defined as a multiplier of the layout.space The elements
      // that use the gap should use it as a parameter for the glsp function
      gap: {
        xsmall: 1,
        small: 1,
        medium: 2,
        large: 2,
        xlarge: 2
      }
    }
  });
}

const responsiveType = (base, variable) =>
  css`calc(${base} * var(${variable}, 1));`;

const responsiveBaseType = (base) =>
  responsiveType(base, '--base-text-multiplier');

export const MyLead = styled(Lead)`
  font-size: ${responsiveBaseType(themeVal('type.base.leadSize'))};
`;

export const MyProse = styled(Prose)`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: calc(
      ${themeVal('layout.space')} * var(--base-text-multiplier, 1)
    );

    &:not(:first-child) {
      margin-top: calc(
        ${themeVal('layout.space')} * 1.5 * var(--base-text-multiplier, 1) * 2
      );
    }
  }

  > * {
    margin-bottom: calc(
      ${themeVal('layout.space')} * 1.5 * var(--base-text-multiplier, 1)
    );
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;

const sizeMapping = {
  xxsmall: '0.75rem',
  xsmall: '1rem',
  small: '1.25rem',
  medium: '1.5rem',
  large: '1.75rem',
  xlarge: '2rem',
  xxlarge: '2.25rem',
  jumbo: '3rem'
};

const renderHeadingSize = (props = {}) => {
  const { size = 'medium' } = props;

  return css`
    font-size: calc(${sizeMapping[size]} * var(--base-text-multiplier, 1));
    ${size === 'xxsmall' && 'line-height: 1rem;'}
  `;
};

export const MyHeading = styled(Heading)`
  /* Size */
  ${renderHeadingSize}
`;

export const GlobalStyles = createGlobalStyle`
  :root {
    --base-text-multiplier: ${themeVal('type.base.sizeMultiplier.xsmall')};
  }

  ${media.smallUp`
    :root {
      --base-text-multiplier: ${themeVal('type.base.sizeMultiplier.small')};
    }
  `}

  ${media.mediumUp`
    :root {
      --base-text-multiplier: ${themeVal('type.base.sizeMultiplier.medium')};
    }
  `}

  ${media.largeUp`
    :root {
      --base-text-multiplier: ${themeVal('type.base.sizeMultiplier.large')};
    }
  `}

  ${media.xlargeUp`
    :root {
      --base-text-multiplier: ${themeVal('type.base.sizeMultiplier.xlarge')};
    }
  `}

  body {
    font-size: calc(1rem * var(--base-text-multiplier, 1)) !important;
  }
`;
