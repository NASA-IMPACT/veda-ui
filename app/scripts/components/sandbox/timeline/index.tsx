import { themeVal } from '@devseed-ui/theme-provider';
import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';

import Timeline from './timeline';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  flex-grow: 1;

  .panel-wrapper {
    flex-grow: 1;
  }

  .panel {
    display: flex;
    flex-direction: column;
  }

  .panel-timeline {
    box-shadow: 0 -1px 0 0 ${themeVal('color.base-100')};
  }

  .resize-handle {
    flex: 0;
    position: relative;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    margin: 0 auto -1.25rem auto;
    padding: 0.25rem 0;
    z-index: 5000;

    ::before {
      content: '';
      display: block;
      width: 2rem;
      background: ${themeVal('color.base-200')};
      height: 0.25rem;
      border-radius: ${themeVal('shape.ellipsoid')};
    }
  }
`;

function SandboxTimeline() {
  return (
    <Container>
      <PanelGroup direction='vertical' className='panel-wrapper'>
        <Panel maxSize={75} className='panel'>
          <div>Top</div>
        </Panel>
        <PanelResizeHandle className='resize-handle' />
        <Panel maxSize={75} className='panel panel-timeline'>
          <Timeline />
        </Panel>
      </PanelGroup>
    </Container>
  );
}

export default SandboxTimeline;
