import React from 'react';
import styled, { css } from 'styled-components';

import {
  glsp,
  media,
  themeVal,
  rgba,
  visuallyHidden,
  divide
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

const innerSpacingCss = (size) => css`
  padding: ${glsp(
    divide(themeVal(`layout.gap.${size}`), 2),
    themeVal(`layout.gap.${size}`)
  )};
`;

const PageFooterSelf = styled.footer`
  ${innerSpacingCss('xsmall')}
  background-color: ${rgba(themeVal('color.surface'), 0.92)};
  animation: ${reveal} 0.32s ease 0s 1;

  ${media.smallUp`
    ${innerSpacingCss('xsmall')}
  `}

  ${media.mediumUp`
    ${innerSpacingCss('medium')}
  `}

  ${media.largeUp`
    ${innerSpacingCss('large')}
  `}

  ${media.xlargeUp`
    ${innerSpacingCss('xlarge')}
  `}
`;

const FooterCredits = styled.address`
  font-size: 0.875rem;
  line-height: 1.5rem;
  font-style: normal;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;

  span {
    ${visuallyHidden}
  }

  h3 {
    ${visuallyHidden}
  }

  small {
    font-size: inherit;
    display: block;
    opacity: 0.64;
  }

  a {
    &,
    &:visited {
      color: inherit;
    }
  }
`;

function PageFooter() {
  const nowDate = new Date();

  return (
    <PageFooterSelf>
      <FooterCredits>
        <p>
          <a href='https://earthdata.nasa.gov/' title='Visit NASA Earthdata'>
            <span>By</span>
            NASA <strong>Earthdata</strong>
            <span>on</span>{' '}
            <time dateTime={nowDate.getFullYear()}>
              {nowDate.getFullYear()}
            </time>
          </a>
        </p>
      </FooterCredits>
    </PageFooterSelf>
  );
}

export default PageFooter;
