import React, { useMemo } from 'react';
// Avoid error: node_modules/date-fns/esm/index.js does not export 'default'
import * as dateFns from 'date-fns';

import { TimelineDatasetSuccess, VizDatasetSuccess } from '../../types.d.ts';
import { getTimeDensityStartDate } from '../../data-utils-no-faux-module.js';

import { resolveConfigFunctions } from '$components/common/map/utils';
import { RasterTimeseries } from '$components/common/map/style-generators/raster-timeseries';
import { VectorTimeseries } from '$components/common/map/style-generators/vector-timeseries';
import { ZarrTimeseries } from '$components/common/map/style-generators/zarr-timeseries';
import { CMRTimeseries } from '$components/common/map/style-generators/cmr-timeseries';
import { ActionStatus } from '$utils/status';

interface LayerProps {
  id: string;
  dataset: TimelineDatasetSuccess | VizDatasetSuccess;
  order?: number;
  selectedDay: Date;
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  colorMap?: string;
}

export function Layer(props: LayerProps) {
  const { id: layerId, dataset, order, selectedDay, onStatusChange, colorMap } = props;

  const { isVisible, opacity } = dataset.settings;

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

  switch (dataset.data.type) {
    case 'vector':
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
          onStatusChange={onStatusChange}
        />
      );
    case 'zarr':
      return (
        <ZarrTimeseries
          id={layerId}
          stacCol={dataset.data.stacCol}
          stacApiEndpoint={dataset.data.stacApiEndpoint}
          tileApiEndpoint={dataset.data.tileApiEndpoint}
          date={relevantDate}
          zoomExtent={params.zoomExtent}
          sourceParams={params.sourceParams}
          generatorOrder={order}
          hidden={!isVisible}
          opacity={opacity}
          onStatusChange={onStatusChange}
        />
      );
    case 'cmr':
      return (
        <CMRTimeseries
          id={layerId}
          stacCol={dataset.data.stacCol}
          stacApiEndpoint={dataset.data.stacApiEndpoint}
          tileApiEndpoint={dataset.data.tileApiEndpoint}
          assetUrlReplacements={dataset.data.assetUrlReplacements}
          date={relevantDate}
          zoomExtent={params.zoomExtent}
          sourceParams={params.sourceParams}
          generatorOrder={order}
          hidden={!isVisible}
          opacity={opacity}
          onStatusChange={onStatusChange}
        />
      );
    case 'raster':
      return (
        <RasterTimeseries
          id={layerId}
          stacCol={dataset.data.stacCol}
          stacApiEndpoint={dataset.data.stacApiEndpoint}
          tileApiEndpoint={dataset.data.tileApiEndpoint}
          date={relevantDate}
          zoomExtent={params.zoomExtent}
          sourceParams={params.sourceParams}
          generatorOrder={order}
          hidden={!isVisible}
          opacity={opacity}
          onStatusChange={onStatusChange}
          colorMap={colorMap}
        />
      );
    default:
      throw new Error(`No layer generator for type: ${dataset.data.type}`);
  }
}
