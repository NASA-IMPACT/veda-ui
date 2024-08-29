import { datasetLayers } from '../data-utils';
import { reconcileDatasets } from '../data-utils-no-faux-module';
import { TimelineDataset, TimelineDatasetForUrl } from '../types.d.ts';
import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

function urlDatasetsDehydrate(datasets: TimelineDataset[]) {
  // Only keep what we need to reconstruct the dataset, which is the id and
  // whatever the user has changed.
  return JSON.stringify(
    datasets.map((d) => ({
      id: d.data.id,
      settings: d.settings
    }))
  );
}

function urlDatasetsHydrate(
  encoded: string | null | undefined
): TimelineDatasetForUrl[] {
  if (!encoded) return [];
  const parsed = JSON.parse(encoded);
  return parsed;
}

export const timelineDatasetsAtom = atomWithUrlValueStability<
  TimelineDataset[],
  TimelineDatasetForUrl[]
>({
  initialValue: [],
  urlParam: 'datasets',
  hydrate: (serialized) => {
    try {
      return urlDatasetsHydrate(serialized ?? '[]');
    } catch (error) {
      return [];
    }
  },
  dehydrate: (datasets) => {
    return urlDatasetsDehydrate(datasets);
  },
  reconcile: (urlDatasets, storageDatasets) => {
    // Reconcile what needs to be reconciled.
    const reconciledDatasets = urlDatasets.map((enc) => {
      // We only want to do this on load. If the dataset was already
      // initialized, skip.
      // WARNING: This means that changing settings directly in the url without
      // a page refresh will do nothing.
      const readyDataset = storageDatasets.find((d) => d.data.id === enc.id);
      if (readyDataset) {
        return readyDataset;
      }
      // Reconcile the dataset with the internal data (from VEDA config files)
      // and then add the url stored settings.
      const [reconciled] = reconcileDatasets([enc.id], datasetLayers, []);
      if (enc.settings) {
        reconciled.settings = enc.settings;
      }
      return reconciled;
    });

    return reconciledDatasets;
  }
});
