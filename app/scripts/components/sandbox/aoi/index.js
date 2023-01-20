import React, { useRef } from 'react';
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
  const mapRef = useRef();
  const { aoi, onAoiEvent } = useAoiControls(mapRef);

  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <AoiControls
            fc={aoi.fc}
            selected={aoi.selected}
            drawing={aoi.drawing}
            onAoiChange={onAoiEvent}
          />
          <DemoMap aoi={aoi} onAoiChange={onAoiEvent} ref={mapRef} />
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxAOI;
