import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { externalDatasetsAtom } from '../atoms/datasetLayers';
import { findParentDataset } from '$utils/data-utils';
import { DatasetData } from '$types/veda';

export default function useParentDataset({ datasetId }: { datasetId: string }) {
  const [currentDataset, setCurrentDataset] = useState<DatasetData | undefined>(
    undefined
  );
  const [allDatasets] = useAtom(externalDatasetsAtom);

  useEffect(() => {
    if (!datasetId || !allDatasets) return;
    const matchingDataset = findParentDataset({
      datasets: allDatasets,
      datasetId
    });

    setCurrentDataset(matchingDataset);
  }, [datasetId, allDatasets]);

  return { parentDataset: currentDataset };
}
