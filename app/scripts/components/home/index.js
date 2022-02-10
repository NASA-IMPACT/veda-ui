import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { add, glsp, media, themeVal } from '@devseed-ui/theme-provider';
import { Prose } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';

import { LayoutProps } from '../common/layout-root';
import Constrainer from '../../styles/constrainer';
import { PageMainContent } from '../../styles/page';

import { resourceNotFound } from '../uhoh';
import { useThematicArea } from '../../utils/thematics';

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
  const thematic = useThematicArea();
  if (!thematic) return resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title={thematic.data.name} />
      <IntroFold>
        <IntroFoldInner>
          <IntroFoldCopy>
            <Prose>
              <h1>Thematic area: {thematic.data.name}</h1>
              <p>{thematic.data.description}</p>
            </Prose>
            <IntroFoldActions>
              <Button
                forwardedAs={Link}
                to='discoveries'
                size='large'
                variation='primary-outline'
              >
                Discoveries
              </Button>
              <span>or</span>
              <Button
                forwardedAs={Link}
                to='datasets'
                size='large'
                variation='primary-outline'
              >
                Datasets
              </Button>
              <span>or</span>
              <Button
                forwardedAs={Link}
                to='about'
                size='large'
                variation='primary-fill'
              >
                Learn more
              </Button>
            </IntroFoldActions>
          </IntroFoldCopy>
        </IntroFoldInner>
      </IntroFold>
    </PageMainContent>
  );
}

export default Home;
