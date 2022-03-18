/* eslint-disable prettier/prettier */
import styled, { keyframes, css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

const pulse = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

interface LoadingSkeletonProps {
  inline?: boolean;
  width?: number;
  size?: 'large';
  variation?: 'light';
  type?: 'heading';
}

export const LoadingSkeleton = styled.span<LoadingSkeletonProps>`
  display: ${({ inline }) => (inline ? 'inline-block' : 'block')};
  background: ${themeVal('color.base-100')};
  height: 1rem;
  width: ${({ width }) => (width || 1) * 100}%;
  animation: ${pulse} 0.8s ease 0s infinite alternate;

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

export const MapLoading = styled.div<MapLoadingProps>`
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
