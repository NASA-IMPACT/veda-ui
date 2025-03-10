import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { externalDatasetsAtom } from '../atoms/datasetLayers';
import { findParentDataset } from '$utils/data-utils-no-faux-module';

export default function useParentDataset({ datasetId }) {
  const [currentDataset, setCurrentDataset] = useState(null);
  const [allDatasets] = useAtom(externalDatasetsAtom);

  useEffect(() => {
    if (!datasetId || !allDatasets) return;
    const matchingDataset = findParentDataset({
      datasets: allDatasets,
      datasetId
    });
    console.log('matcha!');
    setCurrentDataset(matchingDataset);
  }, [datasetId, allDatasets]); // Add dependencies here

  return { parentDataset: currentDataset };
}
