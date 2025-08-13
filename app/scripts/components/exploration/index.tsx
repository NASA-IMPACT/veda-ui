import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback
} from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { useAtom, useSetAtom } from 'jotai';
import Timeline from './components/timeline/timeline';
import { ExplorationMap } from './components/map';
import { useAnalysisController } from './hooks/use-analysis-data-request';
import { TimelineDataset } from './types.d.ts';
import { selectedCompareDateAtom, selectedDateAtom } from './atoms/dates';
import DataLayerCard from './components/datasets/data-layer-card'; // DataLayerCardWithSync
// import useTimelineDatasetsAtom from './hooks/use-timeline-dataset-atom';
import useTimelineDatasetAtom from './hooks/use-timeline-dataset-atom';
import { externalDatasetsAtom } from './atoms/datasetLayers';
import { CLEAR_LOCATION, urlAtom } from '$utils/params-location-atom/url';
import { legacyGlobalStyleCSSBlock } from '$styles/legacy-global-styles';
import { SetState } from '$types/aliases';
import { DatasetData } from '$types/veda';
import {
  // useTimelineDatasetAtom,
  useTimelineDatasetColormap,
  useTimelineDatasetVisibility,
  useTimelineDatasetColormapScale
} from '$components/exploration/atoms/hooks';

// @TODO: "height: 100%" Added for exploration container to show correctly in NextJs instance but investigate why this is needed and possibly work to remove
const Container = styled.div`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  height: 100%;

  .panel-wrapper {
    flex-grow: 1;
  }

  .panel {
    display: flex;
    flex-direction: column;
    position: relative;
  }
  * {
    ${legacyGlobalStyleCSSBlock}
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

export default function ExplorationAndAnalysis(
  props: ExplorationAndAnalysisProps
) {
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

// @NOTE-SANDRA: hooks only make sense to be used and imported when used within a system of E&A... maybe... this is what I need to explore
// @NOTE-SANDRA: Lots of dependencies on the datasetAtom - useAnalysisDataRequest for example and it also needs the vedaUIProvider...
// @NOTE-SANDRA: Hooks are attached to the urlParams... system as a whole depends on URL Params

interface EACompoundContextType {
  selectedDay: Date | null;
  setSelectedDay: (day: Date) => void;
  selectedCompareDay: Date | null;
  setSelectedCompareDay: (day: Date) => void;
  datasets: TimelineDataset[];
  setDatasets: (datasets: TimelineDataset[]) => void;
}

interface EACompoundStateValues {
  eaDatasets: TimelineDataset[];
  setEaDatasets: (datasets: TimelineDataset[]) => void;
  selectedDay: Date | null;
  setSelectedDay: (day: Date) => void;
  selectedCompareDay: Date | null;
  setSelectedCompareDay: (day: Date) => void;
  setEAExternalDatasets: SetState<DatasetData[]>;
}

export function useEACompoundState(): EACompoundStateValues {
  const [timelineDatasets, setTimelineDatasets] = useTimelineDatasetAtom();
  const [selectedDay, setSelectedDay] = useAtom(selectedDateAtom);
  const [selectedCompareDay, setSelectedCompareDay] = useAtom(
    selectedCompareDateAtom
  );
  const setEAExternalDatasets = useSetAtom(externalDatasetsAtom);

  return {
    eaDatasets: timelineDatasets,
    setEaDatasets: setTimelineDatasets,
    selectedDay,
    setSelectedDay,
    selectedCompareDay,
    setSelectedCompareDay,
    setEAExternalDatasets
  };
}

const EACompoundContext = createContext<EACompoundContextType>({
  selectedDay: null,
  setSelectedDay: (day: Date) => {},
  selectedCompareDay: null,
  setSelectedCompareDay: (day: Date) => {},
  datasets: [],
  setDatasets: (datasets: TimelineDataset[]) => {}
});

const useEACompoundContext = () => {
  const context = useContext(EACompoundContext);
  if (!context) {
    throw new Error(
      'useEACompoundContext must be used within a ExplorationAndAnalysisCompound'
    );
  }
  return context;
};
// http://localhost:9000/sandbox?datasets=%5B%7B%22id%22%3A%22casa-gfed-co2-flux-hr%22%2C%22settings%22%3A%7B%22isVisible%22%3Atrue%2C%22opacity%22%3A100%2C%22analysisMetrics%22%3A%5B%7B%22id%22%3A%22mean%22%2C%22label%22%3A%22Average%22%2C%22chartLabel%22%3A%22Average%22%2C%22themeColor%22%3A%22infographicB%22%7D%2C%7B%22id%22%3A%22std%22%2C%22label%22%3A%22St+Deviation%22%2C%22chartLabel%22%3A%22St+Deviation%22%2C%22themeColor%22%3A%22infographicD%22%7D%5D%2C%22colorMap%22%3A%22blues%22%2C%22scale%22%3A%7B%22min%22%3A0%2C%22max%22%3A0.3%7D%7D%7D%2C%7B%22id%22%3A%22casa-gfed-co2-flux%22%2C%22settings%22%3A%7B%22isVisible%22%3Atrue%2C%22opacity%22%3A100%2C%22analysisMetrics%22%3A%5B%7B%22id%22%3A%22mean%22%2C%22label%22%3A%22Average%22%2C%22chartLabel%22%3A%22Average%22%2C%22themeColor%22%3A%22infographicB%22%7D%2C%7B%22id%22%3A%22std%22%2C%22label%22%3A%22St+Deviation%22%2C%22chartLabel%22%3A%22St+Deviation%22%2C%22themeColor%22%3A%22infographicD%22%7D%5D%7D%7D%5D
export function ExplorationAndAnalysisCompound({
  selectedDay,
  setSelectedDay,
  selectedCompareDay,
  setSelectedCompareDay,
  setDatasets,
  datasets,
  children
}: {
  children: React.ReactNode;
} & EACompoundContextType) {
  return (
    <EACompoundContext.Provider
      value={{
        selectedDay,
        setSelectedDay,
        selectedCompareDay,
        setSelectedCompareDay,
        setDatasets,
        datasets
      }}
    >
      {children}
    </EACompoundContext.Provider>
  );
}

function EAMapCompound(props) {
  const { datasets, selectedDay, setDatasets, selectedCompareDay } =
    useEACompoundContext();
  return (
    <ExplorationMap
      selectedDay={selectedDay}
      selectedCompareDay={selectedCompareDay}
      setDatasets={setDatasets}
      datasets={datasets}
      {...props}
    />
  );
}

function EATimelineCompound(props) {
  const {
    selectedDay,
    setSelectedDay,
    selectedCompareDay,
    setSelectedCompareDay,
    datasets
  } = useEACompoundContext();
  return (
    <Timeline
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
      selectedCompareDay={selectedCompareDay}
      setSelectedCompareDay={setSelectedCompareDay}
      datasets={datasets}
      {...props}
    />
  );
}

// This is the DataLayerCardWithSync
// doesn't need EAContextHere so it can be used outside of the ExplorationAndAnalysisCompound
export function EADataLayerCard(props: {
  dataset: TimelineDataset;
  setLayerInfo: (data: any) => void;
}) {
  const { dataset, setLayerInfo } = props;

  const [isVisible, setVisible] = useTimelineDatasetVisibility(dataset.data.id);
  const [colorMap, setColorMap] = useTimelineDatasetColormap(dataset.data.id);
  const [colorMapScale, setColorMapScale] = useTimelineDatasetColormapScale(
    dataset.data.id
  );

  const onClickLayerInfo = useCallback(() => {
    const data: any = {
      name: dataset.data.name,
      description: dataset.data.description,
      info: dataset.data.info,
      parentData: dataset.data.parentDataset
    };
    setLayerInfo(data);
  }, [dataset, setLayerInfo]);

  return (
    <DataLayerCard
      dataset={dataset}
      colorMap={colorMap}
      colorMapScale={colorMapScale}
      setColorMap={setColorMap}
      setColorMapScale={setColorMapScale}
      isVisible={isVisible}
      setVisible={setVisible}
      onClickLayerInfo={onClickLayerInfo}
    />
  );
}

ExplorationAndAnalysisCompound.Map = EAMapCompound;
ExplorationAndAnalysisCompound.Timeline = EATimelineCompound;
ExplorationAndAnalysisCompound.DataLayerCard = EADataLayerCard;
