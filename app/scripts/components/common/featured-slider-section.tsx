import React from 'react';
import styled from 'styled-components';
import { DatasetData, DiscoveryData, datasets, discoveries } from 'veda';
import { VerticalDivider } from '@devseed-ui/toolbar';

import PublishedDate from './pub-date';

import { Card, CardMeta, CardTopicsList } from '$components/common/card';
import { FoldGrid, FoldHeader, FoldTitle } from '$components/common/fold';
import {
  Continuum,
  ContinuumGridItem,
  ContinuumCardsDragScrollWrapper,
  ContinuumDragScroll
} from '$styles/continuum';
import { useReactIndianaScrollControl } from '$styles/continuum/use-react-indiana-scroll-controls';
import { ContinuumScrollIndicator } from '$styles/continuum/continuum-scroll-indicator';
import { getDatasetPath, getDiscoveryPath } from '$utils/routes';
import { Pill } from '$styles/pill';
import DatasetMenu from '$components/data-catalog/dataset-menu';

const allFeaturedDiscoveries = Object.values(discoveries)
  .map((d) => d!.data)
  .filter((d) => d.featured);

const allFeaturedDatasets = Object.values(datasets)
  .map((d) => d!.data)
  .filter((d) => d.featured);

const FoldFeatured = styled(FoldGrid)`
  ${FoldHeader} {
    grid-column: content-start / content-end;
  }
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
  featuring?: 'datasets' | 'discoveries';
  featuredItems: DiscoveryData[] | DatasetData[];
  title: string;
  getItemPath: typeof getDiscoveryPath | typeof getDatasetPath;
  dateProperty?: string;
}

function FeaturedSliderSection(props: FeaturedSliderSectionProps) {
  const { isScrolling, scrollProps } = useReactIndianaScrollControl();

  const { featuring, featuredItems, title, getItemPath, dateProperty } = props;

  if (!featuredItems.length) return null;

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
              return featuredItems.map((d) => {
                const date = new Date(d[dateProperty ?? '']);

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
                      linkTo={getItemPath(d)}
                      title={d.name}
                      overline={
                        <CardMeta>
                          <span>By SOURCE</span>

                          {!isNaN(date.getTime()) && (
                            <>
                              <VerticalDivider variation='light' />
                              <PublishedDate date={date} />
                            </>
                          )}
                        </CardMeta>
                      }
                      description={d.description}
                      imgSrc={d.media?.src}
                      imgAlt={d.media?.alt}
                      footerContent={
                        <>
                          {d.thematics?.length ? (
                            <CardTopicsList>
                              <dt>Topics</dt>
                              {d.thematics.map((t) => (
                                <dd key={t}>
                                  <Pill variation='achromic'>{t}</Pill>
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

export function FeaturedDiscoveries() {
  return (
    <FeaturedSliderSection
      title='Featured Discoveries'
      featuredItems={allFeaturedDiscoveries}
      getItemPath={getDiscoveryPath}
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
