import React from 'react';
import styled from 'styled-components';
import { discoveries } from 'veda';
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
import { getDiscoveryPath } from '$utils/routes';
import { Pill } from '$styles/pill';

const allFeaturedDiscoveries = Object.values(discoveries)
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

function FeaturedDiscoveries() {
  const { isScrolling, scrollProps } = useReactIndianaScrollControl();

  if (!allFeaturedDiscoveries.length) return null;

  return (
    <FoldFeatured>
      <FoldHeader>
        <FoldTitle>Featured Discoveries</FoldTitle>
      </FoldHeader>
      <ContinuumCardsDragScrollWrapper>
        <ContinuumScrollIndicator />
        <ContinuumDragScroll hideScrollbars={false} {...scrollProps}>
          <Continuum
            listAs='ol'
            startCol={continuumFoldStartCols}
            spanCols={continuumFoldSpanCols}
            render={(bag) => {
              return allFeaturedDiscoveries.map((d) => {
                const pubDate = new Date(d.pubDate);
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
                      linkTo={getDiscoveryPath(d)}
                      title={d.name}
                      overline={
                        <CardMeta>
                          <span>By SOURCE</span>

                          {!isNaN(pubDate.getTime()) && (
                            <>
                              <VerticalDivider variation='light' />
                              <PublishedDate date={pubDate} />
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

export default FeaturedDiscoveries;
