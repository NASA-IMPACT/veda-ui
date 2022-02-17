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
import Constrainer from '$styles/constrainer';
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
          <img src='https://via.placeholder.com/1050x350' />
        </GridIsFull>
      </Fold>
      <Fold>
        <GridIsFull>
          <h3> Featured Datasets</h3>
        </GridIsFull>
        <GridIsHalf num={1}> Nitrogen Dioxide </GridIsHalf>
        <GridIsHalf num={2}> Get Air Quality </GridIsHalf>
      </Fold>
      <Fold>
        <GridIsFull>
          <h3> Other thematic areas</h3>
        </GridIsFull>
        <GridIsQuarter num={1}> Area 1 </GridIsQuarter>
        <GridIsQuarter num={2}> Area 2 </GridIsQuarter>
        <GridIsQuarter num={3}> Area 3 </GridIsQuarter>
        <GridIsQuarter num={4}> Area 4 </GridIsQuarter>
      </Fold>
    </PageMainContent>
  );
}

export default Home;
