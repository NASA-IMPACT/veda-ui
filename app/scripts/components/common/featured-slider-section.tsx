import React from 'react';
import styled from 'styled-components';
import { DatasetData, StoryData, datasets, stories, getString } from 'veda';
import { VerticalDivider } from '@devseed-ui/toolbar';

import PublishedDate from './pub-date';
import { CardSourcesList } from './card-sources';
import { DatasetClassification } from './dataset-classification';

import { Card } from '$components/common/card';
import { CardMeta, CardTopicsList } from '$components/common/card/styles';
import { FoldGrid, FoldHeader, FoldTitle } from '$components/common/fold';
import {
  Continuum,
  ContinuumGridItem,
  ContinuumCardsDragScrollWrapper,
  ContinuumDragScroll
} from '$styles/continuum';
import { useReactIndianaScrollControl } from '$styles/continuum/use-react-indiana-scroll-controls';
import { ContinuumScrollIndicator } from '$styles/continuum/continuum-scroll-indicator';
import { getDatasetPath, getStoryPath } from '$utils/routes';
import { Pill } from '$styles/pill';
// import {
//   getTaxonomy,
//   TAXONOMY_SOURCE,
//   TAXONOMY_TOPICS
// } from '$utils/veda-data';
import {
  getTaxonomy,
  TAXONOMY_SOURCE,
  TAXONOMY_TOPICS
} from '$utils/veda-data/taxonomies';
import DatasetMenu from '$components/data-catalog/dataset-menu';

const allFeaturedStories = Object.values(stories)
  .map((d) => d!.data)
  .filter((d) => d.featured);

const allFeaturedDatasets = Object.values(datasets)
  .map((d) => d!.data)
  .filter((d) => d.featured);

const FoldFeatured = styled(FoldGrid)`
  ${FoldHeader} {
    grid-column: content-start / content-end;
  }
  padding-bottom: 0;
`;

export const continuumFoldStartCols = {
  smallUp: 'content-start',
  mediumUp: 'content-start',
  largeUp: 'content-start'
};

export const continuumFoldSpanCols = {
  smallUp: 3,
  mediumUp: 5,
  largeUp: 8
};

interface FeaturedSliderSectionProps {
  featuring?: 'datasets' | 'stories';
  featuredItems: StoryData[] | DatasetData[];
  title: string;
  getItemPath: typeof getStoryPath | typeof getDatasetPath;
  dateProperty?: string;
}

function FeaturedSliderSection(props: FeaturedSliderSectionProps) {
  const { isScrolling, scrollProps } = useReactIndianaScrollControl();

  const { featuring, featuredItems, title, getItemPath, dateProperty } = props;

  if (!featuredItems.length) return null;

  // Disable no-mutating rule since the copy of the array is being mutated
  // eslint-disable-next-line fp/no-mutating-methods
  const sortedFeaturedItems  = dateProperty? [...featuredItems].sort((itemA: StoryData | DatasetData, itemB: StoryData | DatasetData) => {
    const pubDateOfItemA = new Date(itemA[dateProperty]);
    const pubDateOfItemB = new Date(itemB[dateProperty]);
    return pubDateOfItemB.getTime() - pubDateOfItemA.getTime();
  }) as StoryData[] | DatasetData[]: featuredItems;


  return (
    <FoldFeatured>
      <FoldHeader>
        <FoldTitle>{title}</FoldTitle>
      </FoldHeader>
      <ContinuumCardsDragScrollWrapper>
        <ContinuumScrollIndicator />
        <ContinuumDragScroll hideScrollbars={false} {...scrollProps}>
          <Continuum
            listAs='ol'
            startCol={continuumFoldStartCols}
            spanCols={continuumFoldSpanCols}
            render={(bag) => {
              return sortedFeaturedItems.map((d) => {
                const date = new Date(d[dateProperty ?? '']);
                const topics = getTaxonomy(d, TAXONOMY_TOPICS)?.values;

                return (
                  <ContinuumGridItem {...bag} key={d.id}>
                    <Card
                      onCardClickCapture={(e) => {
                        // If the user was scrolling and let go of the mouse on top of a
                        // card a click event is triggered. We capture the click on the
                        // parent and never let it reach the link.
                        if (isScrolling) {
                          e.preventDefault();
                        }
                      }}
                      cardType='featured'
                      linkLabel='View more'
                      linkTo={d.asLink?.url ?? getItemPath(d)}
                      title={d.name}
                      overline={
                        <CardMeta>
                          {featuring === 'datasets' && (
                            <DatasetClassification dataset={d} />
                          )}
                          <CardSourcesList
                            sources={getTaxonomy(d, TAXONOMY_SOURCE)?.values}
                          />
                          <VerticalDivider variation='light' />
                          {!isNaN(date.getTime()) && (
                            <PublishedDate date={date} />
                          )}
                        </CardMeta>
                      }
                      description={d.description}
                      imgSrc={d.media?.src}
                      imgAlt={d.media?.alt}
                      footerContent={
                        <>
                          {topics?.length ? (
                            <CardTopicsList>
                              <dt>Topics</dt>
                              {topics.map((t) => (
                                <dd key={t.id}>
                                  <Pill variation='achromic'>{t.name}</Pill>
                                </dd>
                              ))}
                            </CardTopicsList>
                          ) : null}
                          {featuring === 'datasets' && (
                            <DatasetMenu dataset={d} />
                          )}
                        </>
                      }
                    />
                  </ContinuumGridItem>
                );
              });
            }}
          />
        </ContinuumDragScroll>
      </ContinuumCardsDragScrollWrapper>
    </FoldFeatured>
  );
}

export function FeaturedStories() {
  return (
    <FeaturedSliderSection
      title={`Featured ${getString('stories').other}`}
      featuredItems={allFeaturedStories}
      getItemPath={getStoryPath}
      dateProperty='pubDate'
    />
  );
}

export function FeaturedDatasets() {
  return (
    <FeaturedSliderSection
      title='Featured Datasets'
      featuredItems={allFeaturedDatasets}
      getItemPath={getDatasetPath}
      featuring='datasets'
    />
  );
}
