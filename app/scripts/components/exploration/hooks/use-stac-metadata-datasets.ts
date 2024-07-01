import {
  useQueries,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';
import axios from 'axios';
import {
  StacDatasetData,
  TimeDensity,
  TimelineDataset,
  DatasetStatus,
  VizDataset
} from '../types.d.ts';
import { resolveLayerTemporalExtent } from '../data-utils';

import { useEffectPrevious } from '$utils/use-effect-previous';
import { SetState } from '$types/aliases';

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
  queryData: UseQueryResult<StacDatasetData>,
  dataset: TimelineDataset | VizDataset
): TimelineDataset | VizDataset {
  try {
    let base = {
      ...dataset,
      status: queryData.status as DatasetStatus,
      error: queryData.error
    };

    if (queryData.status === DatasetStatus.SUCCESS) {
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

    return base as TimelineDataset | VizDataset;
  } catch (error) {
    const e = new Error('Error reconciling query data with dataset');
    // @ts-expect-error detail is not a property of Error
    e.detail = error;

    return {
      ...dataset,
      status: DatasetStatus.ERROR,
      error: e
    } as TimelineDataset | VizDataset;
  }
}

async function fetchStacDatasetById(
  dataset: TimelineDataset | VizDataset
): Promise<StacDatasetData> {
  const { type, stacCol, stacApiEndpoint, time_density } = dataset.data;

  const stacApiEndpointToUse = stacApiEndpoint ?? process.env.API_STAC_ENDPOINT;

  const { data } = await axios.get(
    `${stacApiEndpointToUse}/collections/${stacCol}`
  );

  const commonTimeseriesParams = {
    isPeriodic: !!data['dashboard:is_periodic'],
    // priority is given to time density in dataset configuration, then metadata in STAC, and falling back to DAY if neither is present
    timeDensity: time_density || data['dashboard:time_density'] || TimeDensity.DAY
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
    const domain = data.summaries?.datetime?.[0]
      ? data.summaries.datetime
      : data.extent.temporal.interval[0];

    // STAC may return datetimes with `null` as the last value to indicate ongoing data.
    const domain_length = domain.length;
    if (domain[domain_length - 1] == null) {
      domain[domain_length - 1] = new Date().toISOString();
    }

    if (!domain?.length || domain.some((d) => !d)) {
      throw new Error('Invalid datetime domain');
    }

    return {
      ...commonTimeseriesParams,
      domain
    };
  }
}

// Create a query object for react query.
function makeQueryObject(
  dataset: TimelineDataset | VizDataset
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
export function useReconcileWithStacMetadata(
  datasets: TimelineDataset[] | VizDataset[],
  handleUpdate: SetState<TimelineDataset[] | VizDataset[] | undefined>
) {
  const noDatasetsToQuery: boolean =
    !datasets || (datasets.length === 1 && datasets[0] === undefined);

  const datasetsQueryData = useQueries({
    queries: noDatasetsToQuery
      ? []
      : datasets
          .filter((d) => !(d as any)?.mocked)
          .map((dataset) => makeQueryObject(dataset))
  });

  useEffectPrevious<
    [typeof datasetsQueryData, TimelineDataset[] | VizDataset[]]
  >(
    (prev) => {
      if (noDatasetsToQuery) return;

      const prevQueryData = prev[0];
      const hasPrev = !!prevQueryData;
      const { updated, data: updatedDatasets } = datasets
        .filter((d) => !(d as any)?.mocked)
        .reduce<{
          updated: boolean;
          data: TimelineDataset[] | VizDataset[];
        }>(
          (acc, dataset, idx) => {
            const curr = datasetsQueryData[idx];
            // We want to reconcile the data event if it is the first time.
            // In practice data will have changes, since prev is undefined.
            if (!hasPrev || didDataChange(curr, prevQueryData[idx])) {
              return {
                updated: true,
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
          { updated: false, data: [] }
        );
      if (updated) {
        handleUpdate(updatedDatasets);
      }
    },
    [datasetsQueryData, datasets]
  );
}
