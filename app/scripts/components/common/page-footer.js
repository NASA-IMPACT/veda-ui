import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import format from 'date-fns/format';

import {
  glsp,
  themeVal,
  visuallyHidden,
  media
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { Button } from '@devseed-ui/button';
import {
  CollecticonBrandGithub,
  CollecticonEnvelope
} from '@devseed-ui/collecticons';
import { createSubtitleStyles } from '@devseed-ui/typography';

import { variableGlsp } from '../../styles/variable-utils';
import { Tip } from '$components/common/tip';
import { ComponentOverride } from '$components/common/page-overrides';

import SmartLink from '$components/common/smart-link';

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

  a {
    &,
    &:visited {
      color: inherit;
    }
  }
`;

const FooterCredits = styled.address`
  font-size: 0.875rem;
  line-height: 1.5rem;
  font-style: normal;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;

  a span {
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
      <ComponentOverride
        with='pageFooter'
        appVersion={process.env.APP_VERSION}
        appUiVersion={process.env.APP_UI_VERSION}
        appBuildTime={process.env.APP_BUILD_TIME}
      >
        <InfoList>
          <dt>NASA official</dt>
          <dd>
            <Button
              forwardedAs='a'
              href='mailto:manil.maskey@nasa.gov'
              variation='base-text'
              size='small'
              fitting='skinny'
            >
              <CollecticonEnvelope title='Get in touch' meaningful />
              Manil Maskey
            </Button>
          </dd>
          <dt>Open source code</dt>
          <dd>
            <Button
              forwardedAs='a'
              href='https://github.com/NASA-IMPACT/veda-config'
              variation='base-text'
              size='small'
              fitting='skinny'
              target='_blank'
              rel='noopener noreferrer'
            >
              <CollecticonBrandGithub title='Explore the code' meaningful />
              GitHub
            </Button>
          </dd>
        </InfoList>
        <FooterCredits>
          <p>
            <SmartLink to='https://earthdata.nasa.gov/'>
              <span>By</span> NASA <strong>Earthdata</strong> <span>on</span>{' '}
              <time dateTime={nowDate.getFullYear()}>
                {nowDate.getFullYear()}
              </time>
            </SmartLink>
            {' • '}
            <Tip
              content={`Released on ${format(
                new Date(+process.env.APP_BUILD_TIME),
                'PPPP'
              )} (veda-ui v${process.env.APP_VERSION}))`}
            >
              <span>v{process.env.APP_VERSION}</span>
            </Tip>
          </p>
        </FooterCredits>
      </ComponentOverride>
    </PageFooterSelf>
  );
}

export default PageFooter;

PageFooter.propTypes = {
  isHidden: T.bool
};
