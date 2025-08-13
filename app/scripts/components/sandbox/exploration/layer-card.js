import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSetAtom } from 'jotai';
import { GridContainer, Grid, Modal } from '@trussworks/react-uswds';
import { Button, Card, CardBody, CardFooter } from '@trussworks/react-uswds';

import { mockRawData, mockDatasets } from './mock-data';
import { PageMainContent } from '$styles/page';

import { externalDatasetsAtom } from '$components/exploration/atoms/datasetLayers';
import useTimelineDatasetAtom from '$components/exploration/hooks/use-timeline-dataset-atom.tsx';
import { useTimelineDatasetVisibility } from '$components/exploration/atoms/hooks';
import { DataLayerCardWithSync } from '$components/exploration/components/datasets/data-layer-card';
import { ExplorationMap } from '$components/exploration/components/map';
export const HugResetter = styled.div`
  /* To escape from HUG grid */
`;

const mockSelectedDay = new Date('2017-12-01T00:00:00.000Z');
function ExampleComponent(props) {
  const { dataset } = props;
  const [isVisible, setIsVisible] = useTimelineDatasetVisibility(
    dataset.data.id
  );

  return (
    <Grid row gap={3}>
      <Grid col={6}>
        <Card>
          <CardBody>
            Dataset Name: {dataset.data.name} <br />
            Current visibility: {isVisible ? 'visible' : 'not visible'}
          </CardBody>
          <CardFooter>
            <Button
              type='button'
              onClick={() => {
                setIsVisible((prev) => {
                  return !prev;
                });
              }}
            >
              Click me to toggle the layer
            </Button>
          </CardFooter>
        </Card>
      </Grid>
    </Grid>
  );
}

function DataLayerCardSet({ timelineDatasets, onChange }) {
  const [modalInfo, setModalInfo] = useState(null);
  const modalRef = useRef(null);
  const onLayerInfoClick = (info) => {
    setModalInfo(info);
    if (modalRef.current) {
      modalRef.current.toggleModal(null, true);
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange({ timelineDataset: timelineDatasets });
    }
  }, [timelineDatasets, onChange]);

  return (
    <React.Fragment>
      {timelineDatasets.map((dataset) => (
        <DataLayerCardWithSync
          key={dataset.data.id}
          dataset={dataset}
          setLayerInfo={onLayerInfoClick}
        />
      ))}
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
    </React.Fragment>
  );
}

function SandboxExplorationMapWithLayerCard() {
  const setExternalDatasets = useSetAtom(externalDatasetsAtom);

  setExternalDatasets(mockRawData);
  const [timelineDatasets, setTimelineDatasets] = useTimelineDatasetAtom();

  useEffect(() => {
    // IF no data came through URL
    if (timelineDatasets.length == 0) {
      setTimelineDatasets([...mockDatasets]);
    }
  }, [setTimelineDatasets, timelineDatasets.length]);

  // eslint-disable-next-line no-console
  const handleChange = useCallback((e) => console.log(e), []);
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
              <DataLayerCardSet
                timelineDatasets={timelineDatasets}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <h2 className='margin-top-5 margin-bottom-2'>
            Custom UI using hooks
          </h2>
          {timelineDatasets.length > 0 && (
            <ExampleComponent dataset={timelineDatasets[0]} />
          )}
        </GridContainer>
      </HugResetter>
    </PageMainContent>
  );
}

export default SandboxExplorationMapWithLayerCard;
