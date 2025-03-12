import { VedaData, VedaDatum, DatasetData } from '$types/veda';

export const getDatasetLayers = (datasets: VedaData<DatasetData>) =>
  Object.values(datasets).flatMap((dataset: VedaDatum<DatasetData>) => {
    return dataset.data.layers;
  });

export const getLayersFromDatasetLayers = (datasets: DatasetData[]) =>
  Object.values(datasets).flatMap((data: DatasetData) => {
    return data.layers;
  });
