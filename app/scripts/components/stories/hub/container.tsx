import React from 'react';

import { stories, getString } from 'veda';
import HubContent from './hub-content';

import { useFiltersWithQS } from '$components/common/catalog/controls/hooks/use-filters-with-query';
import { LayoutProps } from '$components/common/layout-root';

import PageHero from '$components/common/page-hero';

import { PageMainContent } from '$styles/page';
import { getStoryPath } from '$utils/routes';
import { FeaturedStories } from '$components/common/featured-slider-section';
import {
  ComponentOverride,
  ContentOverride
} from '$components/common/page-overrides';

const allStories = Object.values(stories)
  .map((d) => d!.data)
  .filter((d) => !d.isHidden)
  .map((d) => ({ ...d, path: getStoryPath(d) }));

function StoriesHubContainer() {
  const controlVars = useFiltersWithQS();
  return (
    <PageMainContent>
      <LayoutProps
        title={getString('stories').other}
        description={getString('storiesBanner').other}
      />
      <ComponentOverride with='storiesHubHero'>
        <PageHero
          title={getString('stories').other}
          description={getString('storiesBanner').other}
        />
      </ComponentOverride>
      <FeaturedStories />
      <ContentOverride with='storiesHubContent'>
        <HubContent
          allStories={allStories}
          onFilterchanges={() => controlVars}
          storiesString={{
            one: getString('stories').one,
            other: getString('stories').other
          }}
        />
      </ContentOverride>
    </PageMainContent>
  );
}

export default StoriesHubContainer;
