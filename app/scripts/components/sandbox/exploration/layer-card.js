import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSetAtom } from 'jotai';
import { GridContainer, Grid, Modal } from '@trussworks/react-uswds';
import { mockRawData, mockDatasets } from './mock-data';
import { PageMainContent } from '$styles/page';

import { externalDatasetsAtom } from '$components/exploration/atoms/datasetLayers';
import useTimelineDatasetAtom from '$components/exploration/hooks/use-timeline-dataset-atom.tsx';
import DataLayerCard, {
  DataLayerCardWithSync
} from '$components/exploration/components/datasets/data-layer-card';
import { ExplorationMap } from '$components/exploration/components/map';
export const HugResetter = styled.div`
  /* To escape from HUG grid */
`;

const mockSelectedDay = new Date('2017-12-01T00:00:00.000Z');

/* @TODO: This component is not working, leaving to investigate more later */
// eslint-disable-next-line no-unused-vars
function ExampleComponent(props) {
  const { timelineDatasets } = props;
  const oneDataset = [timelineDatasets[0]];
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Grid row gap={3}>
      <Grid col={6}>
        {oneDataset.map((dataset) => (
          <DataLayerCard
            key={dataset.data.id}
            dataset={dataset}
            isVisible={isVisible}
            setVisible={setIsVisible}
          />
        ))}
      </Grid>
      <Grid
        col={6}
        style={{
          backgroundColor: 'red',
          width: '100px',
          height: '100px',
          display: isVisible ? 'block' : 'none'
        }}
      >
        Something is visible
      </Grid>
    </Grid>
  );
}

function SandboxExplorationMap() {
  const setExternalDatasets = useSetAtom(externalDatasetsAtom);
  const modalRef = useRef(null);
  setExternalDatasets(mockRawData);
  const [timelineDatasets, setTimelineDatasets] = useTimelineDatasetAtom();
  const [modalInfo, setModalInfo] = useState(null);

  useEffect(() => {
    // IF no data came through URL
    if (timelineDatasets.length == 0) {
      setTimelineDatasets([...mockDatasets]);
    }
  }, [setTimelineDatasets, timelineDatasets.length]);

  const onLayerInfoClick = (info) => {
    setModalInfo(info);
    if (modalRef.current) {
      modalRef.current.toggleModal(null, true);
    }
  };
  return (
    <PageMainContent>
      <HugResetter>
        <GridContainer id='grid-contianer'>
          <h2 className='margin-top-5 margin-bottom-2'>
            Layer card in sync with Map
          </h2>
          <Grid row gap={3}>
            <Grid style={{ height: '300px' }} col={6}>
              <ExplorationMap
                datasets={timelineDatasets}
                setDatasets={setTimelineDatasets}
                selectedDay={mockSelectedDay}
              />
            </Grid>
            <Grid col={6}>
              {timelineDatasets.map((dataset) => (
                <DataLayerCardWithSync
                  key={dataset.data.id}
                  dataset={dataset}
                  setLayerInfo={onLayerInfoClick}
                />
              ))}
            </Grid>
          </Grid>
          <h2 className='margin-top-5 margin-bottom-2'>
            Layer Card as an independent component
          </h2>
          <p> wip...</p>
          {timelineDatasets.length > 0 && (
            <ExampleComponent timelineDatasets={timelineDatasets} />
          )}
        </GridContainer>

        <Modal
          ref={modalRef}
          id='example-modal-1'
          aria-labelledby='modal-1-heading'
          aria-describedby='modal-1-description'
        >
          <div className='usa-prose'>
            <p id='modal-1-description'>{JSON.stringify(modalInfo)}</p>
          </div>
        </Modal>
      </HugResetter>
    </PageMainContent>
  );
}

export default SandboxExplorationMap;
