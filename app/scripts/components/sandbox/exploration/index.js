import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSetAtom, useAtom } from 'jotai';
import { GridContainer, Grid, Modal } from '@trussworks/react-uswds';
import { Button, Card, CardBody, CardFooter } from '@trussworks/react-uswds';

import { mockRawData, mockDatasets } from './mock-data';
import { PageMainContent } from '$styles/page';

import { externalDatasetsAtom } from '$components/exploration/atoms/datasetLayers';
import useTimelineDatasetAtom from '$components/exploration/hooks/use-timeline-dataset-atom.tsx';
import { useTimelineDatasetVisibility } from '$components/exploration/atoms/hooks';
import { useEACompoundState } from '$components/exploration';
// import {
//   selectedCompareDateAtom,
//   selectedDateAtom
// } from '$components/exploration/atoms/dates';
// import { DataLayerCardWithSync } from '$components/exploration/components/datasets/data-layer-card';
// import { ExplorationMap } from '$components/exploration/components/map';
import {
  ExplorationAndAnalysisCompound
  // useEACompoundContext
} from '$components/exploration';

export const HugResetter = styled.div`
  /* To escape from HUG grid */
`;

const mockSelectedDay = new Date('2013-12-01T00:00:00.000Z');
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

function SandboxExplorationAndAnalysis() {
  const modalRef = useRef(null);
  const [modalInfo, setModalInfo] = useState(null);

  const {
    eaDatasets,
    setEaDatasets,
    setEAExternalDatasets,
    setSelectedDay, // @NOTE-SANDRA: When pass this in, it is breaking...
    selectedDay,
    selectedCompareDay,
    setSelectedCompareDay
  } = useEACompoundState();

  setEAExternalDatasets(mockRawData);
  setSelectedDay(mockSelectedDay);

  useEffect(() => {
    // IF no data came through URL
    if (eaDatasets.length == 0) {
      setEaDatasets([...mockDatasets]);
    }
  }, [setEaDatasets, eaDatasets.length]);

  const onLayerInfoClick = (info) => {
    setModalInfo(info);
    if (modalRef.current) {
      modalRef.current.toggleModal(null, true);
    }
  };
  // console.log('selectedDay:', selectedDay);
  return (
    <PageMainContent>
      <HugResetter>
        <GridContainer id='grid-contianer'>
          <h2 className='margin-top-5 margin-bottom-2'>
            Layer card in sync with Map
          </h2>
          <ExplorationAndAnalysisCompound
            selectedDay={selectedDay}
            setSelectedDay={() => true}
            // setSelectedDay={setSelectedDay} // @NOTE-SANDRA: When pass this in, it is breaking...
            selectedCompareDay={selectedCompareDay}
            setSelectedCompareDay={setSelectedCompareDay}
            datasets={eaDatasets}
            setDatasets={setEaDatasets}
          >
            <Grid row gap={3}>
              <Grid style={{ height: '300px' }} col={6}>
                <ExplorationAndAnalysisCompound.Map />
              </Grid>
              <Grid col={6}>
                {eaDatasets.map((dataset) => (
                  <ExplorationAndAnalysisCompound.DataLayerCard
                    key={dataset.data.id}
                    dataset={dataset}
                    setLayerInfo={onLayerInfoClick}
                  />
                ))}
              </Grid>
              <ExplorationAndAnalysisCompound.Timeline panelHeight={300} />
            </Grid>
          </ExplorationAndAnalysisCompound>
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

export default SandboxExplorationAndAnalysis;
