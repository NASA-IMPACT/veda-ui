import React from 'react';
import styled from 'styled-components';
import vedaThematics from 'veda/thematics';

import { Card } from '$components/common/card';
import { FoldGrid, FoldHeader, FoldTitle } from '$components/common/fold';
import Pluralize from '$utils/pluralize';

import {
  Continuum,
  ContinuumGridItem,
  ContinuumCardsDragScrollWrapper,
  ContinuumDragScroll
} from '$styles/continuum';
import { useReactIndianaScrollControl } from '$styles/continuum/use-react-indiana-scroll-controls';
import { ContinuumScrollIndicator } from '$styles/continuum/continuum-scroll-indicator';

const FoldThematicAreas = styled(FoldGrid)`
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
  mediumUp: 4,
  largeUp: 4
};

function ThematicAreasList() {
  const { isScrolling, scrollProps } = useReactIndianaScrollControl();
  return (
    <FoldThematicAreas>
      <FoldHeader>
        <FoldTitle>Explore the thematic areas</FoldTitle>
      </FoldHeader>
      <ContinuumCardsDragScrollWrapper>
        <ContinuumScrollIndicator />
        <ContinuumDragScroll hideScrollbars={false} {...scrollProps}>
          <Continuum
            listAs='ol'
            startCol={continuumFoldStartCols}
            spanCols={continuumFoldSpanCols}
            render={(bag) => {
              return vedaThematics.map((t) => (
                <ContinuumGridItem {...bag} key={t.id}>
                  <Card
                    onCardClickCapture={(e) => {
                      // If the user was scrolling and let go of the mouse on top of a
                      // card a click event is triggered. We capture the click on the
                      // parent and never let it reach the link.
                      if (isScrolling) {
                        e.preventDefault();
                      }
                    }}
                    cardType='cover'
                    linkLabel='View more'
                    linkTo={t.id}
                    title={t.name}
                    parentName='Area'
                    parentTo='/'
                    description={t.description}
                    overline={
                      <>
                        <i>Contains </i>
                        <Pluralize
                          zero='no discoveries'
                          singular='discovery'
                          plural='discoveries'
                          count={t.discoveries.length}
                        />
                        {' / '}
                        <Pluralize
                          zero='no datasets'
                          singular='dataset'
                          count={t.datasets.length}
                        />
                      </>
                    }
                    imgSrc={t.media?.src}
                    imgAlt={t.media?.alt}
                  />
                </ContinuumGridItem>
              ));
            }}
          />
        </ContinuumDragScroll>
      </ContinuumCardsDragScrollWrapper>
    </FoldThematicAreas>
  );
}

export default ThematicAreasList;
