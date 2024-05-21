import React from 'react';
import { ProjectionOptions } from 'veda';
import {
  TimelineDataset,
  TimelineDatasetStatus,
  TimelineDatasetSuccess
} from '../../types.d.ts';
import { Layer } from './layer';
import { AnalysisMessageControl } from './analysis-message-control';
import { ShowTourControl } from './tour-control';

import Map, { Compare, MapControls } from '$components/common/map';
import { Basemap } from '$components/common/map/style-generators/basemap';
import GeocoderControl from '$components/common/map/controls/geocoder';
import {
  NavigationControl,
  ScaleControl
} from '$components/common/map/controls';
import MapCoordsControl from '$components/common/map/controls/coords';
import MapOptionsControl from '$components/common/map/controls/map-options';
import DrawControl from '$components/common/map/controls/aoi';
import CustomAoIControl from '$components/common/map/controls/aoi/custom-aoi-control';
import { BasemapId } from '$components/common/map/controls/map-options/basemap.js';

interface ExplorationMapProps {
  datasets: TimelineDataset[];
  selectedDay: Date | null;
  selectedCompareDay: Date | null;
  mapBasemapId: BasemapId;
  setBasemapId: (id: BasemapId) => void;
  labelsOption: boolean;
  boundariesOption: boolean;
  onOptionChange: (option: string, value: boolean) => void;
  onStyleUpdate: (style: any) => void;
  projection: ProjectionOptions;
  setProjection: (projection: ProjectionOptions) => void;
}

export function ExplorationMap({
  datasets,
  selectedDay,
  selectedCompareDay,
  mapBasemapId,
  setBasemapId,
  labelsOption,
  boundariesOption,
  onOptionChange,
  onStyleUpdate,
  projection,
  setProjection
}: ExplorationMapProps) {
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

  const comparing = !!selectedCompareDay;

  return (
    <Map id='exploration' projection={projection} onStyleUpdate={onStyleUpdate}>
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
      <MapControls>
        <DrawControl />
        <CustomAoIControl
          disableReason={
            comparing && 'Analysis is not possible when comparing dates'
          }
        />
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
        <ShowTourControl />
        <MapCoordsControl />
        <NavigationControl />
      </MapControls>
      {comparing && (
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
