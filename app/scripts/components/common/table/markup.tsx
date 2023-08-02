
import styled from "styled-components";
import { themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

export const tableHeight = '400';

export const PlaceHolderWrapper = styled.div`
  display: flex;
  height: ${tableHeight}px;
  align-items: center;
  justify-content: center;
  font-weight: bold;

`;

export const TableWrapper = styled.div`
  display: flex;
  max-width: 100%;
  max-height: ${tableHeight}px;
  overflow: auto;
`;

export const StyledTable = styled.table`
  border: none;
  border-collapse: collapse;
  thead tr {
    background: ${themeVal('color.base-200')};
    position: sticky;
    top: 0;
    z-index: 0;
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: ${variableGlsp(0.25, 0.5)};
  }

  tbody tr {
    :hover {
      background-color: ${themeVal('color.primary-200')};
    }
  }

  td {
    padding: ${variableGlsp(0.25, 0.5)};
  }
`;
