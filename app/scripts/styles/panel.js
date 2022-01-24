import styled, { css } from 'styled-components';

import { themeVal, visuallyHidden } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { variableGlsp } from './variable-utils';

export const Panel = styled.div`
  position: relative;
  z-index: 10;
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
  /* styled-component */
`;

export const PanelWidget = styled.div`
  padding: ${variableGlsp(0.5, 1)};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.base-100a')};
`;

export const PanelWidgetHeader = styled.div`
  /* styled-component */
`;

export const PanelWidgetBody = styled.div`
  /* styled-component */
`;

export const PanelWidgetTitle = styled.h3`
  /* styled-component */
`;
