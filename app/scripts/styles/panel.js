import styled, { css } from 'styled-components';

import { themeVal, visuallyHidden } from '@devseed-ui/theme-provider';
import { createOverlineStyles } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { variableGlsp } from './variable-utils';

export const Panel = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  background: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  width: 24rem;
  margin-left: -24rem;

  ${({ revealed }) =>
    revealed &&
    css`
      margin: 0;
    `}
`;

export const PanelHeader = styled.div`
  position: relative;
`;

export const PanelHeadline = styled.div`
  ${visuallyHidden}
  padding: ${variableGlsp()};
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

export const PanelBody = styled.div`
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
  box-shadow: 0 1px 0 0 ${themeVal('color.base-100a')}, 0 -1px 0 0 ${themeVal('color.base-100a')};
`;

export const PanelWidgetHeader = styled.div`
  /* styled-component */
`;

export const PanelWidgetTitle = styled.h3`
  ${createOverlineStyles()}
`;


export const PanelWidgetBody = styled.div`
  /* styled-component */
`;