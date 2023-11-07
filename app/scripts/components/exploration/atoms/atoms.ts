import { atom } from 'jotai';
import { atomWithLocation } from 'jotai-location';

import { HEADER_COLUMN_WIDTH, RIGHT_AXIS_SPACE } from '../constants';
import {
  datasetLayers,
  reconcileDatasets,
  urlDatasetsDehydrate,
  urlDatasetsHydrate
} from '../data-utils';
import {
  DateRange,
  TimelineDataset,
  TimelineDatasetForUrl,
  ZoomTransformPlain
} from '../types.d.ts';

// This is the atom acting as a single source of truth for the AOIs.
const locAtom = atomWithLocation();

const setUrlParam = (name: string, value: string) => (prev) => {
  const searchParams = prev.searchParams ?? new URLSearchParams();
  searchParams.set(name, value);

  return { ...prev, searchParams };
};

const getValidDateOrNull = (value: any) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

type ValueUpdater<T> = T | ((prev: T) => T);

// Dataset data that is serialized to the url. Only the data needed to
// reconstruct the dataset (and user interaction data like settings) is stored
// in the url, otherwise it would be too long.
const datasetsUrlConfig = atom(
  (get): TimelineDatasetForUrl[] => {
    try {
      const serialized = get(locAtom).searchParams?.get('datasets') ?? '[]';
      return urlDatasetsHydrate(serialized);
    } catch (error) {
      return [];
    }
  },
  (get, set, datasets: TimelineDataset[]) => {
    // Extract need properties from the datasets and encode them.
    const encoded = urlDatasetsDehydrate(datasets);
    set(locAtom, setUrlParam('datasets', encoded));
  }
);

const timelineDatasetsStorageAtom = atom<TimelineDataset[]>([]);

// Datasets to show on the timeline and their settings.
export const timelineDatasetsAtom = atom(
  (get) => {
    const urlDatasets = get(datasetsUrlConfig);
    const datasets = get(timelineDatasetsStorageAtom);

    // Reconcile what needs to be reconciled.
    return urlDatasets.map((enc) => {
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
  },
  (get, set, updates: ValueUpdater<TimelineDataset[]>) => {
    const newData =
      typeof updates === 'function'
        ? updates(get(timelineDatasetsStorageAtom))
        : updates;

    set(datasetsUrlConfig, newData);
    set(timelineDatasetsStorageAtom, newData);
  }
);

// Main timeline date. This date defines the datasets shown on the map.
export const selectedDateAtom = atom(
  (get) => {
    const txtDate = get(locAtom).searchParams?.get('date');
    return getValidDateOrNull(txtDate);
  },
  (get, set, updates: ValueUpdater<Date | null>) => {
    const newData =
      typeof updates === 'function'
        ? updates(get(selectedCompareDateAtom))
        : updates;

    set(locAtom, setUrlParam('date', newData?.toISOString() ?? ''));
  }
);

// Compare date. This is the compare date for the datasets shown on the map.
export const selectedCompareDateAtom = atom(
  (get) => {
    const txtDate = get(locAtom).searchParams?.get('dateCompare');
    return getValidDateOrNull(txtDate);
  },
  (get, set, updates: ValueUpdater<Date | null>) => {
    const newData =
      typeof updates === 'function'
        ? updates(get(selectedCompareDateAtom))
        : updates;

    set(locAtom, setUrlParam('dateCompare', newData?.toISOString() ?? ''));
  }
);

// Date range for L&R playheads.
export const selectedIntervalAtom = atom(
  (get) => {
    const txtDate = get(locAtom).searchParams?.get('dateRange');
    const [start, end] = txtDate?.split('|') ?? [];

    const dateStart = getValidDateOrNull(start);
    const dateEnd = getValidDateOrNull(end);

    if (!dateStart || !dateEnd) return null;

    return { start: dateStart, end: dateEnd };
  },
  (get, set, updates: ValueUpdater<DateRange | null>) => {
    const newData =
      typeof updates === 'function'
        ? updates(get(selectedIntervalAtom))
        : updates;

    const value = newData
      ? `${newData.start.toISOString()}|${newData.end.toISOString()}`
      : '';

    set(locAtom, setUrlParam('dateRange', value));
  }
);

// Zoom transform for the timeline. Values as object instead of d3.ZoomTransform
export const zoomTransformAtom = atom<ZoomTransformPlain>({
  x: 0,
  y: 0,
  k: 1
});

// Width of the whole timeline item. Set via a size observer and then used to
// compute the different element sizes.
export const timelineWidthAtom = atom<number | undefined>(undefined);

// Derived atom with the different sizes of the timeline elements.
export const timelineSizesAtom = atom((get) => {
  const totalWidth = get(timelineWidthAtom);

  return {
    headerColumnWidth: HEADER_COLUMN_WIDTH,
    rightAxisWidth: RIGHT_AXIS_SPACE,
    contentWidth: Math.max(
      1,
      (totalWidth ?? 0) - HEADER_COLUMN_WIDTH - RIGHT_AXIS_SPACE
    )
  };
});

// Whether or not the dataset rows are expanded.
export const isExpandedAtom = atom<boolean>(true);

// Analysis controller. Stores high level state about the analysis process.
export const analysisControllerAtom = atom({
  isAnalyzing: false,
  runIds: {} as Record<string, number | undefined>,
  isObsolete: false
});
