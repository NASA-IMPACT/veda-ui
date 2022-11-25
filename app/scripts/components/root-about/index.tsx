import React from 'react';
import { getOverride } from 'veda/thematics';

import { LayoutProps } from '$components/common/layout-root';
import { PageMainContent } from '$styles/page';
import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';
import { ContentOverride } from '$components/common/page-overrides';

const aboutContent = getOverride('aboutContent');

function RootAbout() {
  return (
    <PageMainContent>
      <LayoutProps title='Thematic about' />
      <PageHero
        title={aboutContent?.data.title || 'About the Dashboard'}
        description={
          aboutContent?.data.description || 'Lorem ipsum dolor sit amet.'
        }
      />
      <ContentOverride with='aboutContent'>
        <FoldProse>
          <p>
            This is the root about. Here you can find info about the whole app,
            with its many thematic areas.
          </p>
        </FoldProse>
      </ContentOverride>
    </PageMainContent>
  );
}

export default RootAbout;
