import React, { createContext, useContext, useEffect, useMemo } from 'react';
import T from 'prop-types';
import { datasets } from 'delta/thematics';

import { useContexeedApi } from '$utils/contexeed-v2';
import {
  getCompareLayerData,
  STAC_ENDPOINT
} from '$components/common/mapbox/layers/utils';

// Context
const LayerDataContext = createContext(null);

// Context provider
export const LayerDataProvider = ({ children }) => {
  const { fetchLayerData, getState } = useContexeedApi({
    name: 'layers',
    slicedState: true,
    requests: {
      fetchLayerData: ({ id }) => ({
        sliceKey: id,
        url: `${STAC_ENDPOINT}/collections/${id}`,
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

  const contextValue = {
    fetchLayerData,
    getState
  };

  return (
    <LayerDataContext.Provider value={contextValue}>
      {children}
    </LayerDataContext.Provider>
  );
};

LayerDataProvider.propTypes = {
  children: T.node
};

const useLayersInit = (layers) => {
  const { fetchLayerData, getState } = useContext(LayerDataContext);

  useEffect(() => {
    if (!layers) return null;

    layers.forEach((layer) => {
      fetchLayerData({ id: layer.id });
      const compareLayer = getCompareLayerData(layer);
      if (compareLayer && compareLayer.id !== layer.id) {
        fetchLayerData({ id: compareLayer.id });
      }
    });
  }, [fetchLayerData, layers]);

  return useMemo(() => {
    if (!layers) return null;

    // Merge the data from STAC and the data from the configuration into a
    // single object with meta information about the request status.
    const mergeSTACData = (baseData) => {
      if (!baseData) return null;

      const dataSTAC = getState(baseData.id);
      if (dataSTAC.status !== 'succeeded') return dataSTAC;

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
        compareLayer: mergeSTACData(compareLayer)
      };
    });
  }, [getState, layers]);
};

// Context consumers.
export const useDatasetLayer = (datasetId, layerId) => {
  const hasParams = !!datasetId && !!layerId;
  // Get the layer information from the dataset defined in the configuration.
  const layer = datasets[datasetId]?.data.layers?.find((l) => l.id === layerId);

  // The layers must be defined in the configuration otherwise it is not
  // possible to load the,.
  if (hasParams && !layer) {
    throw new Error(`Layer [${layerId}] not found in dataset [${datasetId}]`);
  }

  const asyncLayers = useLayersInit(layer && [layer]);

  return useMemo(
    () =>
      asyncLayers?.[0] || {
        baseLayer: null,
        compareLayer: null
      },
    [asyncLayers]
  );
};

export const useDatasetLayers = (datasetId) => {
  // Get the layer information from the dataset defined in the configuration.
  return useLayersInit(datasets[datasetId]?.data.layers);
};
