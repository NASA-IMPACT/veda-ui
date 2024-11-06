import { useAtom } from 'jotai';
import { timelineDatasetsAtom } from '../atoms/datasets';
import { TimelineDataset } from '../types.d.ts';

export default function useTimelineDatasetAtom (): [
  TimelineDataset[],
  (datasets: TimelineDataset[]) => void
]  {
  const [datasets, setDatasets] = useAtom(timelineDatasetsAtom);
  return [datasets, setDatasets];
}