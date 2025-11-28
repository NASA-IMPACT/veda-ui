import React, { ReactNode } from 'react';
import styled, { useTheme } from 'styled-components';
import { Icon } from '@trussworks/react-uswds';
import { themeVal } from '@devseed-ui/theme-provider';

import { variableGlsp } from '$styles/variable-utils';

function EmptyHub(props: { children: ReactNode }) {
  const theme = useTheme();

  const { children, ...rest } = props;

  return (
    <div {...rest}>
      <Icon.ContactPage size={7} color={theme.color?.['base-400']} />
      {children}
    </div>
  );
}

export default styled(EmptyHub)`
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
