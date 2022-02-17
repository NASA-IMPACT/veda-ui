import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import { LayoutProps } from '$components/common/layout-root';
import { Fold } from '$components/common/fold';
import { PageLead, PageMainContent, PageMainTitle } from '$styles/page';

import { resourceNotFound } from '$components/uhoh';
import { useThematicArea } from '$utils/thematics';
import { GridIsFull, GridIsHalf, GridIsQuarter } from '$styles/grid';

const IntroFold = styled(Fold)`
  background: ${themeVal('color.base-50')};
`;

const IntroFoldCopy = styled.div`
  grid-column: 1 / span 8;
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
`;
const FeatureCard = styled.div`
  padding: ${glsp(1)};
  background: ${themeVal('color.base-50')};
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const IntroFoldActions = styled.div`
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
        <GridIsHalf num={1}>
          <img src='https://via.placeholder.com/350x150' />
        </GridIsHalf>
        <GridIsHalf num={2}>
          <PageMainTitle>
            Welcome to the {thematic.data.name} dashboard
          </PageMainTitle>
          <PageLead>{thematic.data.description}</PageLead>
          <IntroFoldActions>
            <Button
              forwardedAs={Link}
              to='about'
              size='large'
              variation='primary-fill'
            >
              Learn more
            </Button>
          </IntroFoldActions>
        </GridIsHalf>
      </IntroFold>
      <Fold>
        <GridIsFull>
          <h3> Featured discoveries</h3>
        </GridIsFull>
        <GridIsFull>
          <FeatureCard>
            <img src='https://via.placeholder.com/750x100' />
          </FeatureCard>
        </GridIsFull>
      </Fold>
      <Fold>
        <GridIsFull>
          <h3> Featured Datasets</h3>
        </GridIsFull>
        <GridIsHalf num={1}>
          <FeatureCard>
            <h4> Nitrogen Dioxide</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse facilisis sollicitudin magna, eget accumsan dolor
              molestie quis. Aliquam sit amet erat nec risus dapibus efficitur.
              Sed tristique ultrices libero eu pulvinar. Pellentesque ac auctor
              felis. Vestibulum varius mattis lectus, at dignissim nulla
              interdum.
            </p>
            <Button
              forwardedAs={Link}
              to='about'
              size='large'
              variation='primary-fill'
            >
              Learn more
            </Button>
          </FeatureCard>
        </GridIsHalf>
        <GridIsHalf num={2}>
          <FeatureCard>
            <h4> Get air quality data</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse facilisis sollicitudin magna, eget accumsan dolor
              molestie quis. Aliquam sit amet erat nec risus dapibus efficitur.
              Sed tristique ultrices libero eu pulvinar. Pellentesque ac auctor
              felis. Vestibulum varius mattis lectus, at dignissim nulla
              interdum.
            </p>
          </FeatureCard>
        </GridIsHalf>
      </Fold>
      <Fold>
        <GridIsFull>
          <h3> Other thematic areas</h3>
        </GridIsFull>
        <GridIsHalf num={1}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          facilisis sollicitudin magna, eget accumsan dolor molestie quis.
          Aliquam sit amet erat nec risus dapibus efficitur. Sed tristique
          ultrices libero eu pulvinar. Pellentesque ac auctor felis.
        </GridIsHalf>
        <GridIsQuarter num={1}>
          <FeatureCard> Area 1</FeatureCard>
        </GridIsQuarter>
        <GridIsQuarter num={2}>
          <FeatureCard> Area 2</FeatureCard>
        </GridIsQuarter>
        <GridIsQuarter num={3}>
          <FeatureCard> Area 3</FeatureCard>
        </GridIsQuarter>
        <GridIsQuarter num={4}>
          <FeatureCard> Area 4</FeatureCard>
        </GridIsQuarter>
      </Fold>
    </PageMainContent>
  );
}

export default Home;
