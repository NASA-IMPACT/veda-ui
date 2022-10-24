import styled from 'styled-components';

import { Overline, Subtitle } from '@devseed-ui/typography';

import { variableGlsp } from './variable-utils';

export const Legend = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${variableGlsp(0.5)};
`;

export const LegendTitle = styled(Overline).attrs({
  as: 'h3'
})`
  /* styled-component */
`;

export const LegendList = styled.dl`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${variableGlsp(0.5)};
`;

export const LegendSwatch = styled.dt`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LegendLabel = styled(Subtitle).attrs({
  as: 'dd'
})`
  margin-left: ${variableGlsp(-0.25)};
`;
