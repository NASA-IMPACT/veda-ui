import {
  CollecticonArrowMove,
  CollecticonEqual
} from '@devseed-ui/collecticons';
import { themeVal } from '@devseed-ui/theme-provider';
import React, { useRef } from 'react';
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

  .resize-handle {
    flex: 0 0 1.5em;
    position: relative;
    outline: none;
    display: flex;
    background: ${themeVal('color.base-100')};
    align-items: center;
    justify-content: center;
  }
`;

function SandboxTimeline() {
  return (
    <Container>
      <PanelGroup direction='vertical' className='panel-wrapper'>
        <Panel maxSize={75} className='panel'>
            <div>
              Top
            </div>
        </Panel>
        <PanelResizeHandle className='resize-handle'>
          <CollecticonEqual />
        </PanelResizeHandle>
        <Panel maxSize={75} className='panel'>
          <Timeline />
        </Panel>
      </PanelGroup>
    </Container>
  );
}

export default SandboxTimeline;
