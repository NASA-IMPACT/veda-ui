import styled from 'styled-components';

import { media } from '@devseed-ui/theme-provider';
import { Overline, Subtitle } from '@devseed-ui/typography';

import { VarHeading, VarLead } from './variable-components';
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
  color: inherit;
  font-size: ${variableBaseType('0.75rem')};
  line-height: ${variableBaseType('1rem')};

  > * {
    line-height: inherit;
  }
`;

export const PageSubtitle = styled(Subtitle)`
  color: inherit;
`;

export const PageLead = styled(VarLead)`
  position: relative;
  z-index: 3;
  grid-column: 1 / span 4;
  grid-row: 2;
  color: inherit;

  ${media.mediumUp`
    grid-column: 1 / span 6;
    grid-row: 2;
  `}

  ${media.largeUp`
    grid-column: 7 / span 6;
    grid-row: 1;
  `}
`;
