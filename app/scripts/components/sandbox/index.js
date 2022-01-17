import React from 'react';
import styled from 'styled-components';

import { add, glsp, media, themeVal } from '@devseed-ui/theme-provider';

import App from '../common/app';
import Constrainer from '../../styles/constrainer';
import { PageMainContent } from '../../styles/page';
import {
  variableGlsp,
  variableBaseType,
  variableProseVSpace
} from '../../styles/variable-utils';
import {
  VarHeading,
  VarLead,
  VarProse
} from '../../styles/variable-components';

const IntroFold = styled.div`
  position: relative;
  padding: ${glsp(2, 0)};

  ${media.mediumUp`
    padding: ${glsp(3, 0)};
  `}

  ${media.largeUp`
    padding: ${glsp(4, 0)};
  `}
`;

const IntroFoldInner = styled(Constrainer)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${glsp(
    add(themeVal('layout.glspMultiplier.xsmall'), 1),
    themeVal('layout.glspMultiplier.xsmall')
  )};
  max-width: ${themeVal('layout.max')};
  margin: 0 auto;

  ${media.smallUp`
    gap: ${glsp(
      add(themeVal('layout.glspMultiplier.small'), 1),
      themeVal('layout.glspMultiplier.small')
    )};
  `}

  ${media.mediumUp`
    grid-template-columns: repeat(8, 1fr);
    gap: ${glsp(
      add(themeVal('layout.glspMultiplier.medium'), 1),
      themeVal('layout.glspMultiplier.medium')
    )};
  `}

  ${media.largeUp`
    grid-template-columns: repeat(12, 1fr);
    gap: ${glsp(
      add(themeVal('layout.glspMultiplier.large'), 1),
      themeVal('layout.glspMultiplier.large')
    )};
  `}

  ${media.xlargeUp`
    gap: ${glsp(
      add(themeVal('layout.glspMultiplier.xlarge'), 1),
      themeVal('layout.glspMultiplier.xlarge')
    )};
  `}

  > * {
    grid-column: 1 / -1;
  }
`;

const IntroFoldCopy = styled.div`
  grid-column: 1 / span 8;
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
`;

const Wrapper = styled.div`
  font-size: ${variableBaseType('1rem')};

  > * {
    margin-bottom: ${variableProseVSpace()};
  }
`;

const ResponsiveList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${variableGlsp()};

  li {
    grid-column: auto / span 3;
    background: ${themeVal('color.primary')};
    padding: ${variableGlsp(0.5, 1)};
  }

  div {
    background: #fff;
  }
`;

function Sandbox() {
  return (
    <App pageTitle='Welcome'>
      <PageMainContent>
        <IntroFold>
          <IntroFoldInner>
            <IntroFoldCopy>
              <VarProse>
                <h1>Headline</h1>
                <VarLead>
                  Donec id rutrum elit, vel accumsan urna. Ut tincidunt cursus
                  nulla, sit amet aliquet felis. Aliquam consectetur non lacus
                  malesuada dignissim.
                </VarLead>
                <p>
                  Nulla fermentum odio eget lacus condimentum, sed volutpat
                  tortor pellentesque. Nulla placerat scelerisque lorem at
                  pharetra.
                </p>
                <dl>
                  <dt>Phasellus</dt>
                  <dd>Ex viverra eros cursus</dd>
                  <dt>Pellentesque non nec lorem</dt>
                  <dd>Nunc tempus, mi eu suscipit</dd>
                  <dt>pellentesque, elit leo finibus</dt>
                  <dd>Lorem ipsum dolor</dd>
                </dl>
                <p>
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos. Etiam risus tortor, dapibus
                  sed porttitor eu, pharetra eu eros. Donec id rutrum elit, vel
                  accumsan urna. Ut tincidunt cursus nulla, sit amet aliquet
                  felis. Aliquam consectetur non lacus malesuada dignissim.
                </p>
                <figure>
                  <img
                    src='https://source.unsplash.com/random/1000x400'
                    alt='Placeholder'
                  />
                  <figcaption>An image from Unsplash</figcaption>
                </figure>
              </VarProse>

              <ResponsiveList>
                <li>
                  <div>Box</div>
                </li>
                <li>
                  <div>Box2</div>
                </li>
                <li>
                  <div>Box3</div>
                </li>
                <li>
                  <div>Box4</div>
                </li>
              </ResponsiveList>

              <VarHeading size='xxsmall'>Heading xxsmall</VarHeading>
              <Wrapper>
                <p>
                  Etiam risus tortor, dapibus sed porttitor eu, pharetra eu
                  eros.
                </p>
                <p>
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos. Etiam risus tortor, dapibus
                  sed porttitor eu, pharetra eu eros. Donec id rutrum elit, vel
                  accumsan urna. Ut tincidunt cursus nulla, sit amet aliquet
                  felis. Aliquam consectetur non lacus malesuada dignissim.
                </p>
              </Wrapper>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <VarHeading size='xsmall'>Heading xsmall</VarHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <VarHeading size='small'>Heading small</VarHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <VarHeading size='medium'>Heading medium</VarHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <VarHeading size='large'>Heading large</VarHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <VarHeading size='xlarge'>Heading xlarge</VarHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <VarHeading size='xxlarge'>Heading xxlarge</VarHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <VarHeading size='jumbo'>Heading jumbo</VarHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
            </IntroFoldCopy>
          </IntroFoldInner>
        </IntroFold>
      </PageMainContent>
    </App>
  );
}

export default Sandbox;
