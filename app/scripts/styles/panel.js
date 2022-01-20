import styled from 'styled-components';

import { themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from './variable-utils';

export const Panel = styled.div`
  background: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationD')};
`;

export const PanelHeader = styled.div`
  padding: ${variableGlsp()};
`;

export const PanelTitle = styled.h2`
  /* styled-component */
`;

export const PanelBody = styled.div`
  /* styled-component */
`;

export const PanelWidget = styled.div`
  padding: ${variableGlsp()};
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
