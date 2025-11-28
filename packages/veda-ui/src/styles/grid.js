import styled from 'styled-components';
import { variableGlsp } from './variable-utils';

export const GridTemplateFull = styled.div`
  display: grid;
  grid-column: 1/-1;
  grid-template-columns: repeat(1, 1fr);
  gap: ${variableGlsp()};
`;

export const GridTemplateHalf = styled.div`
  display: grid;
  grid-column: 1/-1;
  grid-template-columns: repeat(2, 1fr);
  gap: ${variableGlsp()};
`;

export const GridTemplateQuarter = styled.div`
  display: grid;
  grid-column: 1/-1;
  grid-template-columns: repeat(4, 1fr);
  gap: ${variableGlsp()};
`;
