import React from 'react';
import Map, { Compare, MapControls } from '$components/common/map';
import { Basemap } from './style-generators/basemap';
import DrawControl from './controls/aoi';
import CustomAoIControl from './controls/aoi/custom-aoi-control';
import GeocoderControl from './controls/geocoder';
import { AnalysisMessageControl } from '$components/exploration/components/map/analysis-message-control';
import MapOptionsControl from './controls/map-options';
import { NavigationControl, ScaleControl } from './controls';
import { Layer } from '$components/common/map/layer';
import { LayerLegend, LayerLegendContainer } from './layer-legend';
import MapMessage from './map-message';
import { ShowTourControl } from '$components/exploration/components/map/tour-control';
import MapCoordsControl from './controls/coords';
import { ProjectionOptions } from 'veda';
import { BasemapId } from './controls/map-options/basemap';
import { MapboxOptions } from 'mapbox-gl';
import { TimelineDataset } from '$components/exploration/types.ts';

const MapContainer: React.FC<MapContainerProps> = ({
  id,
  mapOptions,
  basemapStyleId,
  labelsOption,
  boundariesOption,
  datasets,
  selectedDay,
  compareDatasets,
  selectedCompareDay,
  renderControls,
  onProjectionChange,
  onBasemapStyleIdChange,
  onOptionChange,
  projection,
  onStyleUpdate,
  disableCompareReason,
  mapMessage
}) => {
  return (
    <Map id={id} mapOptions={mapOptions} onStyleUpdate={onStyleUpdate}>
      <Basemap
        basemapStyleId={basemapStyleId}
        labelsOption={labelsOption}
        boundariesOption={boundariesOption}
      />
      {datasets &&
        datasets.map((dataset, idx) => (
          <Layer
            key={dataset.id}
            id={dataset.id}
            dataset={dataset.dataset}
            selectedDay={selectedDay || new Date()}
            order={idx}
          />
        ))}
      {compareDatasets && selectedCompareDay && (
        <Compare>
          <Basemap
            basemapStyleId={basemapStyleId}
            labelsOption={labelsOption}
            boundariesOption={boundariesOption}
          />
          {compareDatasets.map((dataset, idx) => (
            <Layer
              key={dataset.id}
              id={dataset.id}
              dataset={dataset.dataset}
              selectedDay={selectedCompareDay}
              order={idx}
            />
          ))}
        </Compare>
      )}
      {renderControls && (
        <MapControls>
          {renderControls.draw && <DrawControl />}
          {renderControls.customAoI && (
            <CustomAoIControl disableReason={disableCompareReason} />
          )}
          {renderControls.analysisMessage && <AnalysisMessageControl />}
          {renderControls.geocoder && <GeocoderControl />}
          {renderControls.mapOptions && (
            <MapOptionsControl
              projection={projection}
              onProjectionChange={onProjectionChange}
              basemapStyleId={basemapStyleId}
              onBasemapStyleIdChange={onBasemapStyleIdChange}
              labelsOption={labelsOption}
              boundariesOption={boundariesOption}
              onOptionChange={onOptionChange}
            />
          )}
          {renderControls.scale && <ScaleControl />}
          {renderControls.showTour && <ShowTourControl />}
          {renderControls.mapCoords && <MapCoordsControl />}
          {renderControls.navigation && (
            <NavigationControl
              position={renderControls.navigationPosition ?? 'top-left'}
            />
          )}
        </MapControls>
      )}
      {datasets.map(
        (dataset) =>
          dataset.legend && (
            <LayerLegendContainer key={dataset.id}>
              <LayerLegend
                id={dataset.id}
                title={dataset.name}
                description={dataset.description}
                {...dataset.legend}
              />
            </LayerLegendContainer>
          )
      )}
      {compareDatasets?.map(
        (dataset) =>
          dataset.legend && (
            <LayerLegendContainer key={dataset.id}>
              <LayerLegend
                id={dataset.id}
                title={dataset.name}
                description={dataset.description}
                {...dataset.legend}
              />
            </LayerLegendContainer>
          )
      )}
      {mapMessage && (
        <MapMessage
          id='map-message'
          active={!!(selectedDay || selectedCompareDay)}
        >
          {mapMessage}
        </MapMessage>
      )}
    </Map>
  );
};

export default MapContainer;

interface MapContainerProps {
  id: string;
  mapOptions: Partial<MapboxOptions>;
  basemapStyleId: BasemapId;
  labelsOption?: boolean;
  boundariesOption?: boolean;
  datasets: TimelineDataset[];
  selectedDay?: Date;
  compareDatasets?: TimelineDataset[];
  selectedCompareDay?: Date;
  renderControls: {
    draw?: boolean;
    customAoI?: boolean;
    analysisMessage?: boolean;
    geocoder?: boolean;
    mapOptions?: boolean;
    scale?: boolean;
    showTour?: boolean;
    mapCoords?: boolean;
    navigation?: boolean;
    navigationPosition?:
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right';
  };
  onProjectionChange?: (projection: ProjectionOptions) => void;
  onBasemapStyleIdChange?: (basemapId: BasemapId) => void;
  onOptionChange?: (option: string, value: any) => void;
  projection?: ProjectionOptions;
  onStyleUpdate?: (style: any) => void;
  disableCompareReason?: string;
  mapMessage?: string | null;
}
