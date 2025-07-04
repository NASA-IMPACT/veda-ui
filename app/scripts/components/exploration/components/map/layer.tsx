import React, { useMemo } from 'react';
// Avoid error: node_modules/date-fns/esm/index.js does not export 'default'
import * as dateFns from 'date-fns';

import { TimelineDatasetSuccess, VizDatasetSuccess } from '../../types.d.ts';
import {
  getRelevantDate,
  getTimeDensityStartDate
} from '$components/exploration/data-utils';

import { resolveConfigFunctions } from '$components/common/map/utils';
import { RasterTimeseries } from '$components/common/map/style-generators/raster-timeseries';
import { VectorTimeseries } from '$components/common/map/style-generators/vector-timeseries';
import { ZarrTimeseries } from '$components/common/map/style-generators/zarr-timeseries';
import { CMRTimeseries } from '$components/common/map/style-generators/cmr-timeseries';
import { WMSTimeseries } from '$components/common/map/style-generators/wms-timeseries';
import { WMTSTimeseries } from '$components/common/map/style-generators/wmts-timeseries';
import { ActionStatus } from '$utils/status';
import { useVedaUI } from '$context/veda-ui-provider';

interface LayerProps {
  id: string;
  dataset: TimelineDatasetSuccess | VizDatasetSuccess;
  order?: number;
  selectedDay: Date;
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
}

export function Layer(props: LayerProps) {
  const { envApiStacEndpoint, envApiRasterEndpoint } = useVedaUI();

  const { id: layerId, dataset, order, selectedDay, onStatusChange } = props;
  const { isVisible, opacity, colorMap, scale } = dataset.settings;

  // The date needs to match the dataset's time density.
  const relevantDate = useMemo(
    () =>
      dataset.data.type === 'wms'
        ? getRelevantDate(selectedDay, dataset.data.domain)
        : getTimeDensityStartDate(selectedDay, dataset.data.timeDensity),
    [
      selectedDay,
      dataset.data.timeDensity,
      dataset.data.domain,
      dataset.data.type
    ]
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
          envApiStacEndpoint={envApiStacEndpoint}
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
          colorMap={colorMap}
          reScale={scale}
          envApiStacEndpoint={envApiStacEndpoint}
          envApiRasterEndpoint={envApiRasterEndpoint}
        />
      );
    case 'cmr':
      return (
        <CMRTimeseries
          id={layerId}
          stacCol={dataset.data.stacCol}
          tileApiEndpoint={dataset.data.tileApiEndpoint}
          date={relevantDate}
          zoomExtent={params.zoomExtent}
          sourceParams={params.sourceParams}
          generatorOrder={order}
          hidden={!isVisible}
          opacity={opacity}
          onStatusChange={onStatusChange}
          colorMap={colorMap}
          reScale={scale}
          envApiStacEndpoint={envApiStacEndpoint}
          envApiRasterEndpoint={envApiRasterEndpoint}
        />
      );
    case 'wms':
      return (
        <WMSTimeseries
          id={layerId}
          stacCol={dataset.data.stacCol}
          stacApiEndpoint={dataset.data.stacApiEndpoint}
          zoomExtent={params.zoomExtent}
          sourceParams={params.sourceParams}
          generatorOrder={order}
          date={relevantDate}
          hidden={!isVisible}
          opacity={opacity}
          onStatusChange={onStatusChange}
        />
      );
    case 'wmts':
      return (
        <WMTSTimeseries
          id={layerId}
          stacCol={dataset.data.stacCol}
          stacApiEndpoint={dataset.data.stacApiEndpoint}
          zoomExtent={params.zoomExtent}
          sourceParams={params.sourceParams}
          generatorOrder={order}
          date={relevantDate}
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
          reScale={scale}
          envApiStacEndpoint={envApiStacEndpoint}
          envApiRasterEndpoint={envApiRasterEndpoint}
        />
      );
    default:
      throw new Error(`No layer generator for type: ${dataset.data.type}`);
  }
}
