import {
  useQueries,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';
import axios from 'axios';
import { useAtom } from 'jotai';

import { timelineDatasetsAtom } from '../atoms/datasets';
import {
  StacDatasetData,
  TimeDensity,
  TimelineDataset,
  TimelineDatasetStatus
} from '../types.d.ts';
import { resolveLayerTemporalExtent } from '../data-utils';

import { useEffectPrevious } from '$utils/use-effect-previous';

function didDataChange(curr: UseQueryResult, prev?: UseQueryResult) {
  const currKey = `${curr.errorUpdatedAt}-${curr.dataUpdatedAt}-${curr.failureCount}`;
  const prevKey = `${prev?.errorUpdatedAt}-${prev?.dataUpdatedAt}-${prev?.failureCount}`;

  return prevKey !== currKey;
}

/**
 * Merges STAC metadata with local dataset, computing the domain.
 *
 * @param queryData react-query response with data from STAC request
 * @param dataset Local dataset data.
 *
 * @returns Reconciled dataset with STAC data.
 */
function reconcileQueryDataWithDataset(
  queryData: UseQueryResult<StacDatasetData, unknown>,
  dataset: TimelineDataset
): TimelineDataset {
  try {
    let base = {
      ...dataset,
      status: queryData.status as TimelineDatasetStatus,
      error: queryData.error
    };

    if (queryData.status === TimelineDatasetStatus.SUCCESS) {
      const domain = resolveLayerTemporalExtent(base.data.id, queryData.data);

      base = {
        ...base,
        data: {
          ...base.data,
          ...queryData.data,
          domain
        }
      };
    }

    return base as TimelineDataset;
  } catch (error) {
    const e = new Error('Error reconciling query data with dataset');
    // @ts-expect-error detail is not a property of Error
    e.detail = error;

    return {
      ...dataset,
      status: TimelineDatasetStatus.ERROR,
      error: e
    } as TimelineDataset;
  }
}

async function fetchStacDatasetById(
  dataset: TimelineDataset
): Promise<StacDatasetData> {
  const { type, stacCol } = dataset.data;

  const { data } = await axios.get(
    `${process.env.API_STAC_ENDPOINT}/collections/${stacCol}`
  );

  const commonTimeseriesParams = {
    isPeriodic: !!data['dashboard:is_periodic'],
    timeDensity: data['dashboard:time_density'] || TimeDensity.DAY
  };

  if (type === 'vector') {
    const featuresApiEndpoint = data.links.find(
      (l) => l.rel === 'external'
    ).href;
    const { data: featuresApiData } = await axios.get(featuresApiEndpoint);

    return {
      ...commonTimeseriesParams,
      domain: featuresApiData.extent.temporal.interval[0]
    };
  } else {
    const domain = data.summaries
      ? data.summaries.datetime
      : data.extent.temporal.interval[0];

    return {
      ...commonTimeseriesParams,
      domain
    };
  }
}

// Create a query object for react query.
function makeQueryObject(
  dataset: TimelineDataset
): UseQueryOptions<unknown, unknown, StacDatasetData> {
  return {
    queryKey: ['dataset', dataset.data.id],
    queryFn: () => fetchStacDatasetById(dataset),
    // This data will not be updated in the context of a browser session, so it is
    // safe to set the staleTime to Infinity. As specified by react-query's
    // "Important Defaults", cached data is considered stale which means that
    // there would be a constant refetching.
    staleTime: Infinity,
    // Errors are always considered stale. If any layer errors, any refocus would
    // cause a refetch. This is normally a good thing but since we have a refetch
    // button, this is not needed.
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  };
}

/**
 * Extends local dataset state with STAC metadata.
 * Whenever a dataset is added to the timeline, this hook will fetch the STAC
 * metadata for that dataset and add it to the dataset state atom.
 */
export function useStacMetadataOnDatasets() {
  const [datasets, setDatasets] = useAtom(timelineDatasetsAtom);

  const datasetsQueryData = useQueries({
    queries: datasets
      .filter((d) => !(d as any).mocked)
      .map((dataset) => makeQueryObject(dataset))
  });

  useEffectPrevious<[typeof datasetsQueryData, TimelineDataset[]]>(
    (prev) => {
      const prevQueryData = prev[0];
      const hasPrev = !!prevQueryData;

      const { changed, data: updatedDatasets } = datasets
        .filter((d) => !(d as any).mocked)
        .reduce<{
          changed: boolean;
          data: TimelineDataset[];
        }>(
          (acc, dataset, idx) => {
            const curr = datasetsQueryData[idx];

            // We want to reconcile the data event if it is the first time.
            // In practice data will have changes, since prev is undefined.
            if (!hasPrev || didDataChange(curr, prevQueryData[idx])) {
              // Changed
              return {
                changed: true,
                data: [
                  ...acc.data,
                  reconcileQueryDataWithDataset(curr, dataset)
                ]
              };
            } else {
              return {
                ...acc,
                data: [...acc.data, dataset]
              };
            }
          },
          { changed: false, data: [] }
        );

      if (changed as boolean) {
        setDatasets(updatedDatasets);
      }
    },
    [datasetsQueryData, datasets]
  );
}
