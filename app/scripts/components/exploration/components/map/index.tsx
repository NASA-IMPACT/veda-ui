import React, { useState } from 'react';
import { useAtomValue } from 'jotai';

import { useStacMetadataOnDatasets } from '../../hooks/use-stac-metadata-datasets';
import { selectedCompareDateAtom, selectedDateAtom } from '../../atoms/dates';
import { timelineDatasetsAtom } from '../../atoms/datasets';
import {
  TimelineDatasetStatus,
  TimelineDatasetSuccess
} from '../../types.d.ts';
import { Layer } from './layer';
import { AnalysisMessageControl } from './analysis-message-control';

import Map, { Compare, MapControls } from '$components/common/map';
import { Basemap } from '$components/common/map/style-generators/basemap';
import GeocoderControl from '$components/common/map/controls/geocoder';
import { ScaleControl } from '$components/common/map/controls';
import MapCoordsControl from '$components/common/map/controls/coords';
import MapOptionsControl from '$components/common/map/controls/map-options';
import { projectionDefault } from '$components/common/map/controls/map-options/projections';
import { useBasemap } from '$components/common/map/controls/hooks/use-basemap';
import DrawControl from '$components/common/map/controls/aoi';
import CustomAoIControl from '$components/common/map/controls/aoi/custom-aoi-control';
import ResetAoIControl from '$components/common/map/controls/aoi/reset-aoi-control';

export function ExplorationMap() {
  const [projection, setProjection] = useState(projectionDefault);

  const {
    mapBasemapId,
    setBasemapId,
    labelsOption,
    boundariesOption,
    onOptionChange
  } = useBasemap();

  useStacMetadataOnDatasets();

  const datasets = useAtomValue(timelineDatasetsAtom);
  const selectedDay = useAtomValue(selectedDateAtom);
  const selectedCompareDay = useAtomValue(selectedCompareDateAtom);

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

  return (
    <Map id='exploration' projection={projection}>
      {/* Map layers */}
      <Basemap
        basemapStyleId={mapBasemapId}
        labelsOption={labelsOption}
        boundariesOption={boundariesOption}
      />
      {selectedDay &&
        loadedDatasets.map((dataset, idx) => (
          <Layer
            key={dataset.data.id}
            id={dataset.data.id}
            dataset={dataset}
            selectedDay={selectedDay}
            order={idx}
          />
        ))}
      {/* Map controls */}
      <MapControls>
        <DrawControl
          displayControlsDefault={false}
          controls={
            {
              polygon: true,
              trash: true
            } as any
          }
        />
        <CustomAoIControl />
        <ResetAoIControl />
        <AnalysisMessageControl />
        <GeocoderControl />
        <MapOptionsControl
          projection={projection}
          onProjectionChange={setProjection}
          basemapStyleId={mapBasemapId}
          onBasemapStyleIdChange={setBasemapId}
          labelsOption={labelsOption}
          boundariesOption={boundariesOption}
          onOptionChange={onOptionChange}
        />

        <ScaleControl />
        <MapCoordsControl />
      </MapControls>
      {comparing && (
        // Compare map layers
        <Compare>
          <Basemap
            basemapStyleId={mapBasemapId}
            labelsOption={labelsOption}
            boundariesOption={boundariesOption}
          />
          {selectedDay &&
            loadedDatasets.map((dataset, idx) => (
              <Layer
                key={dataset.data.id}
                id={`${dataset.data.id}-compare`}
                dataset={dataset}
                selectedDay={selectedCompareDay}
                order={idx}
              />
            ))}
        </Compare>
      )}
    </Map>
  );
}
