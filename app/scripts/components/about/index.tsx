import React from 'react';
import { getOverride } from 'veda';

import { LayoutProps } from '$components/common/layout-root';
import { PageMainContent } from '$styles/page';
import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';
import { ContentOverride } from '$components/common/page-overrides';

const aboutContent = getOverride('aboutContent');

function About() {
  return (
    <PageMainContent>
      <LayoutProps title='About' />
      <PageHero
        title={aboutContent?.data.title || 'About the Dashboard'}
        description={
          aboutContent?.data.description || 'This is the default description'
        }
        coverSrc={aboutContent?.data.media?.src}
        coverAlt={aboutContent?.data.media?.alt}
        attributionAuthor={aboutContent?.data.media?.author?.name}
        attributionUrl={aboutContent?.data.media?.author?.url}
      />
      <ContentOverride with='aboutContent'>
        <FoldProse>
          <p>
            This is the app about page, where you can find information about the
            whole app. To customize this content use Content Overrides.
          </p>
        </FoldProse>
      </ContentOverride>
    </PageMainContent>
  );
}

export default About;
