import styled from 'styled-components';

import { Overline } from '@devseed-ui/typography';

import { VarHeading, VarLead } from './variable-components';
import { variableBaseType } from './variable-utils';

export const PageMainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const PageMainTitle = styled(VarHeading).attrs((props) => ({
  as: props.as || 'h1',
  size: props.size || 'xxlarge'
}))`
  /* styled-component */
`;

export const PageOverline = styled(Overline)`
  order: -1;
  color: inherit;
  font-size: ${variableBaseType('0.75rem')};
  line-height: ${variableBaseType('1rem')};
  opacity: 0.64;

  > * {
    line-height: inherit;
  }
`;

export const PageLead = styled(VarLead)`
  color: inherit;
`;

export const PageActions = styled.div`
  /* styled-component */
`;
