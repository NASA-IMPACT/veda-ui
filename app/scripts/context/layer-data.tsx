/* eslint-disable prettier/prettier */
import { useCallback, useEffect, useMemo } from 'react';
import {
  DatasetLayer,
  DatasetLayerCompareNormalized,
  datasets
} from 'delta/thematics';
// Unstated Next provides a small wrapper around React's context api which makes
// handling typescript typing possible.
// More at: https://betterprogramming.pub/how-to-use-react-context-with-typescript-the-easy-way-2ed1010f6e84
import { createContainer } from 'unstated-next';

import { StateSlice, useContexeedApi } from '$utils/contexeed-v2';
import { getCompareLayerData } from '$components/common/mapbox/layers/utils';

interface STACLayerData {
  timeseries: {
    isPeriodic: boolean;
    timeDensity: 'day' | 'month' | null;
    domain: Array<string>;
  };
}

const useHook = () => {
  const { fetchLayerData, getState } = useContexeedApi({
    name: 'layers',
    slicedState: true,
    requests: {
      fetchLayerData: ({ id }: { id: string }) => ({
        sliceKey: id,
        url: `${process.env.API_STAC_ENDPOINT}/collections/${id}`,
        transformData: (data) => ({
          timeseries: {
            isPeriodic: data['dashboard:is_periodic'],
            timeDensity: data['dashboard:time_density'],
            domain: data.summaries.datetime
          }
        })
      })
    }
  });

  return {
    fetchLayerData,
    getState
  };
};

// Container
const LayerDataContainer = createContainer(useHook);

// Container provider
export const LayerDataProvider = LayerDataContainer.Provider;

// /////////////////////////////////////////////////////////////////////////////
// Consumers and helpers
// /////////////////////////////////////////////////////////////////////////////

export interface AsyncDatasetLayer {
  baseLayer: StateSlice<Omit<DatasetLayer, 'compare'> & STACLayerData>;
  compareLayer: StateSlice<DatasetLayerCompareNormalized & STACLayerData>;
  reFetch: (() => void) | null;
}

const useLayersInit = (layers: DatasetLayer[]): AsyncDatasetLayer[] => {
  const { fetchLayerData, getState } = LayerDataContainer.useContainer();

  const fetchData = useCallback(
    (layer) => {
      fetchLayerData({ id: layer.id });
      const compareLayer = getCompareLayerData(layer);
      if (compareLayer && compareLayer.id !== layer.id) {
        fetchLayerData({ id: compareLayer.id });
      }
    },
    [fetchLayerData]
  );

  useEffect(() => {
    if (!layers) return null;
    layers.forEach(fetchData);
  }, [fetchData, layers]);

  return useMemo(() => {
    if (!layers) return null;

    // Merge the data from STAC and the data from the configuration into a
    // single object with meta information about the request status.
    const mergeSTACData = <
      T extends Omit<DatasetLayer, 'compare'> | DatasetLayerCompareNormalized
    >(
      baseData: T
    ): StateSlice<T & STACLayerData> => {
      if (!baseData) return null;

      const dataSTAC = getState<STACLayerData>(baseData.id);
      if (dataSTAC.status !== 'succeeded') return dataSTAC as StateSlice<null>;

      return {
        ...dataSTAC,
        data: {
          ...baseData,
          ...dataSTAC.data
        }
      };
    };

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
        compareLayer: mergeSTACData(compareLayer),
        reFetch: () => fetchData(layer)
      };
    });
  }, [getState, fetchData, layers]);
};

// Context consumers.
export const useDatasetAsyncLayer = (datasetId?: string, layerId?: string) => {
  const hasParams = !!datasetId && !!layerId;
  // Get the layer information from the dataset defined in the configuration.
  const layer = datasets[datasetId]?.data.layers?.find((l) => l.id === layerId);

  // The layers must be defined in the configuration otherwise it is not
  // possible to load them.
  if (hasParams && !layer) {
    throw new Error(`Layer [${layerId}] not found in dataset [${datasetId}]`);
  }

  const layerAsArray = useMemo(() => layer && [layer], [layer]);
  const asyncLayers = useLayersInit(layerAsArray);

  return useMemo(
    () =>
      asyncLayers?.[0] || {
        baseLayer: null,
        compareLayer: null,
        reFetch: null
      },
    [asyncLayers]
  );
};

export const useDatasetAsyncLayers = (datasetId) => {
  // Get the layer information from the dataset defined in the configuration.
  return useLayersInit(datasets[datasetId]?.data.layers);
};
