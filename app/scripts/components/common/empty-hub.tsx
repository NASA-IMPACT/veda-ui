import React, { ReactNode } from 'react';
import styled, { useTheme } from 'styled-components';
import { CollecticonPage } from '@devseed-ui/collecticons';
import { themeVal } from '@devseed-ui/theme-provider';

import { variableGlsp } from '$styles/variable-utils';

const EmptyHubWrapper = styled.div`
  max-width: 100%;
  grid-column: 1/-1;
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: ${variableGlsp(5, 1)};
  border-radius: ${themeVal('shape.rounded')};
  border: 1px dashed ${themeVal('color.base-300')};
  gap: ${variableGlsp(1)};
`;

export default function EmptyHub(props: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <EmptyHubWrapper>
      <CollecticonPage size='xxlarge' color={theme.color!['base-400']} />
      {props.children}
    </EmptyHubWrapper>
  );
}