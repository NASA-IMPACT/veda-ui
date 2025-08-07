import React, { useMemo, useState, useEffect } from 'react';
import T from 'prop-types';
import LazyLoad from 'react-lazyload';

import Chart from '$components/common/chart/block';
import { chartMaxHeight } from '$components/common/chart/constant';

import Table, { tableHeight } from '$components/common/table';
import CompareImage from '$components/common/blocks/images/compare';

import Map, { mapHeight } from '$components/common/blocks/block-map';
import MultiLayerMapBlock from '$components/common/blocks/multilayer-block-map';
import Embed from '$components/common/blocks/embed';
import {
  ScrollytellingBlock,
  SCROLLY_MAP_HEIGHT
} from '$components/common/blocks/scrollytelling';

import { LoadingSkeleton } from '$components/common/loading-skeleton';
import { veda_faux_module_datasets } from '$data-layer/datasets';
import { reconcileDatasets } from '$components/exploration/data-utils';
import { getDatasetLayers } from '$utils/data-utils';
import { useReconcileWithStacMetadata } from '$components/exploration/hooks/use-stac-metadata-datasets';
import { DatasetStatus } from '$components/exploration/types.d.ts';
import { useVedaUI } from '$context/veda-ui-provider';

const getDataLayer = (layerIndex, layers) => {
  if (!layers || layers.length <= layerIndex) return null;
  const layer = layers[layerIndex];
  if (layer.status !== DatasetStatus.SUCCESS) return null;
  return {
    ...layer,
    settings: {
      isVisible: true,
      opacity: 100
    }
  };
};

function useMapLayers(layerId, datasets, includeCompare = true) {
  const { envApiStacEndpoint } = useVedaUI();

  const datasetLayers = useMemo(() => getDatasetLayers(datasets), [datasets]);

  const layersToFetch = useMemo(() => {
    const [baseMapStaticData] = reconcileDatasets([layerId], datasetLayers, []);
    let totalLayers = [baseMapStaticData];

    if (includeCompare) {
      const baseMapStaticCompareData = baseMapStaticData.data.compare;
      if (baseMapStaticCompareData && 'layerId' in baseMapStaticCompareData) {
        const compareLayerId = baseMapStaticCompareData.layerId;
        const [compareMapStaticData] = reconcileDatasets(
          compareLayerId ? [compareLayerId] : [],
          datasetLayers,
          []
        );
        totalLayers = [...totalLayers, compareMapStaticData];
      }
    }
    return totalLayers;
  }, [layerId, datasetLayers, includeCompare]);

  const [layers, setLayers] = useState(layersToFetch);

  useEffect(() => {
    setLayers(layersToFetch);
  }, [layersToFetch]);

  useReconcileWithStacMetadata(layers, setLayers, envApiStacEndpoint);

  const baseDataLayer = useMemo(() => getDataLayer(0, layers), [layers]);

  const compareDataLayer = useMemo(
    () => (includeCompare ? getDataLayer(1, layers) : null),
    [layers, includeCompare]
  );

  return { baseDataLayer, compareDataLayer };
}

function useAvailableLayers(datasetId, datasets) {
  return useMemo(() => {
    if (!datasetId || !datasets[datasetId]) return [];
    return datasets[datasetId]?.data?.layers || [];
  }, [datasetId, datasets]);
}

export function LazyChart(props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={`${chartMaxHeight}px`} />}
      offset={50}
      once
    >
      <Chart {...props} />
    </LazyLoad>
  );
}

export function LazyScrollyTelling(props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={SCROLLY_MAP_HEIGHT} />}
      offset={100}
      once
    >
      <ScrollytellingBlock {...props} datasets={veda_faux_module_datasets} />
    </LazyLoad>
  );
}

export function LazyMap({ datasetId, layerId, ...otherProps }) {
  const { baseDataLayer, compareDataLayer } = useMapLayers(
    layerId,
    veda_faux_module_datasets,
    true
  );

  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={mapHeight} />}
      offset={100}
      once
    >
      <Map
        {...otherProps}
        datasetId={datasetId}
        layerId={layerId}
        baseDataLayer={baseDataLayer}
        compareDataLayer={compareDataLayer}
      />
    </LazyLoad>
  );
}

export function LazyMultilayerMap({ datasetId, layerId, ...otherProps }) {
  const [selectedLayerId, setSelectedLayerId] = useState(layerId);

  useEffect(() => {
    setSelectedLayerId(layerId);
  }, [layerId]);

  const { baseDataLayer } = useMapLayers(
    selectedLayerId,
    veda_faux_module_datasets,
    false
  );

  const availableLayers = useAvailableLayers(
    datasetId,
    veda_faux_module_datasets
  );

  const handleLayerChange = (newLayerId) => {
    setSelectedLayerId(newLayerId);
  };

  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={mapHeight} />}
      offset={100}
      once
    >
      <MultiLayerMapBlock
        {...otherProps}
        datasetId={datasetId}
        layerId={selectedLayerId}
        baseDataLayer={baseDataLayer}
        availableLayers={availableLayers}
        onLayerChange={handleLayerChange}
      />
    </LazyLoad>
  );
}

export function LazyCompareImage(props) {
  return (
    // We don't know the height of image, passing an arbitrary number (200) for placeholder height
    <LazyLoad placeholder={<LoadingSkeleton height={200} />} offset={50} once>
      <CompareImage {...props} />
    </LazyLoad>
  );
}

export function LazyTable(props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={tableHeight} />}
      offset={50}
      once
    >
      <Table {...props} />
    </LazyLoad>
  );
}

export function LazyEmbed(props) {
  return (
    <LazyLoad
      // eslint-disable-next-line react/prop-types
      placeholder={<LoadingSkeleton height={props.height} />}
      offset={50}
      once
    >
      <Embed {...props} />
    </LazyLoad>
  );
}

LazyEmbed.propTypes = {
  src: T.string,
  height: T.number
};

LazyMap.propTypes = {
  datasetId: T.string,
  layerId: T.string.isRequired
};

LazyMultilayerMap.propTypes = {
  datasetId: T.string,
  layerId: T.string.isRequired
};
