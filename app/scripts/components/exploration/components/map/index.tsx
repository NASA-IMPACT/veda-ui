import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { addMonths } from 'date-fns';

import { useStacMetadataOnDatasets } from '../../hooks/use-stac-metadata-datasets';
import { selectedDateAtom, timelineDatasetsAtom } from '../../atoms/atoms';
import {
  TimelineDatasetStatus,
  TimelineDatasetSuccess
} from '../../types.d.ts';
import { Layer } from './layer';

import Map, { Compare } from '$components/common/map';
import { Basemap } from '$components/common/map/style-generators/basemap';
import GeocoderControl from '$components/common/map/controls/geocoder';
import {
  NavigationControl,
  ScaleControl
} from '$components/common/map/controls';
import MapCoordsControl from '$components/common/map/controls/coords';
import MapOptionsControl from '$components/common/map/controls/options';
import { projectionDefault } from '$components/common/map/controls/map-options/projections';
import { useBasemap } from '$components/common/map/controls/hooks/use-basemap';
import DrawControl from '$components/common/map/controls/aoi';
import useAois from '$components/common/map/controls/hooks/use-aois';

export function ExplorationMap(props: { comparing: boolean }) {
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

  const { onUpdate, onDelete, onSelectionChange } = useAois();
  // console.log(features);

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
      <GeocoderControl />
      <NavigationControl />
      <ScaleControl />
      <MapCoordsControl />
      <MapOptionsControl
        projection={projection}
        onProjectionChange={setProjection}
        basemapStyleId={mapBasemapId}
        onBasemapStyleIdChange={setBasemapId}
        labelsOption={labelsOption}
        boundariesOption={boundariesOption}
        onOptionChange={onOptionChange}
      />
      <DrawControl
        displayControlsDefault={false}
        controls={{
          polygon: true,
          trash: true
        } as any}
        defaultMode='draw_polygon'
        onCreate={onUpdate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onSelectionChange={onSelectionChange}
      />
      {props.comparing && (
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
                selectedDay={addMonths(selectedDay, 1)}
                order={idx}
              />
            ))}
        </Compare>
      )}
    </Map>
  );
}
