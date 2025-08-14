import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { GridContainer, Grid, Modal } from '@trussworks/react-uswds';
import { mockRawData, mockDatasets } from '../mock-data';
import ExternalLayerCardExample from './external-layer-card';
import InfoTableViewExample from './external-info-table-example';
import { PageMainContent } from '$styles/page';
import { ExplorationAndAnalysisCompound } from '$components/exploration/compound';
import { useEACompoundState } from '$components/exploration/compound/hooks';

export const HugResetter = styled.div`
  /* To escape from HUG grid */
`;

const mockSelectedDay = new Date('2013-12-01T00:00:00.000Z');

function SandboxExplorationAndAnalysis() {
  const modalRef = useRef(null);
  const [modalInfo, setModalInfo] = useState(null);

  const {
    eaDatasets,
    setEaDatasets,
    setSelectedDay,
    selectedDay,
    selectedCompareDay,
    setSelectedCompareDay
  } = useEACompoundState(mockRawData);

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

  const EACompoundSystemFull = () => (
    <ExplorationAndAnalysisCompound
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
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
  );

  const EACompoundSystemPartial = () => (
    <>
      <ExplorationAndAnalysisCompound
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
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
            <h4>External Layer Cards</h4>
            {eaDatasets.map((dataset) => (
              <ExternalLayerCardExample
                key={dataset.data.id}
                dataset={dataset}
                setLayerInfo={onLayerInfoClick}
              />
            ))}
          </Grid>
          <h4>Timeline with External Layer Cards</h4>
          <ExplorationAndAnalysisCompound.Timeline
            panelHeight={300}
            LayerCard={ExternalLayerCardExample}
          />
        </Grid>
      </ExplorationAndAnalysisCompound>
      <br />
      <h4>Table outside of EA Compound Provider but uses EA Compound State</h4>
      <InfoTableViewExample rawDatasets={mockRawData} />{' '}
      {/* This is a showcase example of just using the larger hook wrapper (atom hooks only) so no need to be wrapped in provider. */}
    </>
  );

  return (
    <PageMainContent>
      <HugResetter>
        <GridContainer id='grid-contianer'>
          <h2 className='margin-top-5 margin-bottom-2'>
            E&A Compound System (Full)
          </h2>
          {EACompoundSystemFull()}
        </GridContainer>
        <GridContainer id='grid-contianer'>
          <h2 className='margin-top-5 margin-bottom-2'>
            E&A Compound System (Partial)
          </h2>
          {EACompoundSystemPartial()}
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
