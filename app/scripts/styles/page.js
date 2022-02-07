import { Overline, Subtitle } from '@devseed-ui/typography';
import styled from 'styled-components';

import { VarHeading } from './variable-components';
import { variableBaseType } from './variable-utils';

export const PageMainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const PageMainTitle = styled(VarHeading).attrs({
  as: 'h1',
  size: 'xxlarge'
})`
  /* styled-component */
`;

export const PageOverline = styled(Overline)`
  order: -1;
  font-size: ${variableBaseType('0.75rem')};

  > * {
    line-height: inherit;
  }
`;

export const PageSubtitle = styled(Subtitle)`
  /* styled-component */
`;
