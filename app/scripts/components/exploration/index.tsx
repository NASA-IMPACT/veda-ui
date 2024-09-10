import React, { useCallback, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { useAtom, useSetAtom } from 'jotai';
import Timeline from './components/timeline/timeline';
import { ExplorationMap } from './components/map';
// import { DatasetSelectorModal } from './components/dataset-selector-modal';
import { useAnalysisController } from './hooks/use-analysis-data-request';
import { TimelineDataset } from './types.d.ts';
import { selectedCompareDateAtom, selectedDateAtom } from './atoms/dates';
import { CLEAR_LOCATION, urlAtom } from '$utils/params-location-atom/url';

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
    position: relative;
  }

  .panel-timeline {
    box-shadow: 0 -1px 0 0 ${themeVal('color.base-100')};
  }

  .resize-handle {
    flex: 0;
    position: relative;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    margin: 0 auto -1.25rem auto;
    padding: 0rem 0 0.25rem;
    z-index: 1;

    ::before {
      content: '';
      display: block;
      width: 2rem;
      background: ${themeVal('color.base-200')};
      height: 0.25rem;
      border-radius: ${themeVal('shape.ellipsoid')};
    }
  }
`;

interface ExplorationAndAnalysisProps {
  datasets: TimelineDataset[];
  setDatasets: (datasets: TimelineDataset[]) => void;
}

function ExplorationAndAnalysis(props: ExplorationAndAnalysisProps) {
  const { datasets, setDatasets } = props;

  const [selectedDay, setSelectedDay] = useAtom(selectedDateAtom);

  const [selectedCompareDay, setSelectedCompareDay] = useAtom(
    selectedCompareDateAtom
  );

  const [datasetModalRevealed, setDatasetModalRevealed] = useState(
    !datasets.length
  );

  // @TECH-DEBT: panelHeight  needs to be passed to work around Safari CSS
  const [panelHeight, setPanelHeight] = useState(0);

  const openModal = useCallback(() => setDatasetModalRevealed(true), []);
  const closeModal = useCallback(() => setDatasetModalRevealed(false), []);

  const setUrl = useSetAtom(urlAtom);
  const { reset: resetAnalysisController } = useAnalysisController();

  // Reset atoms when leaving the page.
  useEffect(() => {
    return () => {
      resetAnalysisController();
      setUrl(CLEAR_LOCATION);
    };
  }, [resetAnalysisController, setUrl]);

  return (
    <Container>
      <PanelGroup direction='vertical' className='panel-wrapper'>
        <Panel
          maxSize={75}
          className='panel'
          onResize={(size: number) => {
            setPanelHeight(size);
          }}
        >
          <ExplorationMap
            datasets={datasets}
            setDatasets={setDatasets}
            selectedDay={selectedDay}
            selectedCompareDay={selectedCompareDay}
          />
        </Panel>
        <PanelResizeHandle className='resize-handle' />
        <Panel maxSize={75} className='panel panel-timeline'>
          <Timeline
            datasets={datasets}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedCompareDay={selectedCompareDay}
            setSelectedCompareDay={setSelectedCompareDay}
            onDatasetAddClick={openModal}
            panelHeight={panelHeight}
          />
        </Panel>
      </PanelGroup>
      {/* <DatasetSelectorModal
        revealed={datasetModalRevealed}
        close={closeModal}
      /> */}
    </Container>
  );
}
export default ExplorationAndAnalysis;
