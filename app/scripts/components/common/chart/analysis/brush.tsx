import React, { useCallback } from 'react';
import styled from 'styled-components';
import { brushHeight } from '../constant';
import useBrush from './useBrush';

const BrushWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
`;

const BrushContainer = styled.div<{ height: number }>`
  position: absolute;
  top: 0;
  height: ${({ height }) => height}px;
`;

const BrushComponent = styled.button`
  position: absolute;
  height: 100%;
  padding: 0;
  border: 1px solid rgb(110, 110, 110);
`;

const BrushTraveller = styled(BrushComponent)`
  width: 7px;
  cursor: col-resize;
  z-index: 1;
  padding: 0;
  background: rgb(110, 110, 110);
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    content: ' ';
    border: 1px solid white;
    opacity: 0.7;
    width: 3px;
    height: 10px;
    display: block;
    border-top-width: 0;
    border-bottom-width: 0;
  }
`;

const BrushTravellerStart = styled(BrushTraveller)`
  left: -3px;
`;
const BrushTravellerEnd = styled(BrushTraveller)`
  right: -3px;
`;
const BrushDrag = styled(BrushComponent)`
  width: 100%;
  cursor: move;
  background: rgba(110, 110, 110, 0.3);
`;

export interface BrushProps {
  availableDomain: [Date, Date];
  brushRange: [Date, Date];
  onBrushRangeChange: (range: [Date, Date]) => void;
}

function Brush(props: BrushProps) {
  const { availableDomain, brushRange, onBrushRangeChange } = props;

  const changeCallback = useCallback(
    (newSelection) => {
      onBrushRangeChange(newSelection);
    },
    [onBrushRangeChange]
  );

  const { onBrushMouseDown, wrapperRef, containerStyles } = useBrush(
    availableDomain,
    brushRange,
    changeCallback
  );

  return (
    <BrushWrapper ref={wrapperRef}>
      <BrushContainer
        height={brushHeight}
        onMouseDown={onBrushMouseDown}
        style={containerStyles}
      >
        <BrushTravellerStart data-role='start' />
        <BrushDrag data-role='drag' />
        <BrushTravellerEnd data-role='end' />
      </BrushContainer>
    </BrushWrapper>
  );
}

export default Brush;
