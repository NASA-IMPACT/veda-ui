import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { useAtom, useSetAtom } from 'jotai';
import Timeline from './components/timeline/timeline';
import { ExplorationMap } from './components/map';
import { useAnalysisController } from './hooks/use-analysis-data-request';
import { TimelineDataset } from './types.d.ts';
import { selectedCompareDateAtom, selectedDateAtom } from './atoms/dates';
import { CLEAR_LOCATION, urlAtom } from '$utils/params-location-atom/url';
import { globalStyleCSSBlock } from '$styles/theme';

// @TODO: "height: 100%" Added for exploration container to show correctly in NextJs instance but investigate why this is needed and possibly work to remove
const Container = styled.div`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  height: 100%;

  ${globalStyleCSSBlock}

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
  openDatasetsSelectionModal?: () => void;
}

function ExplorationAndAnalysis(props: ExplorationAndAnalysisProps) {
  const { datasets, setDatasets, openDatasetsSelectionModal } = props;

  const [selectedDay, setSelectedDay] = useAtom(selectedDateAtom);

  const [selectedCompareDay, setSelectedCompareDay] = useAtom(
    selectedCompareDateAtom
  );

  // @TECH-DEBT: panelHeight  needs to be passed to work around Safari CSS
  const [panelHeight, setPanelHeight] = useState(0);

  const setUrl = useSetAtom(urlAtom);
  const { reset: resetAnalysisController } = useAnalysisController();

  // Reset atoms when leaving the page.
  useEffect(() => {
    return () => {
      resetAnalysisController();
      setUrl(CLEAR_LOCATION);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            onDatasetAddClick={openDatasetsSelectionModal}
            panelHeight={panelHeight}
          />
        </Panel>
      </PanelGroup>
    </Container>
  );
}
export default ExplorationAndAnalysis;
