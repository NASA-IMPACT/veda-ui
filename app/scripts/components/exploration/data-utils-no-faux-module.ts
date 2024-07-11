import { DatasetLayer, VedaDatum, DatasetData } from '$types/veda';
import {
  EnhancedDatasetLayer,
  TimelineDataset,
  DatasetStatus
} from './types.d.ts';
import {
  DataMetric,
  DATA_METRICS,
  DEFAULT_DATA_METRICS
} from './components/datasets/analysis-metrics';

export const getDatasetLayers = (datasets: VedaDatum<DatasetData>) => Object.values(datasets)
  .flatMap((dataset: VedaDatum<DatasetData>) => {
    return dataset!.data.layers.map(l => ({
      ...l,
      parentDataset: {
        id: dataset!.data.id,
        name: dataset!.data.name
      }
    }));
  });


/**
 * Returns an array of metrics based on the given Dataset Layer configuration.
 * If the layer has metrics defined, it returns only the metrics that match the
 * ids. Otherwise, it returns all available metrics.
 *
 * @param data - The Datase tLayer object to get metrics for.
 * @returns An array of metrics objects.
 */
function getInitialMetrics(data: DatasetLayer): DataMetric[] {
  const metricsIds = data.analysis?.metrics ?? [];

  if (!metricsIds.length) {
    return DEFAULT_DATA_METRICS;
  }

  const foundMetrics = metricsIds
    .map((metric: string) => {
      return DATA_METRICS.find((m) => m.id === metric)!;
    })
    .filter(Boolean);

  return foundMetrics;
}

export function reconcileDatasets(
  ids: string[],
  datasetsList: EnhancedDatasetLayer[],
  reconciledDatasets: TimelineDataset[]
): TimelineDataset[] {
  return ids.map((id) => {
    const alreadyReconciled = reconciledDatasets.find((d) => d.data.id === id);

    if (alreadyReconciled) {
      return alreadyReconciled;
    }

    const dataset = datasetsList.find((d) => d.id === id);

    if (!dataset) {
      throw new Error(`Dataset [${id}] not found`);
    }

    return {
      status: DatasetStatus.IDLE,
      data: dataset,
      error: null,
      settings: {
        isVisible: true,
        opacity: 100,
        analysisMetrics: getInitialMetrics(dataset)
      },
      analysis: {
        status: DatasetStatus.IDLE,
        data: null,
        error: null,
        meta: {}
      }
    };
  });
}