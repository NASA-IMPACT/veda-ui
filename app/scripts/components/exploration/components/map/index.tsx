import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';

import { useReconcileWithStacMetadata } from '../../hooks/use-stac-metadata-datasets';
import { selectedCompareDateAtom, selectedDateAtom } from '../../atoms/dates';
import { timelineDatasetsAtom } from '../../atoms/datasets';
import {
  TimelineDatasetStatus,
  TimelineDatasetSuccess
} from '../../types.d.ts';
import { projectionDefault } from '$components/common/map/controls/map-options/projections';
import { useBasemap } from '$components/common/map/controls/hooks/use-basemap';
import { usePreviousValue } from '$utils/use-effect-previous';
import MapContainer from '$components/common/map/map-container';
import { BasemapId } from '$components/common/map/controls/map-options/basemap';

export function ExplorationMap() {
  const [projection, setProjection] = useState(projectionDefault);

  const {
    mapBasemapId,
    setBasemapId,
    labelsOption,
    boundariesOption,
    onOptionChange
  } = useBasemap();

  const [datasets, setDatasets] = useAtom(timelineDatasetsAtom);

  useReconcileWithStacMetadata(datasets, setDatasets);

  const selectedDay = useAtomValue(selectedDateAtom);
  const selectedCompareDay = useAtomValue(selectedCompareDateAtom);

  // Different datasets may have a different default projection.
  // When datasets are selected the first time, we set the map projection to the
  // first dataset's projection.
  const prevDatasetCount = usePreviousValue(datasets.length);
  useEffect(() => {
    if (!prevDatasetCount && datasets.length > 0) {
      setProjection(datasets[0].data.projection ?? projectionDefault);
    }
  }, [datasets, prevDatasetCount]);

  // If all the datasets are changed through the modal, we also want to update
  // the map projection, since it is as if the datasets were selected for the
  // first time.
  // The only case where we don't want to update the projection is when not all
  // datasets are changed, because it is not possible to know which projection
  // to use.
  const prevDatasetsIds = usePreviousValue(datasets.map((d) => d.data.id));
  useEffect(() => {
    if (!prevDatasetsIds) return;

    const newDatasetsIds = datasets.map((d) => d.data.id);
    const hasSameId = newDatasetsIds.some((id) => prevDatasetsIds.includes(id));

    if (!hasSameId && datasets.length > 0) {
      setProjection(datasets[0].data.projection ?? projectionDefault);
    }
  }, [prevDatasetsIds, datasets]);

  const comparing = !!selectedCompareDay;

  // Reverse the datasets order to have the "top" layer, list-wise, at the "top" layer, z-order wise
  // Disabled eslint rule as slice() creates a shallow copy
  // eslint-disable-next-line fp/no-mutating-methods
  const loadedDatasets = datasets
    .filter(
      (d): d is TimelineDatasetSuccess =>
        d.status === TimelineDatasetStatus.SUCCESS
    )
    .slice()
    .reverse();

  const onStyleUpdate = useCallback(
    (style) => {
      const updatedDatasets = datasets.map((dataset) => {
        // Skip non loaded datasets
        if (dataset.status !== TimelineDatasetStatus.SUCCESS) return dataset;

        // Check if there's layer information for this dataset.
        const layerMetadata = style.layers.find(
          (l) => l.metadata?.id === dataset.data.id
        );

        // Skip if no metadata.
        if (!layerMetadata) return dataset;

        const currentMeta = dataset.meta ?? {};

        return {
          ...dataset,
          meta: {
            ...currentMeta,
            tileUrls: {
              wmtsTileUrl: layerMetadata.metadata.wmtsTileUrl,
              xyzTileUrl: layerMetadata.metadata.xyzTileUrl
            }
          }
        };
      });

      setDatasets(updatedDatasets);
    },
    [datasets, setDatasets]
  );

  const renderControls = useMemo(
    () => ({
      draw: true,
      customAoI: true,
      analysisMessage: true,
      geocoder: true,
      mapOptions: true,
      scale: true,
      showTour: true,
      mapCoords: true,
      navigation: true,
      navigationPosition: 'top-right'
    }),
    []
  );

  const resolvedDatasets = useMemo(
    () =>
      selectedDay
        ? loadedDatasets.map((dataset) => ({
            id: dataset.data.id,
            dataset: dataset,
            selectedDay: selectedDay as Date
          }))
        : [],
    [loadedDatasets, selectedDay]
  );

  const resolvedCompareDatasets = useMemo(
    () =>
      comparing
        ? loadedDatasets.map((dataset) => ({
            id: `${dataset.data.id}-compare`,
            dataset: dataset,
            selectedDay: selectedCompareDay as Date
          }))
        : [],
    [loadedDatasets, comparing, selectedCompareDay]
  );

  return (
    <MapContainer
      id='exploration'
      mapOptions={{}}
      boundariesOption={boundariesOption}
      labelsOption={labelsOption}
      basemapStyleId={mapBasemapId as BasemapId}
      datasets={resolvedDatasets}
      selectedDay={selectedDay as Date}
      compareDatasets={resolvedCompareDatasets}
      selectedCompareDay={selectedCompareDay as Date}
      renderControls={renderControls}
      computedCompareLabel={'Comparing data'}
      onProjectionChange={setProjection}
      onBasemapStyleIdChange={setBasemapId}
      onOptionChange={onOptionChange}
      projection={projection}
      onStyleUpdate={onStyleUpdate}
      disableCompareReason={
        comparing ? 'Analysis is not possible when comparing dates' : undefined
      }
    />
  );
}
