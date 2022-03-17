import styled, { keyframes, css } from 'styled-components';
import T from 'prop-types';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

const pulse = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

export const LoadingSkeleton = styled.span`
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
  ${({ type }) =>
    type === 'heading' &&
    css`
      background: ${themeVal('color.base-200')};
      ${({ variation }) =>
        variation === 'light' && 'background: rgba(#fff, 0.80);'}
    `}
`;

LoadingSkeleton.propTypes = {
  type: T.string,
  variation: T.string,
  size: T.string,
  width: T.number,
  inline: T.bool
};

export const LoadingSkeletonGroup = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${glsp(0.5)};
`;

LoadingSkeletonGroup.propTypes = {
  style: T.object,
  children: T.node
};
