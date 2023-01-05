import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  glsp,
  multiply,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import {
  CollecticonHandPan,
  CollecticonHandSwipeHorizontal
} from '@devseed-ui/collecticons';

// // // // // // // // // // // // // // // // // // // // // // // // // // //
// ContinuumScrollIndicator                                                   //
// Style and component to show a crossfading scroll and drag indicator.
//                                                                            //
const moveAnim = keyframes`
  from {
    transform: translate(-1rem);
  }
  to {
    transform: translate(1rem);
  }
`;

const fade = keyframes`
  0% {
    opacity: 1;
  }
  33% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  83% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fade2 = keyframes`
  0% {
    opacity: 0;
  }
  33% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  83% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

function ContinuumScrollIndicatorSelf({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div>
        <CollecticonHandSwipeHorizontal size='xxlarge' />
        <CollecticonHandPan size='xxlarge' />
        <span>Scroll to see content</span>
      </div>
    </div>
  );
}

export const ContinuumScrollIndicator = styled(ContinuumScrollIndicatorSelf)`
  position: absolute;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 1;
  transition: all 0.32s ease-in-out 0s;

  span {
    ${visuallyHidden()}
  }

  > div {
    animation-name: ${moveAnim};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in;
    backdrop-filter: blur(2px);

    font-size: 2rem;
    background: ${themeVal('color.base-300a')};
    color: ${themeVal('color.base-100')};
    border-radius: ${multiply(themeVal('shape.rounded'), 2)};
    padding: ${glsp()};
  }

  ${CollecticonHandSwipeHorizontal}, ${CollecticonHandPan} {
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  ${CollecticonHandSwipeHorizontal} {
    animation-name: ${fade};
  }

  ${CollecticonHandPan} {
    animation-name: ${fade2};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(calc(-50% - 2px), -50%);
  }
`;
