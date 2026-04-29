import React from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

const Overlay = styled.div`
  position: absolute;
  bottom: ${glsp(1)};
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: ${themeVal('color.surface')};
  padding: ${glsp(0.5, 1)};
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: ${themeVal('boxShadow.elevationA')};
  display: flex;
  align-items: center;
  gap: ${glsp(0.5)};
  font-size: 0.875rem;
`;

interface PaginationOverlayProps {
  loadedCount: number;
  totalMatched: number;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export default function PaginationOverlay(props: PaginationOverlayProps) {
  const { loadedCount, totalMatched, isLoadingMore, onLoadMore } = props;

  return (
    <Overlay>
      <span>
        Showing {loadedCount} of {totalMatched} items
      </span>
      <Button size='small' onClick={onLoadMore} disabled={isLoadingMore}>
        {isLoadingMore ? 'Loading...' : 'Load More'}
      </Button>
    </Overlay>
  );
}
