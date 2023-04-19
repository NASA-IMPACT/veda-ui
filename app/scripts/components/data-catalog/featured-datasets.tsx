import React from 'react';
import styled from 'styled-components';
import { datasets } from 'veda';
import { VerticalDivider } from '@devseed-ui/toolbar';

const allDatasets = Object.values(datasets).map((d) => d!.data);

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
import { DATASETS_PATH, getDatasetPath } from '$utils/routes';
import { Pill } from '$styles/pill';

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

function FeaturedDatasets() {
  const { isScrolling, scrollProps } = useReactIndianaScrollControl();

  return (
    <FoldFeatured>
      <FoldHeader>
        <FoldTitle>Featured Datasets</FoldTitle>
      </FoldHeader>
      <ContinuumCardsDragScrollWrapper>
        <ContinuumScrollIndicator />
        <ContinuumDragScroll hideScrollbars={false} {...scrollProps}>
          <Continuum
            listAs='ol'
            startCol={continuumFoldStartCols}
            spanCols={continuumFoldSpanCols}
            render={(bag) => {
              return allDatasets.map((d) => (
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
                    linkTo={getDatasetPath(d)}
                    title={d.name}
                    overline={
                      <CardMeta>
                        <span>By NASA EODIS</span>
                        <VerticalDivider variation='light' />
                        <span>
                          Updated <time dateTime='2023-01-01'>X time ago</time>
                        </span>
                      </CardMeta>
                    }
                    parentName='Dataset'
                    parentTo={DATASETS_PATH}
                    description={d.description}
                    imgSrc={d.media?.src}
                    imgAlt={d.media?.alt}
                    footerContent={
                      d.thematics.length ? (
                        <CardTopicsList>
                          <dt>Topics</dt>
                          {d.thematics.map((t) => (
                            <dd key={t}>
                              <Pill>{t}</Pill>
                            </dd>
                          ))}
                        </CardTopicsList>
                      ) : null
                    }
                  />
                </ContinuumGridItem>
              ));
            }}
          />
        </ContinuumDragScroll>
      </ContinuumCardsDragScrollWrapper>
    </FoldFeatured>
  );
}

export default FeaturedDatasets;
