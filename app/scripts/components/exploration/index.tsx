import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { Map as MapboxMap } from 'mapbox-gl';
import { MapRef } from 'react-map-gl';

import { useAtom, useSetAtom } from 'jotai';
import Timeline from './components/timeline/timeline';
import { ExplorationMap } from './components/map';
import { DatasetSelectorModal } from './components/dataset-selector-modal';
import { useAnalysisController } from './hooks/use-analysis-data-request';
import { TimelineDataset, TimeDensity } from './types.d.ts';
import { selectedCompareDateAtom, selectedDateAtom } from './atoms/dates';
import { GeoCoPilot } from './components/geo-copilot/geo-copilot';

import { TemporalExtent } from './components/timeline/timeline-utils';
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

  .panel-geo-copilot {
    height: 90vh;
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

  const [startEndDates, setStartEndDates] = useState<TemporalExtent>(
    [undefined, undefined]
  );

  const [showGeoCoPilot, setShowGeoCoPilot] = useState(
    false
  );

  const [timeDensity, setTimeDensity] = useState<TimeDensity | null>(null);

  const [map, setMap] = useState<MapboxMap | MapRef>();

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

  const mapPanelRef = useRef<any>(null);
  const geoCoPilotRef = useRef<any>(null);

  const expandGeoCoPilotPanel = () => {
    const mapPanel = mapPanelRef.current;
    const geoCoPilotPanel = geoCoPilotRef.current;
    if (mapPanel && geoCoPilotPanel) {
      // panel.expand(50);
      // resize panel from 0 to 50
      mapPanel.resize(75);
      geoCoPilotPanel.resize(25);
      setShowGeoCoPilot(true);
    }
  };

  const closeGeoCoPilotPanel = () => {
    const mapPanel = mapPanelRef.current;
    const geoCoPilotPanel = geoCoPilotRef.current;
    if (mapPanel && geoCoPilotPanel) {
      mapPanel.resize(100);
      geoCoPilotPanel.resize(0);
      setShowGeoCoPilot(false);
    }
  };

  return (
    <Container>
      <PanelGroup direction='horizontal' className='panel-wrapper'>
        <Panel
          defaultSize={100}
          className='panel'
          onResize={(size: number) => {
            setPanelHeight(size);
          }}
          ref={mapPanelRef}
        >
          <PanelGroup direction='vertical' className='panel-wrapper-internal'>
            <Panel
              maxSize={100}
              onResize={(size: number) => {
                setPanelHeight(size);
              }}
              className='panel panel-map'
            >
              <ExplorationMap
                datasets={datasets}
                setDatasets={setDatasets}
                selectedDay={selectedDay}
                selectedCompareDay={selectedCompareDay}
                showGeoCoPilot={showGeoCoPilot}
                openGeoCoPilot={expandGeoCoPilotPanel}
                closeGeoCoPilot={closeGeoCoPilotPanel}
                setMap={setMap}
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
                startEndDates={startEndDates}
                panelHeight={panelHeight}
                timeDensity={timeDensity}
              />
            </Panel>
          </PanelGroup>
        </Panel>
        <Panel
          minSize={0}
          maxSize={25}
          defaultSize={0} // Collapsed by default
          className='panel panel-geo-copilot'
          ref={geoCoPilotRef}
        >
          <GeoCoPilot
            close={closeGeoCoPilotPanel}
            datasets={datasets}
            setDatasets={setDatasets}
            setSelectedDay={setSelectedDay}
            setSelectedCompareDay={setSelectedCompareDay}
            map={map}
            setStartEndDates={setStartEndDates}
            setTimeDensity={setTimeDensity}
          />
        </Panel>
      </PanelGroup>
      <DatasetSelectorModal
        revealed={datasetModalRevealed}
        close={closeModal}
      />
    </Container>
  );
}
export default ExplorationAndAnalysis;
