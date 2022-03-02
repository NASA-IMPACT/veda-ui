import React from 'react';
import styled from 'styled-components';

import { themeVal } from '@devseed-ui/theme-provider';

import Hug from '$styles/hug';
import { variableGlsp } from '$styles/variable-utils';
import { VarProse } from '$styles/variable-components';

const ContentBlock = styled(Hug)`
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};
`;

const ContentBlockInner = styled(VarProse)`
  grid-column: content-start / content-end;
  background: ${themeVal('color.surface')};
`;

function SandboxContentBlocks() {
  return (
    <ContentBlock>
      <ContentBlockInner>
        <p>Content goes here.</p>
      </ContentBlockInner>
    </ContentBlock>
  );
}

export default SandboxContentBlocks;
