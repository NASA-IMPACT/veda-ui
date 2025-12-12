import styled from 'styled-components';
import { media, themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from './variable-utils';

const Constrainer = styled.div`
  display: grid;
  gap: ${variableGlsp()};
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  max-width: ${themeVal('layout.max')};
  margin: 0 auto;
  padding-left: ${variableGlsp()};
  padding-right: ${variableGlsp()};

  ${media.mediumUp`
    grid-template-columns: repeat(8, 1fr);
  `}

  ${media.largeUp`
    grid-template-columns: repeat(12, 1fr);
  `}
`;

export default Constrainer;
