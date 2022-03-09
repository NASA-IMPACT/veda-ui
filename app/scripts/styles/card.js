import styled from 'styled-components';

import {
  glsp,
  listReset,
  media,
  multiply,
  themeVal
} from '@devseed-ui/theme-provider';

import { variableBaseType, variableGlsp } from './variable-utils';
import { VarHeading } from './variable-components';
import { Overline } from '@devseed-ui/typography';

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

export const Card = styled.article`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  border-radius: ${multiply(themeVal('shape.rounded'), 2)};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  height: 100%;
  overflow: hidden;
  transition: all 0.24s ease-in-out 0s;

  /* > * {
    padding: ${glsp()};
  } */
`;

export const CardHeader = styled.header`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};
  padding: ${variableGlsp()};
`;

export const CardTitle = styled(VarHeading).attrs({
  as: 'h3',
  size: 'medium'
})`
  /* styled-component */
`;

export const CardOverline = styled(Overline)`
  order: -1;
  color: inherit;
  font-size: ${variableBaseType('0.75rem')};
  line-height: ${variableBaseType('1rem')};

  > * {
    line-height: inherit;
  }
`;

export const CardBody = styled.div`
  padding: ${variableGlsp()};
`;
