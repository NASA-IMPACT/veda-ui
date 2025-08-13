import { useAtom, useSetAtom } from 'jotai';
import useTimelineDatasetAtom from '$components/exploration/hooks/use-timeline-dataset-atom';
import { SetState } from '$types/aliases';
import { DatasetData } from '$types/veda';
import {
  selectedDateAtom,
  selectedCompareDateAtom
} from '$components/exploration/atoms/dates';
import { externalDatasetsAtom } from '$components/exploration/atoms/datasetLayers';
import { TimelineDataset } from '$components/exploration/types.d.ts';

/**
 * Larger wrapping hook to easily access and interface with the necessary hooks and atoms for E&A connected atom state
 */

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
