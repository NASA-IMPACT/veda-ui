import React, { useState, useMemo } from 'react';
import T from 'prop-types';
import LazyLoad from 'react-lazyload';

import Chart from '$components/common/chart/block';
import { chartMaxHeight } from '$components/common/chart/constant';

import Table, { tableHeight } from '$components/common/table';
import CompareImage from '$components/common/blocks/images/compare';

import Map, {
  mapHeight,
  getDataLayer
} from '$components/common/blocks/block-map';
import Embed from '$components/common/blocks/embed';
import {
  ScrollytellingBlock,
  SCROLLY_MAP_HEIGHT
} from '$components/common/blocks/scrollytelling';

import { LoadingSkeleton } from '$components/common/loading-skeleton';
import { veda_faux_module_datasets } from '$data-layer/datasets';
import { getDatasetLayers } from '$utils/data-utils';
import { reconcileDatasets } from '$components/exploration/data-utils';
import { useReconcileWithStacMetadata } from '$components/exploration/hooks/use-stac-metadata-datasets';
import { useVedaUI } from '$context/veda-ui-provider';

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

// export function LazyMap(props) {
//   return (
//     <LazyLoad
//       placeholder={<LoadingSkeleton height={mapHeight} />}
//       offset={100}
//       once
//     >
//       <Map {...props} datasets={veda_faux_module_datasets} />
//     </LazyLoad>
//   );
// }

export function LazyMap(props) {
  const datasetLayers = getDatasetLayers(veda_faux_module_datasets);
  const { layerId } = props;

  const layersToFetch = useMemo(() => {
    const [baseMapStaticData] = reconcileDatasets([layerId], datasetLayers, []);
    let totalLayers = [baseMapStaticData];
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
    return totalLayers;
  }, [layerId, datasetLayers]);

  const [layers, setLayers] = useState(layersToFetch);

  const { envApiStacEndpoint } = useVedaUI();

  useReconcileWithStacMetadata(layers, setLayers, envApiStacEndpoint);

  const baseDataLayer = useMemo(() => getDataLayer(0, layers), [layers]);
  const compareDataLayer = useMemo(() => getDataLayer(1, layers), [layers]);

  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={mapHeight} />}
      offset={100}
      once
    >
      <Map
        {...props}
        baseDataLayer={baseDataLayer}
        compareDataLayer={compareDataLayer}
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
