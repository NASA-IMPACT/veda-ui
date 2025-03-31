import React, { useCallback, useEffect, useState } from 'react';

import { useReconcileWithStacMetadata } from '../../hooks/use-stac-metadata-datasets';
import {
  TimelineDataset,
  DatasetStatus,
  TimelineDatasetSuccess
} from '../../types.d.ts';
import { Layer } from './layer';
import { AnalysisMessageControl } from './analysis-message-control';
import { ShowTourControl } from './tour-control';
import AoiLayer from './aoi-layer';
import { ProjectionOptions } from '$types/veda';

import Map, { Compare, MapControls } from '$components/common/map';
import { Basemap } from '$components/common/map/style-generators/basemap';
import GeocoderControl from '$components/common/map/controls/geocoder';
import {
  NavigationControl,
  ScaleControl
} from '$components/common/map/controls';
import MapCoordsControl from '$components/common/map/controls/coords';
import useAois from '$components/common/map/controls/hooks/use-aois';
import MapOptionsControl from '$components/common/map/controls/map-options';
import { projectionDefault } from '$components/common/map/controls/map-options/projections';
import { useBasemap } from '$components/common/map/controls/hooks/use-basemap';
import { usePreviousValue } from '$utils/use-effect-previous';
import { ExtendedStyle } from '$components/common/map/styles';
import AoiControl from '$components/common/map/controls/aoi/aoi-control';
import { useVedaUI } from '$context/veda-ui-provider';

interface ExplorationMapProps {
  datasets: TimelineDataset[];
  setDatasets: (datasets: TimelineDataset[]) => void;
  selectedDay: Date | null;
  selectedCompareDay: Date | null;
}

export function ExplorationMap(props: ExplorationMapProps) {
  const { envApiStacEndpoint, envMapboxToken } = useVedaUI();

  const { datasets, setDatasets, selectedDay, selectedCompareDay } = props;

  const [projection, setProjection] =
    useState<ProjectionOptions>(projectionDefault);

  const {
    mapBasemapId,
    setBasemapId,
    labelsOption,
    boundariesOption,
    onOptionChange
  } = useBasemap();

  useReconcileWithStacMetadata(datasets, setDatasets, envApiStacEndpoint);

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
      (d): d is TimelineDatasetSuccess => d.status === DatasetStatus.SUCCESS
    )
    .slice()
    .reverse();

  const onStyleUpdate = useCallback(
    (style: ExtendedStyle) => {
      const updatedDatasets = datasets.map((dataset) => {
        // Skip non loaded datasets
        if (dataset.status !== DatasetStatus.SUCCESS) return dataset;

        // Check if there's layer information for this dataset.
        let layerMetadata;
        try {
          layerMetadata = style.layers.find(
            (l) => (l.metadata as { id: string }).id === dataset.data.id
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('Can not find metadata for', dataset.data.id);
        }

        // Skip if no metadata.
        if (!layerMetadata) return dataset;

        const currentMeta = dataset.meta ?? {};

        return {
          ...dataset,
          meta: {
            ...currentMeta,
            tileUrls: {
              wmtsTileUrl: (layerMetadata.metadata as { wmtsTileUrl: string })
                .wmtsTileUrl,
              xyzTileUrl: (layerMetadata.metadata as { xyzTileUrl: string })
                .xyzTileUrl,
              wmsTileUrl: (layerMetadata.metadata as { wmsTileUrl: string })
                .wmsTileUrl
            }
          }
        };
      });

      setDatasets(updatedDatasets);
    },
    [datasets, setDatasets]
  );

  const { aoi, isDrawing } = useAois();

  return (
    <Map id='exploration' projection={projection} onStyleUpdate={onStyleUpdate}>
      {/* Map layers */}
      <Basemap
        basemapStyleId={mapBasemapId}
        labelsOption={labelsOption}
        boundariesOption={boundariesOption}
      />
      {selectedDay && (
        <ExplorationMapLayers
          datasets={loadedDatasets}
          selectedDay={selectedDay}
        />
      )}
      {/* Map controls */}
      <MapControls>
        <AoiControl
          disableReason={
            comparing && 'Analysis is not possible when comparing dates'
          }
        />

        {aoi && <AoiLayer aoi={aoi} />}

        {!isDrawing && <AnalysisMessageControl />}
        <GeocoderControl envMapboxToken={envMapboxToken} />
        <MapOptionsControl
          envMapboxToken={envMapboxToken}
          projection={projection}
          onProjectionChange={setProjection}
          basemapStyleId={mapBasemapId}
          onBasemapStyleIdChange={setBasemapId}
          labelsOption={labelsOption}
          boundariesOption={boundariesOption}
          onOptionChange={onOptionChange}
        />
        <ScaleControl />
        <ShowTourControl />
        <MapCoordsControl />
        <NavigationControl />
      </MapControls>
      {comparing && (
        // Compare map layers
        <Compare>
          <Basemap
            basemapStyleId={mapBasemapId}
            labelsOption={labelsOption}
            boundariesOption={boundariesOption}
          />
          {selectedDay && (
            <ExplorationMapLayers
              datasets={loadedDatasets}
              selectedDay={selectedCompareDay}
              idSuffix='-compare'
            />
          )}
        </Compare>
      )}
    </Map>
  );
}

interface ExplorationMapLayersProps {
  datasets: TimelineDatasetSuccess[];
  selectedDay: Date;
  idSuffix?: string;
}

export function ExplorationMapLayers(props: ExplorationMapLayersProps) {
  const { datasets, selectedDay, idSuffix = '' } = props;

  return (
    <>
      {datasets.map((dataset, idx) => (
        <Layer
          key={dataset.data.id}
          id={`${dataset.data.id}${idSuffix}`}
          dataset={dataset}
          selectedDay={selectedDay}
          order={idx}
        />
      ))}
    </>
  );
}
