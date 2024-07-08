import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
// Avoid error: node_modules/date-fns/esm/index.js does not export 'default'
import * as dateFns from 'date-fns';
import { TimelineDatasetSuccess, VizDatasetSuccess } from '../../types.d.ts';
import { getTimeDensityStartDate } from '../../data-utils';
import { StacFeature } from '$components/common/map/types';

import { resolveConfigFunctions } from '$components/common/map/utils';
import { RasterTimeseries } from '$components/common/map/style-generators/raster-timeseries';
import { VectorTimeseries } from '$components/common/map/style-generators/vector-timeseries';
import { Statuses, STATUS_KEY, StatusData } from '$components/common/map/types.d';
import { ActionStatus } from '$utils/status';
import { TileUrls, useZarr, useMosaic, useCMRSTAC, useTitilerCMR, useStacCollection, UseDatasetTilesHooks } from '$components/common/map/style-generators/hooks';
import {
  S_IDLE,
  S_SUCCEEDED,
  S_FAILED,
  S_LOADING
} from '$utils/status';


interface LayerProps {
  id: string;
  dataset: TimelineDatasetSuccess | VizDatasetSuccess;
  order?: number;
  selectedDay: Date;
  onStatusChange?: (result: StatusData) => void;
}

// Mapping object to select the appropriate hook based on dataset type
const datasetTypeHooksMap = {
  zarr: useZarr,
  'titiler-cmr': useTitilerCMR,
  'cmr-stac': useCMRSTAC,
  'raster': useMosaic,
};

export function Layer(props: LayerProps) {
  const { id: layerId, dataset, order, selectedDay, onStatusChange } = props;
  const [tileUrls, setTileUrls] = useState<TileUrls>({});
  const [stacCollection, setStacCollection] = useState<StacFeature[]>([]);

  const assetUrlReplacements = dataset.data.assetUrlReplacements;
  const { isVisible, opacity } = dataset.settings;

  // How to create a type interface for arguments to the useDatasetTiles functions
  // Determine which hook to use based on the dataset type
  const useDatasetTiles: UseDatasetTilesHooks = datasetTypeHooksMap[dataset.data.type];

  // Status tracking.
  // A raster timeseries layer has a base layer and may have markers.
  // The status is succeeded only if all requests succeed.
  // putting this in the layer componenet because it simplifies the RasterTimeseries component
  const statuses = useRef<Statuses>({
    [STATUS_KEY.Global]: S_IDLE,
    [STATUS_KEY.Layer]: S_IDLE,
    [STATUS_KEY.StacSearch]: S_IDLE
  });

  const changeStatus = useCallback(
    ({
      status,
      context,
      id
    }: {
      status: ActionStatus;
      context: STATUS_KEY;
      id: string;
    }) => {
      // Set the new status
      statuses.current[context] = status;

      const layersToCheck = [
        statuses.current[STATUS_KEY.StacSearch],
        statuses.current[STATUS_KEY.Layer]
      ];

      let newStatus = statuses.current[STATUS_KEY.Global];
      // All must succeed to be considered successful.
      if (layersToCheck.every((s) => s === S_SUCCEEDED)) {
        newStatus = S_SUCCEEDED;

        // One failed status is enough for all.
        // Failed takes priority over loading.
      } else if (layersToCheck.some((s) => s === S_FAILED)) {
        newStatus = S_FAILED;
        // One loading status is enough for all.
      } else if (layersToCheck.some((s) => s === S_LOADING)) {
        newStatus = S_LOADING;
      } else if (layersToCheck.some((s) => s === S_IDLE)) {
        newStatus = S_IDLE;
      }

      // Only emit on status change.
      if (newStatus !== statuses.current[STATUS_KEY.Global]) {
        statuses.current[STATUS_KEY.Global] = newStatus;
        // bubble up changes
        onStatusChange?.({ status: newStatus, id, context });
      }
    },
    [onStatusChange]
  );

  // The date needs to match the dataset's time density.
  const relevantDate = useMemo(
    () => getTimeDensityStartDate(selectedDay, dataset.data.timeDensity),
    [selectedDay, dataset.data.timeDensity]
  );

  // Resolve config functions.
  const params = useMemo(() => {
    const bag = {
      date: relevantDate,
      compareDatetime: relevantDate,
      dateFns,
      raw: dataset.data
    };
    return resolveConfigFunctions(dataset.data, bag);
  }, [dataset, relevantDate]);

  const stacApiEndpointToUse = dataset.data.stacApiEndpoint ?? process.env.API_STAC_ENDPOINT;
  const tileApiEndpointToUse = dataset.data.tileApiEndpoint ?? process.env.API_TILE_ENDPOINT;

  const fetchTileUrls = useDatasetTiles({
    id: layerId,
    stacCol: dataset.data.stacCol,
    tileApiEndpointToUse: tileApiEndpointToUse || '',
    stacApiEndpointToUse: stacApiEndpointToUse || '',
    assetUrlReplacements,
    date: relevantDate,
    onStatusChange: changeStatus,
    sourceParams: params.sourceParams,
    datasetType: dataset.data.type,
  });

  const fetchStacCollection = useStacCollection({
    id: layerId,
    stacCol: dataset.data.stacCol,
    date: relevantDate,
    stacApiEndpointToUse: stacApiEndpointToUse || '',
    onStatusChange: changeStatus,
    datasetType: dataset.data.type,
  });

  useEffect(() => {
    setStacCollection(fetchStacCollection);
    setTileUrls(fetchTileUrls);
}, [fetchTileUrls, fetchStacCollection]);

  if (dataset.data.type === 'vector') {
    return (
      <VectorTimeseries
        id={layerId}
        stacCol={dataset.data.stacCol}
        stacApiEndpoint={dataset.data.stacApiEndpoint}
        date={relevantDate}
        zoomExtent={params.zoomExtent}
        sourceParams={params.sourceParams}
        generatorOrder={order}
        hidden={!isVisible}
        opacity={opacity}
        onStatusChange={changeStatus}
      />
    );    
  } else if (['raster', 'titiler-cmr', 'cmr-stac', 'zarr'].includes(dataset.data.type)) {
    return (
      <RasterTimeseries
        id={layerId}
        stacCollection={stacCollection}
        zoomExtent={params.zoomExtent}
        tileJsonUrl={tileUrls.tileJsonUrl}
        wmtsTilesUrl={tileUrls.wmtsUrl}
        tileServerUrl={tileUrls.tileServerUrl}
        generatorOrder={order}
        hidden={!isVisible}
        opacity={opacity}
        onStatusChange={changeStatus}
      />
    );
  } else {
    throw new Error(`No layer generator for type: ${dataset.data.type}`);
  }
}
