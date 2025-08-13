import React, { createContext, useContext, useCallback } from 'react';
import DataLayerCard from '$components/exploration/components/datasets/data-layer-card';
import { TimelineDataset } from '$components/exploration/types.d.ts';
import { ExplorationMap } from '$components/exploration/components/map';
import Timeline from '$components/exploration/components/timeline/timeline';
import {
  useTimelineDatasetVisibility,
  useTimelineDatasetColormap,
  useTimelineDatasetColormapScale
} from '$components/exploration/atoms/hooks';

// @NOTE-SANDRA: hooks only make sense to be used and imported when used within a system of E&A... maybe... this is what I need to explore
// @NOTE-SANDRA: Lots of dependencies on the datasetAtom - useAnalysisDataRequest for example and it also needs the vedaUIProvider...
// @NOTE-SANDRA: Hooks are attached to the urlParams... system as a whole greatly depends on URL Params

/**
 * Compound component system that wraps the E&A components to easily interface with
 * when subscribing to one or more components within the larger system using the TimelineDatasets atom state
 */

// CONTEXT
interface EACompoundContextType {
  selectedDay: Date | null;
  setSelectedDay: (day: Date) => void;
  selectedCompareDay: Date | null;
  setSelectedCompareDay: (day: Date) => void;
  datasets: TimelineDataset[];
  setDatasets: (datasets: TimelineDataset[]) => void;
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

// COMPOUND COMPONENT PROVIDER
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

/**
 * WRAPPERS
 * wrappers are used to inject the values (props)already defined within the provider when it is initialized
 */
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

// Compound system
ExplorationAndAnalysisCompound.Map = EAMapCompound;
ExplorationAndAnalysisCompound.Timeline = EATimelineCompound;
ExplorationAndAnalysisCompound.DataLayerCard = EADataLayerCard;
