import React from 'react';
import styled from 'styled-components';
import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import MapBlock from '$components/common/blocks/block-map';

const DemoMap = styled(MapBlock)`
  height: 40rem;
`;

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
  height: 42rem;
`;

function SandboxMapBlock() {
  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <DemoMap
            datasetId='no2'
            layerId='no2-monthly'
            dateTime='2020-03-01'
            compareDateTime='2018-03-01'
            projectionId='equirectangular'
            allowProjectionChange
            isComparing={true}
          />
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxMapBlock;
