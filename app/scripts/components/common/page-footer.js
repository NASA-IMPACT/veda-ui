import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { glsp, themeVal, visuallyHidden } from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { Button } from '@devseed-ui/button';
import {
  CollecticonBrandGithub,
  CollecticonEnvelope
} from '@devseed-ui/collecticons';
import { media } from '$utils/devseed-ui';
import { createSubtitleStyles } from '@devseed-ui/typography';

import { variableGlsp } from '../../styles/variable-utils';

const PageFooterSelf = styled.footer`
  padding: ${variableGlsp(0.75, 1)};
  background: ${themeVal('color.base-50')};
  animation: ${reveal} 0.32s ease 0s 1;
  display: flex;
  flex-flow: column nowrap;

  ${({ isHidden }) => isHidden && visuallyHidden()}

  ${media.smallUp`
    flex-flow: row nowrap;
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

const InfoList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  gap: ${glsp(0, 1)};
  align-items: start;
  margin-bottom: ${variableGlsp()};

  ${media.smallUp`
    gap: ${glsp(0, 2)};
    margin: 0 0 0 auto;
    order: 2;
  `}

  ${media.mediumUp`
    grid-template-columns: repeat(4, auto);
    grid-auto-flow: auto;
    grid-gap: ${variableGlsp(0, 0.5)};
    align-items: center;
  `}

  dt {
    ${createSubtitleStyles()}
    text-transform: uppercase;
    font-size: 0.75rem;
    line-height: 1rem;
    grid-row: 1;

    ${media.mediumUp`
      margin-left: ${variableGlsp()};
    `}
  }

  dd {
    grid-row: 2;

    ${media.mediumUp`
      grid-row: 1;
    `}
  }
`;

function PageFooter(props) {
  const nowDate = new Date();

  return (
    <PageFooterSelf isHidden={props.isHidden}>
      <InfoList>
        <dt>NASA official</dt>
        <dd>
          <a href='mailto:manil.maskey@nasa.gov'>
            <CollecticonEnvelope title='Get in touch' meaningful />
            &nbsp;Manil Maskey
          </a>
        </dd>
        <dt>Open source code</dt>
        <dd>
          <a href='https://github.com/NASA-IMPACT/delta-config'>
            <CollecticonBrandGithub title='Explore the code' meaningful />
            &nbsp;GitHub
          </a>
        </dd>
      </InfoList>
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
