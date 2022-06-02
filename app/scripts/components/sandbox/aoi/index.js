import React from 'react';
import styled from 'styled-components';

import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import MapboxMap from '$components/common/mapbox';
import AoiControls from '$components/common/aoi/controls';
import { useAoiControls } from '$components/common/aoi/use-aoi-controls';

const DemoMap = styled(MapboxMap)`
  height: 40rem;
`;

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
`;

function SandboxAOI() {
  const { aoi, onAoiEvent } = useAoiControls();

  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <AoiControls
            feature={aoi.feature}
            selected={aoi.selected}
            drawing={aoi.drawing}
            onAoiChange={onAoiEvent}
          />
          <DemoMap aoi={aoi} onAoiChange={onAoiEvent} />
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxAOI;
