import React from 'react';
import styled from 'styled-components';

import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import { ComponentOverride } from '$components/common/page-overrides';
import { VarProse } from '$styles/variable-components';

const Wrapper = styled.div`
  grid-column: 1 / -1;
`;

function SandboxOverride() {
  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <ComponentOverride
            with='sandbox-override'
            from='sandbox'
            prop2='yet another prop'
          >
            <VarProse>
              <p>
                If you are seeing this message, the page override for{' '}
                <code>sandbox-override</code> is not setup.
              </p>
              <p>
                Create a file called <code>sandbox-override.js</code> and add
                the correct path to the <code>veda.config.js</code> file.
              </p>
              <p>Something like:</p>
              <p>
                <code>
                  <pre>
                    {` // Other configuration before this.
pageOverrides: {
   'sandbox-override': 'path-to-file.mdx'
}`}
                  </pre>
                </code>
              </p>
            </VarProse>
          </ComponentOverride>
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxOverride;
