import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { add, glsp, media, themeVal } from '@devseed-ui/theme-provider';
import { Prose } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';

import App from '../common/app';
import Constrainer from '../../styles/constrainer';
import { PageMainContent } from '../../styles/page';

import deltaThematics, {
  thematics,
  datasets,
  discoveries
} from 'delta/thematics';

export const IntroFold = styled.div`
  position: relative;
  padding: ${glsp(2, 0)};

  ${media.mediumUp`
    padding: ${glsp(3, 0)};
  `}

  ${media.largeUp`
    padding: ${glsp(4, 0)};
  `}
`;

export const IntroFoldInner = styled(Constrainer)`
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

export const IntroFoldCopy = styled.div`
  grid-column: 1 / span 8;
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
`;

export const IntroFoldActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${glsp(0.75)};
  align-items: center;
`;

function Home() {
  return (
    <App pageTitle='Welcome'>
      <PageMainContent>
        <IntroFold>
          <IntroFoldInner>
            <IntroFoldCopy>
              <Prose>
                <h1>Welcome</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  gravida sem quis ultrices vulputate. Ut eu pretium eros, eu
                  molestie augue. Etiam risus justo, consectetur at erat vel,
                  fringilla commodo felis. Suspendisse rutrum tortor ac nulla
                  volutpat lobortis. Phasellus tempus nunc risus, eu mollis erat
                  ullamcorper a.
                </p>
              </Prose>
              <IntroFoldActions>
                <Button
                  forwardedAs={Link}
                  to='/'
                  size='large'
                  variation='primary-outline'
                >
                  Explore the data
                </Button>
                <span>or</span>
                <Button
                  forwardedAs={Link}
                  to='/'
                  size='large'
                  variation='primary-fill'
                >
                  Learn more
                </Button>
              </IntroFoldActions>
              <Thematics />
            </IntroFoldCopy>
          </IntroFoldInner>
        </IntroFold>
      </PageMainContent>
    </App>
  );
}

export default Home;

function Thematics() {
  const [aboutMdx, setAboutMdx] = useState();

  const load = async (page) => {
    const r = await page();
    setAboutMdx(r);
  };

  return (
    <div>
      <ul>
        {deltaThematics.map((t) => (
          <li key={t.id}>
            <Button
              variation='primary-fill'
              onClick={() => load(thematics[t.id].content)}
            >
              {t.name}
            </Button>
            <ul>
              {t.discoveries.map((d) => (
                <li key={d.id}>
                  <Button
                    variation='primary-fill'
                    onClick={() => load(discoveries[d.id].content)}
                  >
                    discovery: {d.name}
                  </Button>
                </li>
              ))}
            </ul>
            <ul>
              {t.datasets.map((d) => (
                <li key={d.id}>
                  <Button
                    variation='primary-fill'
                    onClick={() => load(datasets[d.id].content)}
                  >
                    datasets: {d.name}
                  </Button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div>{aboutMdx ? <aboutMdx.default /> : null}</div>
    </div>
  );
}
