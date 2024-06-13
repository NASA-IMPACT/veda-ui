import React, { useMemo } from 'react';
// Avoid error: node_modules/date-fns/esm/index.js does not export 'default'
import * as dateFns from 'date-fns';

import { TimelineDatasetSuccess } from '../../types.d.ts';
import { getTimeDensityStartDate } from '../../data-utils';
import {
  useTimelineDatasetAtom,
  useTimelineDatasetSettings
} from '../../atoms/hooks';

import { resolveConfigFunctions } from '$components/common/map/utils';
import { RasterTimeseries } from '$components/common/map/style-generators/raster-timeseries';
import { VectorTimeseries } from '$components/common/map/style-generators/vector-timeseries';
import { ZarrTimeseries } from '$components/common/map/style-generators/zarr-timeseries';
import { CMRTimeseries } from '$components/common/map/style-generators/cmr-timeseries';

interface LayerProps {
  id: string;
  dataset: TimelineDatasetSuccess;
  order?: number;
  selectedDay: Date;
}

export function Layer(props: LayerProps) {
  const { id: layerId, dataset, order, selectedDay } = props;

  let isVisible: boolean | undefined;
  let opacity: number | undefined;

  const datasetAtom = useTimelineDatasetAtom(dataset.data.id);
  
  try {
    // @TECH-DEBT: Wrapping this logic with a try/catch because jotai errors because it is unable to find
    // 'settings' on undefined value even when dataset has 'settings' key. This is a workaround for now but
    // should be revisited. Ideally type should be fine with 'Partial<TimelineDataset>'
    const [getSettings] = useTimelineDatasetSettings(datasetAtom);
  
    isVisible = getSettings('isVisible');
    opacity = getSettings('opacity');
  } catch {
    isVisible = true;
    opacity = undefined;
  }

  // The date needs to match the dataset's time density.
  const relevantDate = useMemo(
    () => getTimeDensityStartDate(selectedDay, dataset.data?.timeDensity),
    [selectedDay, dataset.data?.timeDensity]
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
        />
      );
    case 'cmr-stac':
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
        />
      );
    default:
      throw new Error(`No layer generator for type: ${dataset.data.type}`);
  }
}
