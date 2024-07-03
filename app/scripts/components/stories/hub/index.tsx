import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { stories, storyTaxonomies, getString } from 'veda';
import { glsp } from '@devseed-ui/theme-provider';
import { Subtitle } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { CollecticonXmarkSmall } from '@devseed-ui/collecticons';
import { VerticalDivider } from '@devseed-ui/toolbar';

import PublishedDate from '$components/common/pub-date';
import BrowseControls from '$components/common/browse-controls';
import { FilterActions } from '$components/common/catalog/utils';
import { useFiltersWithQS } from '$components/common/catalog/controls/hooks/use-filters-with-query';
import { LayoutProps } from '$components/common/layout-root';
import { useSlidingStickyHeaderProps } from '$components/common/layout-root/useSlidingStickyHeaderProps';
import PageHero from '$components/common/page-hero';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldTitle
} from '$components/common/fold';
import { Card } from '$components/common/card';
import { CardListGrid, CardMeta, CardTopicsList } from '$components/common/card/styles';
import EmptyHub from '$components/common/empty-hub';
import { PageMainContent } from '$styles/page';
import { STORIES_PATH, getStoryPath } from '$utils/routes';
import TextHighlight from '$components/common/text-highlight';
import Pluralize from '$utils/pluralize';
import { Pill } from '$styles/pill';
import { FeaturedStories } from '$components/common/featured-slider-section';
import { CardSourcesList } from '$components/common/card-sources';
import {
  getTaxonomy,
  TAXONOMY_SOURCE,
  TAXONOMY_TOPICS
} from '$utils/veda-data';
import {
  ComponentOverride,
  ContentOverride
} from '$components/common/page-overrides';
import { prepareDatasets } from '$components/common/catalog/prepare-datasets';

const allStories = Object.values(stories).map((d) => d!.data);

const StoryCount = styled(Subtitle)`
  grid-column: 1 / -1;
  display: flex;
  gap: ${glsp(0.5)};

  span {
    text-transform: uppercase;
    line-height: 1.5rem;
  }
`;

const BrowseFoldHeader = styled(FoldHeader)`
  flex-flow: column nowrap;
  align-items: flex-start;
`;

const FoldWithTopMargin = styled(Fold)`
  margin-top: ${glsp()};
`;
 
function StoriesHub() {
  const controlVars = useFiltersWithQS();

  const { search, taxonomies, onAction } = controlVars;
  

  const displayStories = useMemo(
    () =>
      prepareDatasets(allStories, {
        search,
        taxonomies
      }),
    [search, taxonomies]
  );
  
  const isFiltering = !!(
    (taxonomies && Object.keys(taxonomies).length )||
    search
  );

  const browseControlsHeaderRef = useRef<HTMLDivElement>(null);
  const { headerHeight } = useSlidingStickyHeaderProps();

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
        <FoldWithTopMargin>
          <BrowseFoldHeader
            ref={browseControlsHeaderRef}
            style={{
              scrollMarginTop: `${headerHeight + 16}px`
            }}
          >
            <FoldHeadline>
              <FoldTitle>Browse</FoldTitle>
            </FoldHeadline>
            <BrowseControls
              search={search}
              taxonomies={taxonomies}
              onAction={onAction}
              taxonomiesOptions={storyTaxonomies}
            />
          </BrowseFoldHeader>

          <StoryCount>
            <span>
              Showing{' '}
              <Pluralize
                singular={getString('stories').one}
                plural={getString('stories').other}
                count={displayStories.length}
                showCount={true}
              />{' '}
              out of {allStories.length}.
            </span>
            {isFiltering && (
              <Button forwardedAs={Link} to={STORIES_PATH} size='small'>
                Clear filters <CollecticonXmarkSmall />
              </Button>
            )}
          </StoryCount>

          {displayStories.length ? (
            <CardListGrid>
              {displayStories.map((d) => {
                const pubDate = new Date(d.pubDate);
                const topics = getTaxonomy(d, TAXONOMY_TOPICS)?.values;
                return (
                  <li key={d.id}>
                    <Card
                      cardType='classic'
                      overline={
                        <CardMeta>
                          <CardSourcesList
                            sources={getTaxonomy(d, TAXONOMY_SOURCE)?.values}
                            rootPath={STORIES_PATH}
                            onSourceClick={(id) => {
                              onAction(FilterActions.TAXONOMY_MULTISELECT, {
                                key: TAXONOMY_SOURCE,
                                value: id
                              });
                              browseControlsHeaderRef.current?.scrollIntoView();
                            }}
                          />
                          <VerticalDivider variation='dark' />
                          
                          {!isNaN(pubDate.getTime()) && (
                              <PublishedDate date={pubDate} />
                          )}
                        </CardMeta>
                      }
                      linkLabel='View more'
                      linkTo={d.asLink?.url ?? getStoryPath(d)}
                      title={
                        <TextHighlight
                          value={search}
                          disabled={search.length < 3}
                        >
                          {d.name}
                        </TextHighlight>
                      }
                      description={
                        <TextHighlight
                          value={search}
                          disabled={search.length < 3}
                        >
                          {d.description}
                        </TextHighlight>
                      }
                      imgSrc={d.media?.src}
                      imgAlt={d.media?.alt}
                      footerContent={
                        <>
                          {topics?.length ? (
                            <CardTopicsList>
                              <dt>Topics</dt>
                              {topics.map((t) => (
                                <dd key={t.id}>
                                  <Pill
                                    as={Link}
                                    to={`${STORIES_PATH}?${
                                      FilterActions.TAXONOMY
                                    }=${encodeURIComponent(
                                      JSON.stringify({ Topics: t.id })
                                    )}`}
                                    onClick={() => {
                                      browseControlsHeaderRef.current?.scrollIntoView();
                                    }}
                                  >
                                    <TextHighlight
                                      value={search}
                                      disabled={search.length < 3}
                                    >
                                      {t.name}
                                    </TextHighlight>
                                  </Pill>
                                </dd>
                              ))}
                            </CardTopicsList>
                          ) : null}
                        </>
                      }
                    />
                  </li>
                );
              })}
            </CardListGrid>
          ) : (
            <EmptyHub>
              There are no {getString('stories').other.toLocaleLowerCase()} to
              show with the selected filters.
            </EmptyHub>
          )}
        </FoldWithTopMargin>
      </ContentOverride>
    </PageMainContent>
  );
}

export default StoriesHub;