import React from 'react';
import styled from 'styled-components';

import UniversalGridder from '$styles/universal-gridder';

import { PageMainContent } from '../../../styles/page';

const UniGrid = styled(UniversalGridder)`
  padding: 1rem 0;
  ${({ c }) => `background-color: ${c}`}
`;

const Content = styled.div`
  grid-column: 1 / -1;
`;

function SandboxUniGridder() {
  return (
    <PageMainContent>
      <UniGrid c='#9fd2ea'>
        <UniGrid
          c='#f9b057'
          grid={{
            smallUp: ['full-start', 'full-end'],
            mediumUp: ['content-start', 'content-4'],
            largeUp: ['content-2', 'content-5']
          }}
        >
          <Content>
            smallUp: full-start/full-end
            <br />
            mediumUp: content-start/content-4
            <br />
            largeUp: content-2/content-5
          </Content>
        </UniGrid>
        <UniGrid
          c='#d65555'
          grid={{
            smallUp: ['full-start', 'full-end'],
            mediumUp: ['full-start', 'full-end'],
            largeUp: ['content-6', 'full-end']
          }}
        >
          <Content>
            smallUp: full-start/full-end
            <br />
            mediumUp: full-start/full-end
            <br />
            largeUp: content-6/full-end
          </Content>
        </UniGrid>
        <UniGrid c='#7ea059' grid={['full-start', 'full-end']}>
          <Content>Always full-start/full-end</Content>
        </UniGrid>
      </UniGrid>
    </PageMainContent>
  );
}

export default SandboxUniGridder;
