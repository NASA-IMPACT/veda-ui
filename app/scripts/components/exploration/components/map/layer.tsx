import React, { useMemo } from 'react';
// Avoid error: node_modules/date-fns/esm/index.js does not export 'default'
import * as dateFns from 'date-fns';

import { TimelineDatasetSuccess } from '../../types.d.ts';
import { getTimeDensityStartDate } from '../../data-utils';
import {
  useTimelineDatasetAtom,
  useTimelineDatasetSettings
} from '../../atoms/hooks';

import { RasterTimeseries } from '$components/common/map/style-generators/raster-timeseries';
import { resolveConfigFunctions } from '$components/common/map/utils';

interface LayerProps {
  id: string;
  dataset: TimelineDatasetSuccess;
  order: number;
  selectedDay: Date;
}

export function Layer(props: LayerProps) {
  const { id: layerId, dataset, order, selectedDay } = props;

  const datasetAtom = useTimelineDatasetAtom(dataset.data.id);
  const [getSettings] = useTimelineDatasetSettings(datasetAtom);

  const isVisible = getSettings('isVisible');
  const opacity = getSettings('opacity');

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
}
