import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import useDimensions from 'react-cool-dimensions';
import DragScroll from 'react-indiana-drag-scroll';
import { listReset } from '@devseed-ui/theme-provider';

import { calcItemWidth, calcMargin } from './utils';
import { ContinuumScrollIndicator } from './continuum-scroll-indicator';

import { useMediaQuery } from '$utils/use-media-query';
import { variableGlsp } from '$styles/variable-utils';

interface ContinuumRenderFunctionBag {
  viewportWidth: number;
  spanCols: number;
}

interface ContinuumProps {
  className?: string;
  render?: (bag: ContinuumRenderFunctionBag) => ReactNode;
  startCol: {
    largeUp: string;
    mediumUp: string;
    smallUp: string;
  };
  spanCols: {
    largeUp: number;
    mediumUp: number;
    smallUp: number;
  };
  children?: ReactNode;
  listAs?: any;
}

const ContinuumSelf = styled.div`
  overflow: visible;
`;

const ContinuumList = styled.ul`
  ${listReset()}

  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  width: max-content;
  ${calcMargin}

  li {
    margin-right: ${variableGlsp()};
  }
`;

export const ContinuumDragScrollWrapper = styled.div`
  position: relative;
  overflow: hidden;
  cursor: grab;

  &:hover {
    ${ContinuumScrollIndicator} {
      opacity: 0;
    }
  }
`;

const C = ContinuumDragScrollWrapper; // Because prettier and code formatting.
export const ContinuumCardsDragScrollWrapper = styled(C)`
  grid-column: 1 / -1;

  ${ContinuumList} {
    /* account for the hover movement of cards */
    padding-bottom: 1rem;
  }
`;

/*
  We set hideScrollbars={false} so that the scrollbars are there but then
  hide them. This allows for horizontal scrolling with the mouse wheel.
*/
export const ContinuumDragScroll = styled(DragScroll)`
  margin-bottom: calc(-1 * var(--scrollbar-width));
`;

/**
 * Continuum item with no width restrictions. Useful when we want items to have
 * their own width.
 */
export const ContinuumItem = styled.li`
  figure {
    max-width: 100%;
    height: auto;

    img {
      width: auto;
    }
  }
`;

/**
 * Continuum item that has to sit on a grid.
 *
 * @prop {number} spanCols Columns to span. Normally provided by Continuum's
 * render function.
 */
export const ContinuumGridItem = styled.li<ContinuumRenderFunctionBag>`
  ${calcItemWidth}
  align-self: stretch;

  > * {
    height: 100%;
  }
`;

/**
 * Renders an horizontal scrollable element where the content can start in a
 * column in line with the Universal Gridder.
 *
 * @param {object} props Component props
 */
export function Continuum(props: ContinuumProps) {
  const {
    startCol,
    spanCols,
    render,
    children,
    className,
    listAs = 'ul'
  } = props;
  const { isLargeUp, isMediumUp } = useMediaQuery();

  const { observe, width } = useDimensions();

  useEffect(() => {
    observe(document.body);
  }, [observe]);

  const startColList = isLargeUp
    ? startCol.largeUp
    : isMediumUp
    ? startCol.mediumUp
    : startCol.smallUp;

  const spanColsList = isLargeUp
    ? spanCols.largeUp
    : isMediumUp
    ? spanCols.mediumUp
    : spanCols.smallUp;

  return (
    <ContinuumSelf className={className}>
      <ContinuumList
        as={listAs}
        viewportWidth={width}
        startCol={startColList || 'content-start'}
      >
        {typeof render === 'function'
          ? render({ viewportWidth: width, spanCols: spanColsList || 3 })
          : children}
      </ContinuumList>
    </ContinuumSelf>
  );
}
