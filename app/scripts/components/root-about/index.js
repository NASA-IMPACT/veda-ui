import React from 'react';

import { LayoutProps } from '../common/layout-root';
import Constrainer from '../../styles/constrainer';
import { PageMainContent } from '../../styles/page';

function RootAbout() {
  return (
    <PageMainContent>
      <LayoutProps title='Thematic about' />
      <Constrainer>
        <h1>About site</h1>
        <p>
          Welcome to the root about. Here you can find info about the whole app,
          with its many thematic areas.
        </p>
      </Constrainer>
    </PageMainContent>
  );
}

export default RootAbout;
