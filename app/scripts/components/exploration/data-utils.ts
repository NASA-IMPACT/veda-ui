import { DatasetLayer, datasets } from 'veda';
import { TimelineDataset, TimelineDatasetStatus } from './types.d.ts';

export const findParentDataset = (layerId: string) => {
  const parentDataset = Object.values(datasets).find((dataset) =>
    dataset!.data.layers.find((l) => l.id === layerId)
  );
  return parentDataset?.data;
};

export const datasetLayers = Object.values(datasets).flatMap(
  (dataset) => dataset!.data.layers
);

/**
 * Converts the datasets to a format that can be used by the timeline, skipping
 * the ones that have already been reconciled.
 *
 * @param ids The ids of the datasets to reconcile.
 * @param datasetsList The list of datasets layers from VEDA
 * @param reconciledDatasets The datasets that were already reconciled.
 */
export function reconcileDatasets(
  ids: string[],
  datasetsList: DatasetLayer[],
  reconciledDatasets: TimelineDataset[]
) {
  return ids.map((id) => {
    const alreadyReconciled = reconciledDatasets.find((d) => d.data.id === id);

    if (alreadyReconciled) {
      return alreadyReconciled;
    }

    const dataset = datasetsList.find((d) => d.id === id);

    return {
      status: TimelineDatasetStatus.IDLE,
      data: dataset,
      error: null,
      settings: {
        isVisible: true,
        opacity: 100
      },
      analysis: {
        status: TimelineDatasetStatus.IDLE,
        data: {},
        error: null,
        meta: {}
      }
    };
  });
}
