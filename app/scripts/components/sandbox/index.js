import React from 'react';
import styled from 'styled-components';

import { add, glsp, media, themeVal } from '@devseed-ui/theme-provider';

import App from '../common/app';
import Constrainer from '../../styles/constrainer';
import { PageMainContent } from '../../styles/page';
import { MyHeading, MyLead, MyProse } from '../../styles/theme';

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
    add(themeVal('layout.gap.xsmall'), 1),
    themeVal('layout.gap.xsmall')
  )};
  max-width: ${themeVal('layout.max')};
  margin: 0 auto;

  ${media.smallUp`
    gap: ${glsp(
      add(themeVal('layout.gap.small'), 1),
      themeVal('layout.gap.small')
    )};
  `}

  ${media.mediumUp`
    grid-template-columns: repeat(8, 1fr);
    gap: ${glsp(
      add(themeVal('layout.gap.medium'), 1),
      themeVal('layout.gap.medium')
    )};
  `}

  ${media.largeUp`
    grid-template-columns: repeat(12, 1fr);
    gap: ${glsp(
      add(themeVal('layout.gap.large'), 1),
      themeVal('layout.gap.large')
    )};
  `}

  ${media.xlargeUp`
    gap: ${glsp(
      add(themeVal('layout.gap.xlarge'), 1),
      themeVal('layout.gap.xlarge')
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

function Sandbox() {
  return (
    <App pageTitle='Welcome'>
      <PageMainContent>
        <IntroFold>
          <IntroFoldInner>
            <IntroFoldCopy>
              <MyProse>
                <h1>Headline</h1>
                <MyLead>
                  Donec id rutrum elit, vel accumsan urna. Ut tincidunt cursus
                  nulla, sit amet aliquet felis. Aliquam consectetur non lacus
                  malesuada dignissim.
                </MyLead>
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
              </MyProse>

              <MyHeading size='xxsmall'>Heading xxsmall</MyHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <MyHeading size='xsmall'>Heading xsmall</MyHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <MyHeading size='small'>Heading small</MyHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <MyHeading size='medium'>Heading medium</MyHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <MyHeading size='large'>Heading large</MyHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <MyHeading size='xlarge'>Heading xlarge</MyHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <MyHeading size='xxlarge'>Heading xxlarge</MyHeading>
              <p>
                Etiam risus tortor, dapibus sed porttitor eu, pharetra eu eros.
              </p>
              <MyHeading size='jumbo'>Heading jumbo</MyHeading>
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
