import { VedaData, VedaDatum, DatasetData } from '$types/veda';

export const findParentDataset = ({
  datasets,
  datasetId
}: {
  datasets: DatasetData[];
  datasetId: string;
}): DatasetData | undefined => {
  const parentDatset = datasets.find(
    (dataset: DatasetData) => dataset.id === datasetId
  );
  return parentDatset;
};

export const getDatasetLayers = (datasets: VedaData<DatasetData>) =>
  Object.values(datasets).flatMap((dataset: VedaDatum<DatasetData>) => {
    return dataset.data.layers;
  });

export const getLayersFromDatasetLayers = (datasets: DatasetData[]) =>
  Object.values(datasets).flatMap((data: DatasetData) => {
    return data.layers;
  });
