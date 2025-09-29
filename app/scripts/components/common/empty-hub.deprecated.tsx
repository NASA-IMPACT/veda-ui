import React, { ReactNode } from 'react';
import styled, { useTheme } from 'styled-components';
import { CollecticonPage } from '@devseed-ui/collecticons';
import { themeVal } from '@devseed-ui/theme-provider';

import { variableGlsp } from '$styles/variable-utils';

/**
 * @deprecated This component uses collecticons. Use the main EmptyHub component instead.
 * This file is kept for migration comparison purposes.
 */
function EmptyHubDeprecated(props: { children: ReactNode }) {
  const theme = useTheme();

  const { children, ...rest } = props;

  return (
    <div {...rest}>
      <CollecticonPage size='xxlarge' color={theme.color!['base-400']} />
      {children}
    </div>
  );
}

export default styled(EmptyHubDeprecated)`
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
