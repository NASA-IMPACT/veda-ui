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
        <IntroFoldCopy>
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
        </IntroFoldCopy>
      </IntroFold>
    </PageMainContent>
  );
}

export default Home;
