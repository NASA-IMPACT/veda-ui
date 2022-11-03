import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { glsp, themeVal, visuallyHidden } from '@devseed-ui/theme-provider';
import { CollecticonChartLine } from '@devseed-ui/collecticons';

import { variableGlsp } from '$styles/variable-utils';

const pulse = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const pulsingAnimation = css`
  animation: ${pulse} 0.8s ease 0s infinite alternate;
`;

interface LoadingSkeletonProps {
  inline?: boolean;
  width?: number;
  height?: string;
  size?: 'large';
  variation?: 'light';
  type?: 'heading';
}

export const LoadingSkeleton = styled.span<LoadingSkeletonProps>`
  display: ${({ inline }) => (inline ? 'inline-block' : 'block')};
  background: ${themeVal('color.base-100')};
  height: ${({ height }) => (height ? height : '1rem')};
  width: ${({ width }) => (width || 1) * 100}%;
  ${pulsingAnimation}

  /* Size modifier */
  ${({ size }) => size === 'large' && 'height: 2.25rem;'}

  /* Color modifier */
  ${({ variation }) => variation === 'light' && 'background: rgba(#fff, 0.48);'}

  /* type modifier */
  ${({ type, variation }) =>
    type === 'heading' &&
    css`
      background: ${themeVal('color.base-200')};
      ${variation === 'light' && 'background: rgba(#fff, 0.80);'}
    `}
`;

export const LoadingSkeletonGroup = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${glsp(0.5)};
`;

interface MapLoadingProps {
  position?: 'left' | 'right' | 'center';
}

const MapLoadingWrapper = styled.div<MapLoadingProps>`
  position: absolute;
  z-index: 1;
  display: grid;
  top: 50%;
  transform: translate(-50%, -50%);
  grid-template-columns: repeat(1fr, 3);
  grid-template-rows: repeat(1fr, 3);
  width: 8rem;
  aspect-ratio: 1;
  gap: ${glsp(0.5)};

  ${({ position }) => {
    if (position === 'left') return 'left: 25%;';
    if (position === 'right') return 'left: 75%;';
    return 'left: 50%;';
  }}

  > * {
    height: auto;
  }

  > *:nth-child(1) {
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
  }

  > *:nth-child(2) {
    grid-column: 3 / span 1;
    grid-row: 2 / span 1;
  }

  > *:nth-child(3) {
    grid-column: 2 / span 1;
    grid-row: 3 / span 1;
  }
`;

const ContentLoadingSelf = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 24vh);
  gap: ${variableGlsp()};
  padding: ${variableGlsp()};
  background: ${themeVal('color.surface')};

  > div {
    background: ${themeVal('color.base-100')};
    ${pulsingAnimation}
  }

  > div:nth-child(1) {
    grid-column: 1 / span 1;
  }

  > div:nth-child(2) {
    grid-column: 2 / span 3;
  }

  > div:nth-child(3) {
    grid-column: 1 / span 3;
    grid-row: 2;
  }

  > div:nth-child(4) {
    grid-column: 4 / span 1;
    grid-row: 2;
  }

  p {
    ${visuallyHidden()}
  }
`;

const ChartLoadingWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  text-align: center;
  padding: ${variableGlsp()};
  gap: ${glsp()};
  aspect-ratio: 16/9;
  color: ${themeVal('color.base-400')};

  &::before {
    position: absolute;
    inset: 0;
    display: flex;
    content: '';
    z-index: -1;
    padding: ${variableGlsp()};
    background: ${themeVal('color.base-100')};
    ${pulsingAnimation}
  }
`;

export function ContentLoading() {
  return (
    <ContentLoadingSelf>
      <div />
      <div />
      <div />
      <div />
      <p>Loading contents...</p>
    </ContentLoadingSelf>
  );
}

const PageLoadingSelf = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};
  height: 100vh;
  padding: ${variableGlsp()};
  background: ${themeVal('color.surface')};

  > div {
    background: ${themeVal('color.base-100')};
    ${pulsingAnimation}
  }

  > div:nth-child(1) {
    height: 10%;
  }

  > div:nth-child(2) {
    height: 25%;
  }

  > div:nth-child(3) {
    flex-grow: 1;
  }

  p {
    ${visuallyHidden()}
  }
`;

export function PageLoading() {
  return (
    <PageLoadingSelf>
      <div />
      <div />
      <div />
      <p>Loading page...</p>
    </PageLoadingSelf>
  );
}

export const MapLoading = (props) => {
  return (
    <MapLoadingWrapper {...props}>
      <LoadingSkeleton />
      <LoadingSkeleton />
      <LoadingSkeleton />
    </MapLoadingWrapper>
  );
};

export const ChartLoading = (props: { message: React.ReactNode }) => {
  return (
    <ChartLoadingWrapper>
      <CollecticonChartLine size='xlarge' />
      <p>{props.message}</p>
    </ChartLoadingWrapper>
  );
};
