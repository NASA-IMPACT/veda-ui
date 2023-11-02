import { atom } from 'jotai';

import { datasetLayers, reconcileDatasets } from '../data-utils';
import { TimelineDataset, TimelineDatasetForUrl } from '../types.d.ts';
import { getStableValue } from './cache';
import { AtomValueUpdater } from './types';
import { setUrlParam, urlAtom } from './url';

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

// Dataset data that is serialized to the url. Only the data needed to
// reconstruct the dataset (and user interaction data like settings) is stored
// in the url, otherwise it would be too long.
const datasetsUrlAtom = atom(
  (get): TimelineDatasetForUrl[] => {
    try {
      const serialized = get(urlAtom).searchParams?.get('datasets') ?? '[]';
      return urlDatasetsHydrate(serialized);
    } catch (error) {
      return [];
    }
  },
  (get, set, datasets: TimelineDataset[]) => {
    // Extract need properties from the datasets and encode them.
    const encoded = urlDatasetsDehydrate(datasets);
    set(urlAtom, setUrlParam('datasets', encoded));
  }
);

// Atom to hold all the data about the datasets.
const timelineDatasetsStorageAtom = atom<TimelineDataset[]>([]);

// Atom from where to get the dataset information. This reconciles the storage
// data with the url data.
export const timelineDatasetsAtom = atom(
  (get) => {
    const urlDatasets = get(datasetsUrlAtom);
    const datasets = get(timelineDatasetsStorageAtom);

    // Reconcile what needs to be reconciled.
    const reconciledDatasets = urlDatasets.map((enc) => {
      // We only want to do this on load. If the dataset was already
      // initialized, skip.
      // WARNING: This means that changing settings directly in the url without
      // a page refresh will do nothing.
      const readyDataset = datasets.find((d) => d.data.id === enc.id);
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

    return getStableValue('datasets', reconciledDatasets);
  },
  (get, set, updates: AtomValueUpdater<TimelineDataset[]>) => {
    const newData =
      typeof updates === 'function'
        ? updates(get(timelineDatasetsStorageAtom))
        : updates;

    set(datasetsUrlAtom, newData);
    set(timelineDatasetsStorageAtom, newData);
  }
);
