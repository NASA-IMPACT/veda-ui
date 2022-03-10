import styled, { css } from 'styled-components';

import {
  glsp,
  listReset,
  media,
  multiply,
  themeVal
} from '@devseed-ui/theme-provider';
import { Overline, Subtitle } from '@devseed-ui/typography';

import { variableGlsp } from './variable-utils';
import { VarHeading } from './variable-components';

import { Figure } from '$components/common/figure';

export const CardList = styled.ol`
  ${listReset()}
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${variableGlsp()};

  ${media.mediumUp`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.largeUp`
    grid-template-columns: repeat(3, 1fr);
  `}
`;

function renderCardType({ cardType }) {
  switch (cardType) {
    case 'cover':
      return css`
        padding-top: ${variableGlsp()};
        color: ${themeVal('color.surface')};
        justify-content: flex-end;

        ${CardFigure} {
          position: absolute;
          inset: 0;
          z-index: -1;
          background: ${themeVal('color.base-400')};
        }
      `;
    default:
      return css`
        background: transparent;
      `;
  }
}

export const Card = styled.article`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  border-radius: ${multiply(themeVal('shape.rounded'), 2)};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  height: 100%;
  overflow: hidden;
  transition: all 0.24s ease-in-out 0s;

  ${renderCardType}

  ${({ isStateFocus }) =>
    isStateFocus &&
    css`
      box-shadow: ${themeVal('boxShadow.elevationC')};
      transform: translate(0, 0.125rem);
    `}
  ${({ isStateOver }) =>
    isStateOver &&
    css`
      box-shadow: ${themeVal('boxShadow.elevationC')};
      transform: translate(0, 0.125rem);
    `}
  ${({ isStateActive }) =>
    isStateActive &&
    css`
      box-shadow: ${themeVal('boxShadow.elevationB')};
      transform: translate(0, 0.125rem);
    `}
`;

export const CardHeader = styled.header`
  display: flex;
  flex-flow: column nowrap;
  padding: ${variableGlsp()};
  gap: ${glsp(0.25)};
`;

export const CardTitle = styled(VarHeading).attrs({
  as: 'h3',
  size: 'small'
})`
  /* styled-component */
`;

export const CardOverline = styled(Overline)`
  order: -1;
  color: inherit;

  > * {
    line-height: inherit;
  }
`;

export const CardSubtitle = styled(Subtitle)`
  color: inherit;

  > * {
    line-height: inherit;
  }
`;

export const CardLabel = styled.span`
  position: absolute;
  top: ${variableGlsp()};
  right: ${variableGlsp()};
  display: inline-block;
  vertical-align: top;
  color: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: ${glsp(0.125, 0.5)};
  background: ${themeVal('color.base-400a')};
  pointer-events: auto;
  transition: all 0.24s ease 0s;

  &,
  &:visited {
    text-decoration: none;
  }

  &:hover {
    opacity: 0.64;
  }
`;

export const CardBody = styled.div`
  padding: ${variableGlsp()};

  &:not(:first-child) {
    padding-top: 0;
    margin-top: ${variableGlsp(-0.5)};
  }
`;

export const CardFigure = styled(Figure)`
  order: -1;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
  }
`;
