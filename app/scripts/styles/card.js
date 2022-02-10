import styled from 'styled-components';

import { glsp, listReset, media, themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from './variable-utils';

export const CardList = styled.ul`
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
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  height: 100%;
  overflow: hidden;
  transition: all 0.24s ease-in-out 0s;

  > * {
    padding: ${glsp()};
  }
`;
