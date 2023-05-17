import { useMemo } from 'react';

import { useDeepCompareMemo } from 'use-deep-compare';
import {
  QueryState,
  useQueries,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';
import axios from 'axios';
import {
  DatasetLayer,
  DatasetLayerCompareNormalized,
  datasets
} from 'veda';

import { getCompareLayerData } from '$components/common/mapbox/layers/utils';
import { S_SUCCEEDED } from '$utils/status';

export type TimeDensity = 'day' | 'month' | 'year' | null;

interface STACLayerData {
  assetUrl?: string;
  timeseries: {
    isPeriodic: boolean;
    timeDensity: TimeDensity;
    domain: string[];
  };
}

const fetchLayerById = async (
  layer: DatasetLayer | DatasetLayerCompareNormalized
): Promise<STACLayerData | Error> => {
  const { type, stacCol } = layer;

  const { data } = await axios.get(
    `${process.env.API_STAC_ENDPOINT}/collections/${stacCol}`
  );

  const commonTimeseriesParams = {
    isPeriodic: data['dashboard:is_periodic'],
    timeDensity: data['dashboard:time_density']
  };

  if (type === 'vector') {
    const featuresApiEndpoint = data.links.find((l) => l.rel === 'child').href;
    const { data: featuresApiData } = await axios.get(featuresApiEndpoint);

    return {
      timeseries: {
        ...commonTimeseriesParams,
        domain: featuresApiData.extent.temporal.interval[0]
      }
    };
  } else {
    const defaultData = {
      timeseries: {
        ...commonTimeseriesParams,
        domain: data.summaries ? data.summaries.datetime : data.extent.temporal.interval[0]
      }
    };
  
    if (type === 'zarr') {
      return {
        ...defaultData,
        assetUrl: data.assets.zarr.href
      };
    } else {
      return defaultData;
    }
  }
};

// Create a query object for react query.
const makeQueryObject = (
  layer: DatasetLayer | DatasetLayerCompareNormalized
): UseQueryOptions => ({
  queryKey: ['layer', layer.stacCol],
  queryFn: () => fetchLayerById(layer),
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
});

// /////////////////////////////////////////////////////////////////////////////
// Consumers and helpers
// /////////////////////////////////////////////////////////////////////////////

// Ensure that the data property cannot be undefined.
type NullableQueryState<TData, TError = unknown> = QueryState<
  TData | null,
  TError
> & { data: TData | null };

export interface AsyncDatasetLayer {
  baseLayer: NullableQueryState<Omit<DatasetLayer, 'compare'> & STACLayerData>;
  compareLayer: NullableQueryState<
    DatasetLayerCompareNormalized & STACLayerData
  > | null;
  reFetch: (() => void) | null;
}

interface NullAsyncDatasetLayer {
  baseLayer: null;
  compareLayer: null;
  reFetch: null;
}

const useLayersInit = (layers: DatasetLayer[]): AsyncDatasetLayer[] => {
  const queryClient = useQueryClient();

  const queries = useMemo(
    () =>
      layers.reduce<UseQueryOptions[]>((acc, layer) => {
        let queries = acc.concat(makeQueryObject(layer));

        const compareLayer = getCompareLayerData(layer);
        if (compareLayer && compareLayer.stacCol !== layer.stacCol) {
          queries = queries.concat(makeQueryObject(compareLayer));
        }

        return queries;
      }, []),
    [layers]
  );

  // useQueries does not produce a stable result, so `layerQueries` will be
  // changing on every render. This is a problem because we must compute the
  // final layer data which should only be done if the data actually changes.
  const layerQueries = useQueries({
    queries
  }) as UseQueryResult<STACLayerData>[];
  // There is an issue for this behavior but seems like it won't be fixed in the
  // near future:
  // https://github.com/tannerlinsley/react-query/issues/3049
  // The proposed solution is to use useDeepCompareMemo which compares the
  // dependency by value instead of by reference.
  return useDeepCompareMemo(() => {
    // Merge the data from STAC and the data from the configuration into a
    // single object with meta information about the request status.
    function mergeSTACData<
      T extends Omit<DatasetLayer, 'compare'> | DatasetLayerCompareNormalized
    >(baseData: T) {
      // At this point the result of queryClient.getQueryState will never be
      // undefined.
      /* eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style */
      const dataSTAC = queryClient.getQueryState([
        'layer',
        baseData.stacCol
      ]) as QueryState<STACLayerData>;

      if (dataSTAC.status !== S_SUCCEEDED) {
        return dataSTAC as unknown as NullableQueryState<null>;
      }

      return {
        ...dataSTAC,
        data: {
          ...baseData,
          ...dataSTAC.data
        }
      } as NullableQueryState<T & STACLayerData>;
    }

    return layers.map((layer) => {
      // Remove compare from layer.
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { compare, ...layerProps } = layer;

      // The compare definition needs to be resolved to a real layer before
      // returning. The values for the compare layer will depend on how it is
      // defined:
      // is if from a dataset?
      // is it a layer defined in-line?
      const compareLayer = getCompareLayerData(layer);

      return {
        baseLayer: mergeSTACData(layerProps),
        compareLayer: compareLayer && mergeSTACData(compareLayer),
        reFetch: () =>
          queryClient.refetchQueries(['layer', layer.stacCol], {
            type: 'active',
            exact: true
          })
      };
    });
  }, [layers, queryClient, layerQueries]);
};

// Context consumers.
export const useDatasetAsyncLayer = (
  datasetId?: string,
  layerId?: string
): NullAsyncDatasetLayer | AsyncDatasetLayer => {
  const hasParams = !!datasetId && !!layerId;
  const dataset = datasets[datasetId ?? ''];
  // Get the layer information from the dataset defined in the configuration.
  const layersList = dataset ? dataset.data.layers : [];
  const layer = layersList.find((l) => l.id === layerId);

  // The layers must be defined in the configuration otherwise it is not
  // possible to load them.
  if (hasParams && !layer) {
    throw new Error(`Layer [${layerId}] not found in dataset [${datasetId}]`);
  }

  const layerAsArray = useMemo(() => (layer ? [layer] : []), [layer]);
  const asyncLayers = useLayersInit(layerAsArray);

  return useMemo(
    () =>
      asyncLayers[0] || {
        baseLayer: null,
        compareLayer: null,
        reFetch: null
      },
    [asyncLayers]
  );
};

export const useDatasetAsyncLayers = (datasetId) => {
  const dataset = datasets[datasetId ?? ''];
  // Get the layer information from the dataset defined in the configuration.
  return useLayersInit(dataset?.data.layers ?? []);
};

interface ReferencedLayer {
  datasetId: string;
  layerId: string;
  skipCompare?: boolean;
}

export const useAsyncLayers = (referencedLayers: ReferencedLayer[]) => {
  // Get the layers from the different datasets.
  const layers = useMemo(
    () =>
      referencedLayers.map(({ datasetId, layerId, skipCompare }) => {
        const layers = datasets[datasetId]?.data.layers;
        // Get the layer information from the dataset defined in the configuration.
        const layer = layers?.find(
          (l) => l.id === layerId
        ) as DatasetLayer | null;

        // The layers must be defined in the configuration otherwise it is not
        // possible to load them.
        if (!layer) {
          throw new Error(
            `Layer [${layerId}] not found in dataset [${datasetId}]`
          );
        }

        // Skip the compare to avoid unnecessary network requests.
        if (skipCompare) {
          return {
            ...layer,
            compare: null
          };
        }

        return layer;
      }),
    [referencedLayers]
  );

  // Get the layer information from the dataset defined in the configuration.
  return useLayersInit(layers);
};
