import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { CollecticonArea, CollecticonTrashBin } from '@devseed-ui/collecticons';
import { VerticalDivider } from '@devseed-ui/toolbar';

import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import MapboxMap from '$components/common/mapbox';
import { Toolbar, ToolbarIconButton } from '$utils/devseed-ui';

const DemoMap = styled(MapboxMap)`
  height: 40rem;
`;

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
`;

function SandboxAOI() {
  const [aoi, setAoi] = useState({
    drawing: false,
    selected: false,
    feature: null,
    actionOrigin: null
  });

  const onPanelAction = useCallback((action, payload) => {
    switch (action) {
      case 'aoi.draw-click':
        // There can only be one selection (feature) on the map
        // If there's a feature toggle the selection.
        // If there's no feature toggle the drawing.
        setAoi((state) => {
          const selected = !!state.feature && !state.selected;
          return {
            ...state,
            drawing: !state.feature && !state.drawing,
            selected,
            actionOrigin: selected ? 'panel' : null
          };
        });
        break;
      // case 'aoi.set-bounds':
      //   setAoi((state) => ({
      //     ...state,
      //     feature: updateFeatureBounds(state.feature, payload.bounds),
      //     actionOrigin: 'panel'
      //   }));
      //   break;
      case 'aoi.clear':
        setAoi({
          drawing: false,
          selected: false,
          feature: null,
          actionOrigin: null
        });
        break;
    }
  }, []);

  const onAction = useCallback((action, payload) => {
    switch (action) {
      case 'aoi.draw-finish':
        setAoi((state) => ({
          ...state,
          drawing: false,
          feature: payload.feature,
          actionOrigin: 'map'
        }));
        break;
      case 'aoi.selection':
        setAoi((state) => ({
          ...state,
          selected: payload.selected,
          actionOrigin: payload.selected ? 'map' : null
        }));
        break;
      case 'aoi.update':
        setAoi((state) => ({
          ...state,
          feature: payload.feature,
          actionOrigin: 'map'
        }));
        break;
    }
  }, []);

  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <Toolbar>
            <ToolbarIconButton
              onClick={() => onPanelAction('aoi.clear')}
              disabled={!aoi.feature}
            >
              <CollecticonTrashBin meaningful title='Clear AOI' />
            </ToolbarIconButton>
            <VerticalDivider variation='dark' />
            <ToolbarIconButton
              useIcon='draw-rectangle'
              onClick={() => onPanelAction('aoi.draw-click')}
              active={aoi.selected || aoi.drawing}
            >
              <CollecticonArea meaningful title='AOI' />
            </ToolbarIconButton>
          </Toolbar>
          <DemoMap aoi={aoi} onAoiChange={onAction} />
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxAOI;
