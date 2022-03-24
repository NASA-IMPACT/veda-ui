import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { themeVal, visuallyHidden } from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

import { variableGlsp } from '../../styles/variable-utils';

const PageFooterSelf = styled.footer`
  padding: ${variableGlsp(0.75, 1)};
  background: ${themeVal('color.base-50')};
  animation: ${reveal} 0.32s ease 0s 1;

  ${({ isHidden }) => isHidden && visuallyHidden()}
`;

const FooterCredits = styled.address`
  font-size: 0.875rem;
  line-height: 1.5rem;
  font-style: normal;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;

  span {
    ${visuallyHidden()}
  }

  h3 {
    ${visuallyHidden()}
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

function PageFooter(props) {
  const nowDate = new Date();

  return (
    <PageFooterSelf isHidden={props.isHidden}>
      <FooterCredits>
        <p>
          <a href='https://earthdata.nasa.gov/'>
            <span>By</span> NASA <strong>Earthdata</strong> <span>on</span>{' '}
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

PageFooter.propTypes = {
  isHidden: T.bool
};
