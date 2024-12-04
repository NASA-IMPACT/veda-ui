import { atom } from 'jotai';
import { DatasetLayer } from '$types/veda';

/**
 * This is the primary storage atom for external datasets (e.g. passed from Next.js).
 */
export const externalDatasetsAtom = atom<any[]>([]);

/**
 * Derived atom that transforms the provided datasets into layers.
 * It is used by the timelineDatasetsAtom to rebuild state from URL parameters
 * while it preserves the parent dataset metadata for each layer that comes
 * from the MDX configuration.
 */
export const datasetLayersAtom = atom<DatasetLayer[]>((get) => {
  const datasets = get(externalDatasetsAtom);

  return datasets.flatMap((dataset) => {
    return (dataset.layers || []).map((l: any) => ({
      ...l,
      parentDataset: {
        id: dataset.id,
        name: dataset.name
      }
    }));
  });
});
