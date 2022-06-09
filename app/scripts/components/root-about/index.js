import React from 'react';
import { config } from 'delta/thematics';

import { LayoutProps } from '$components/common/layout-root';
import { PageMainContent } from '$styles/page';
import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';
import MdxContent from '$components/common/mdx-content';

const aboutContent = config.pageOverrides?.aboutContent;

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
      {aboutContent ? (
        <MdxContent loader={aboutContent.content} />
      ) : (
        <FoldProse>
          <p>
            This is the root about. Here you can find info about the whole app,
            with its many thematic areas.
          </p>
        </FoldProse>
      )}
    </PageMainContent>
  );
}

export default RootAbout;
