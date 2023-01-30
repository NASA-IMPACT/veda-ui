import styled, { css } from 'styled-components';
import { glsp, multiply, themeVal } from '@devseed-ui/theme-provider';
import { createSubtitleStyles, Heading } from '@devseed-ui/typography';
import { Toolbar } from '@devseed-ui/toolbar';

import { variableGlsp } from '$styles/variable-utils';

export type PopoverAnchor =
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export const POPOVER_SHOW_HIDE_ANIM_TIME = 240;

const applyBorderStyles = ({ anchor }: { anchor: PopoverAnchor }) => {
  return {
    'top-left': css`
      border-top-left-radius: 0;
    `,
    'top-right': css`
      border-top-right-radius: 0;
    `,
    'bottom-left': css`
      border-bottom-left-radius: 0;
    `,
    'bottom-right': css`
      border-bottom-right-radius: 0;
    `
  }[anchor];
};

const applyAnchorStyles = ({ anchor }: { anchor: PopoverAnchor }) => {
  const centerClip = 'clip-path: polygon(50% 0, 0% 100%, 100% 100%);';
  const cornerClip = 'clip-path: polygon(0 0, 0% 100%, 100% 100%);';

  if (anchor === 'top' || anchor === 'bottom') {
    const common = css`
      ${centerClip}
      left: 50%;
      width: 1rem;
      aspect-ratio: 2/1;
    `;
    if (anchor === 'top') {
      return css`
        ${common}
        bottom: 100%;
        transform: translate(-50%, 0);
      `;
    } else {
      // anchor === 'bottom'
      return css`
        ${common}
        top: 100%;
        transform: scaleY(-1) translate(-50%, 0);
      `;
    }
  } else {
    const common = css`
      ${cornerClip}
      width: 0.75rem;
      height: 0.75rem;
      pointer-events: none;
    `;

    if (anchor === 'top-left') {
      return css`
        ${common}
        bottom: 100%;
        left: 0;
      `;
    }
    if (anchor === 'top-right') {
      return css`
        ${common}
        bottom: 100%;
        right: 0;
        transform: scaleX(-1);
      `;
    }
    if (anchor === 'bottom-left') {
      return css`
        ${common}
        top: 100%;
        left: 0;
        transform: scaleY(-1);
      `;
    }
    // anchor === 'bottom-right'
    return css`
      ${common}
      top: 100%;
      right: 0;
      transform: scaleX(-1) scaleY(-1);
    `;
  }
};

export const getAnchorTranslate = (pos) =>
  ({
    center: 'translate(-50%,-50%)',
    top: 'translate(-50%,0)',
    'top-left': 'translate(0,0)',
    'top-right': 'translate(-100%,0)',
    bottom: 'translate(-50%,-100%)',
    'bottom-left': 'translate(0,-100%)',
    'bottom-right': 'translate(-100%,-100%)',
    left: 'translate(0,-50%)',
    right: 'translate(-100%,-50%)'
  }[pos]);

const getTransition = (isShowing) => {
  const easing = isShowing
    ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' // easeOutBack
    : 'cubic-bezier(0.6, -0.28, 0.735, 0.045)'; // easeInBack
  return css`
    transition: transform ${POPOVER_SHOW_HIDE_ANIM_TIME}ms ${easing},
      opacity ${POPOVER_SHOW_HIDE_ANIM_TIME}ms ease-in-out;
  `;
};

export const Popover = styled.article`
  padding: 0.75rem 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

export const PopoverContents = styled.div<{
  verticalAttachment?: 'top' | 'bottom';
  anchor: PopoverAnchor;
}>`
  border-radius: ${themeVal('shape.rounded')};
  background: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  transform: scale(1);
  transform-origin: center
    ${({ verticalAttachment: va }) => (va === 'top' ? 'top' : 'bottom')};

  ${applyBorderStyles}

  &::before {
    content: '';
    position: absolute;
    background: #fff;

    ${applyAnchorStyles}
  }

  > *:last-child {
    margin-bottom: 0;
  }

  .popover-gl-enter & {
    ${getTransition(true)}
    transform: scale(0);
    opacity: 0;
  }

  .popover-gl-enter-active & {
    transform: scale(1);
    opacity: 1;
  }

  .popover-gl-exit & {
    ${getTransition(false)}
    transform: scale(1);
    opacity: 1;
  }

  .popover-gl-exit-active & {
    transform: scale(0);
    opacity: 0;
  }
`;

export const PopoverHeader = styled.header`
  position: relative;
  z-index: 9999;
  display: flex;
  gap: ${variableGlsp(0.5, 1)};
  padding: 0.75rem;

  &::before {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    content: '';
    pointer-events: none;
    height: 1px;
    background: ${themeVal('color.base-200a')};
  }

  ${Toolbar} {
    margin-left: auto;
  }
`;

export const PopoverHeadline = styled.div`
  grid-row: 1;
  min-width: 0px;
  display: grid;
  justify-content: start;
  align-items: center;
  grid-gap: 0.5rem;

  > * {
    grid-row: 1;
  }
`;

export const PopoverTitle = styled(Heading)`
  font-size: 1rem;
  line-height: 1.5rem;
  margin: 0;
`;

export const PopoverSubtitle = styled.p<{ isSup: boolean }>`
  order: ${({ isSup }) => (isSup ? -1 : 1)};
  ${createSubtitleStyles()}
`;

export const PopoverBody = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(0.75)};
  padding: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

export const PopoverFooter = styled.footer`
  padding: 0 0.75rem 0.75rem 0.75rem;
  display: flex;
  flex-flow: column;
  gap: ${glsp()};
`;
