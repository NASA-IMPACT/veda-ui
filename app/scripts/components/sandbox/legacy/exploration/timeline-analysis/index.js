import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSetAtom } from 'jotai';
import { GridContainer, Grid } from '@trussworks/react-uswds';
import {
  mockDatasets,
  mockRawData,
  mockSelectedDay,
  mockSelectedCompareDay
} from '../mock-data';
import ExternalLayerCardExample from './external-layer-card';
import { PageMainContent } from '$styles/page';
import { ExplorationMap } from '$components/exploration/components/map';
import { externalDatasetsAtom } from '$components/exploration/atoms/datasetLayers';
import useTimelineDatasetAtom from '$components/exploration/hooks/use-timeline-dataset-atom';

export const HugResetter = styled.div`
  /* To escape from HUG grid */
`;

const DemoExplorationMap = styled(ExplorationMap)`
  height: 40rem;
`;

const SandboxTimelineAnalysis = () => {
  const setEAExternalDatasets = useSetAtom(externalDatasetsAtom);
  setEAExternalDatasets(mockRawData);

  const [timelineDatasets, setTimelineDatasets] = useTimelineDatasetAtom();

  useEffect(() => {
    // IF no data came through URL
    if (timelineDatasets.length == 0) {
      setTimelineDatasets([...mockDatasets]);
    }
  }, [timelineDatasets, setTimelineDatasets]);

  return (
    <PageMainContent>
      <HugResetter>
        <GridContainer id='grid-contianer'>
          <Grid row gap={3}>
            <Grid style={{ height: '300px' }} col={8}>
              <DemoExplorationMap
                datasets={timelineDatasets}
                setDatasets={setTimelineDatasets}
                selectedDay={mockSelectedDay}
                selectedCompareDay={mockSelectedCompareDay}
              />
            </Grid>
            <Grid col={12}>
              <h4>External Layer Cards</h4>
              {timelineDatasets &&
                timelineDatasets.map((dataset) => (
                  <ExternalLayerCardExample
                    key={dataset.data.id}
                    dataset={dataset}
                    selectedDay={mockSelectedDay}
                    setLayerInfo={() => {}}
                  />
                ))}
            </Grid>
          </Grid>
        </GridContainer>
      </HugResetter>
    </PageMainContent>
  );
};

export default SandboxTimelineAnalysis;
