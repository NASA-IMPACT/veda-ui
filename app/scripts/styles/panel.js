import styled, { css } from 'styled-components';

import { media, themeVal, visuallyHidden } from '@devseed-ui/theme-provider';
import { Overline } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';
import { variableGlsp } from './variable-utils';

const panelWidth = {
  xsmall: '20rem',
  small: '22rem',
  medium: '24rem'
};

export const PANEL_REVEAL_DURATION = 240;

export const Panel = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: ${panelWidth.xsmall};
  margin-left: -${panelWidth.xsmall};
  transition: margin ${PANEL_REVEAL_DURATION}ms ease 0s;

  ${media.smallUp`
    width: ${panelWidth.small};
    margin-left: -${panelWidth.small};
  `}

  ${media.mediumUp`
    width: ${panelWidth.medium};
    margin-left: -${panelWidth.medium};
  `}

  ${media.mediumDown`
    position: absolute;
    inset: 0;
  `}

  ${({ revealed }) =>
    revealed &&
    css`
      & {
        margin-left: 0;
      }
    `}

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    background: transparent;
    width: 0;
    height: 100%;
    transition: background 0.64s ease 0s;

    ${({ revealed }) =>
      revealed &&
      css`
        ${media.mediumDown`
          background: ${themeVal('color.base-400a')};
          width: 200vw;
        `}
      `}
  }
`;

export const PanelInner = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationD')};
`;

export const PanelHeader = styled.div`
  position: relative;
`;

export const PanelHeadline = styled.div`
  ${visuallyHidden}
`;

export const PanelActions = styled.div`
  /* styled-component */
`;

export const PanelTitle = styled.h2`
  /* styled-component */
`;

export const PanelToggle = styled(Button)`
  position: absolute;
  top: ${variableGlsp()};
  left: calc(100% + ${variableGlsp()});
`;

export const PanelBody = styled(ShadowScrollbar)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const PanelWidget = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${variableGlsp(0.25)};
  padding: ${variableGlsp(0.5, 1)};
  background: ${themeVal('color.surface')};
  box-shadow: 0 1px 0 0 ${themeVal('color.base-100a')},
    0 -1px 0 0 ${themeVal('color.base-100a')};
`;

export const PanelWidgetHeader = styled.div`
  /* styled-component */
`;

export const PanelWidgetTitle = styled(Overline).attrs({
  as: 'h3'
})`
  /* styled-component */
`;

export const PanelWidgetBody = styled.div`
  /* styled-component */
`;
