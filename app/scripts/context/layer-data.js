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

// Context consumers.
export const useDatasetLayer = (datasetId, layerId) => {
  const { fetchLayerData, getState } = useContext(LayerDataContext);

  const hasParams = !!datasetId && !!layerId;
  // Get the layer information from the dataset defined in the configuration.
  const layer = datasets[datasetId]?.data.layers?.find((l) => l.id === layerId);

  // The layers must be defined in the configuration otherwise it is not
  // possible to load the,.
  if (hasParams && !layer) {
    throw new Error(`Layer [${layerId}] not found in dataset [${datasetId}]`);
  }

  // Get data from STAC for the baseLayer.
  useEffect(() => {
    if (!hasParams) return null;
    fetchLayerData({ id: layer.id });
  }, [fetchLayerData, layer, hasParams]);

  // The compare definition needs to be resolved to a real layer before making
  // any STAC request.
  // The values for the compare layer will depend on how it is defined:
  // is if from a dataset?
  // is it a layer defined in-line?
  const compareLayer = useMemo(() => getCompareLayerData(layer), [layer]);

  // Get data from STAC for the compare layer
  useEffect(() => {
    if (!hasParams || !compareLayer) return null;
    setTimeout(() => {
      fetchLayerData({ id: compareLayer.id });
    }, 0);
  }, [fetchLayerData, compareLayer, hasParams]);

  return useMemo(() => {
    if (!hasParams)
      return {
        baseLayer: null,
        compareLayer: null
      };

    // Remove compare from layer
    const { compare, ...layerProps } = layer;

    // Merge the data from STAC and the data from the configuration into a
    // single object with meta information about the request status.
    const mergeSTACData = (configData) => {
      if (!configData) return null;

      const dataSTAC = getState(configData.id);
      if (dataSTAC.status !== 'succeeded') return dataSTAC;

      return {
        ...dataSTAC,
        data: {
          ...configData,
          ...dataSTAC.data
        }
      };
    };

    return {
      baseLayer: mergeSTACData(layerProps),
      compareLayer: mergeSTACData(compareLayer)
    };
  }, [hasParams, getState, layer, compareLayer]);
};
