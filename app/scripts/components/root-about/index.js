import React from 'react';

import { LayoutProps } from '../common/layout-root';
import { PageLead, PageMainContent } from '../../styles/page';

import PageHero from '../common/page-hero';
import { FoldProse } from '../common/fold';

function RootAbout() {
  return (
    <PageMainContent>
      <LayoutProps title='Thematic about' />
      <PageHero
        title='About the Dashboard'
        detailsContent={<PageLead>Lorem ipsum dolor sit amet.</PageLead>}
      />
      <FoldProse>
        <p>
          This is the root about. Here you can find info about the whole app,
          with its many thematic areas.
        </p>
      </FoldProse>
    </PageMainContent>
  );
}

export default RootAbout;
