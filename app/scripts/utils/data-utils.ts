import { VedaData, VedaDatum, DatasetData } from '$types/veda';

export function findParentDatasetFromLayer({
  datasets,
  layerId
}: {
  datasets: DatasetData[];
  layerId: string;
}): DatasetData | undefined {
  const parentDataset: DatasetData | undefined = Object.values(datasets).find(
    (dataset: DatasetData) => dataset?.layers.find((l) => l.id === layerId)
  ) as DatasetData | undefined;
  return parentDataset;
}

export const getDatasetLayers = (datasets: VedaData<DatasetData>) =>
  Object.values(datasets).flatMap((dataset: VedaDatum<DatasetData>) => {
    return dataset.data.layers;
  });

export const getLayersFromDatasetLayers = (datasets: DatasetData[]) =>
  Object.values(datasets).flatMap((data: DatasetData) => {
    return data.layers;
  });
