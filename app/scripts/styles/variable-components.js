import styled, { css } from 'styled-components';
import { themeVal, media } from '@devseed-ui/theme-provider';
import { Heading, Lead, Prose } from '@devseed-ui/typography';

import { variableBaseType, variableProseVSpace } from './variable-utils';

//
// Heading
//

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
    font-size: calc(${sizeMapping[size]} + var(--base-text-increment, 0rem));
    ${size === 'xxsmall' && 'line-height: 1rem;'}
  `;
};

export const VarHeading = styled(Heading)`
  /* Size */
  ${renderHeadingSize}
`;

//
// Lead
//

export const VarLead = styled(Lead)`
  font-size: ${variableBaseType(themeVal('type.base.leadSize'))};
`;

//
// Prose
//

export const VarProse = styled(Prose)`
  font-size: ${variableBaseType(themeVal('type.base.size'))};

  h1 {
    ${renderHeadingSize({ size: 'xxlarge' })}
  }

  h2 {
    ${renderHeadingSize({ size: 'xlarge' })}
  }

  h3 {
    ${renderHeadingSize({ size: 'large' })}
  }

  h4 {
    ${renderHeadingSize({ size: 'medium' })}
  }

  h5 {
    ${renderHeadingSize({ size: 'small' })}
  }

  h6 {
    ${renderHeadingSize({ size: 'xsmall' })}
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: calc(${variableProseVSpace()} / 2);

    &:not(:first-child) {
      margin-top: calc(${variableProseVSpace()} * 2);
    }
  }

  > * {
    margin-bottom: ${variableProseVSpace()};
  }

  > *:last-child {
    margin-bottom: 0;
  }

  /* avoid long a tags breaking small screen layout */
  ${media.mediumDown`
    a {
      word-break: break-all;
    }
  `}
`;
