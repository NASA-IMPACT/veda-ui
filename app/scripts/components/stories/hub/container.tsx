import React from 'react';
import { useNavigate } from 'react-router';

import { stories, getString } from 'veda';
import HubContent from './hub-content';
import { generateTaxonomies } from '$utils/veda-data/taxonomies';

import { useFiltersWithQS } from '$components/common/catalog/controls/hooks/use-filters-with-query';
import { LayoutProps } from '$components/common/layout-root';

import PageHero from '$components/common/page-hero';

import { PageMainContent } from '$styles/page';
import { STORIES_PATH, getStoryPath } from '$utils/routes';
import { FeaturedStories } from '$components/common/featured-slider-section';
import {
  ComponentOverride,
  ContentOverride
} from '$components/common/page-overrides';

import SmartLink from '$components/common/smart-link';

const allStories = Object.values(stories).map((d) => d!.data).filter(d => !d.isHidden).map((d) => ({ ...d, path: getStoryPath(d)}));

function StoriesHub() {
  const controlVars = useFiltersWithQS({navigate: useNavigate()});
  const storyTaxonomies = generateTaxonomies(allStories);
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
          linkProperties={{ LinkElement: SmartLink, pathAttributeKeyName: 'to'}}
          STORIES_PATH={STORIES_PATH}
          storiesString={{one: getString('stories').one,other: getString('stories').other}}
          storyTaxonomies={storyTaxonomies}
        />
      </ContentOverride>
    </PageMainContent>
  );
}

export default StoriesHub;