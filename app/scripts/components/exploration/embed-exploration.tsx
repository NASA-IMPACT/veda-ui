import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { MapboxOptions } from 'mapbox-gl';
import * as dateFns from 'date-fns';
import { useAtom } from 'jotai';
import {
  convertProjectionToMapbox,
  projectionDefault
} from '../common/map/controls/map-options/projections';
import { Basemap } from '../common/map/style-generators/basemap';
import { LayerLegend, LayerLegendContainer } from '../common/map/layer-legend';
import MapCoordsControl from '../common/map/controls/coords';
import MapMessage from '../common/map/map-message';
import { formatCompareDate, formatSingleDate } from '../common/map/utils';
import {
  BasemapId,
  DEFAULT_MAP_STYLE_URL
} from '../common/map/controls/map-options/basemap';
import DateTimePicker from './components/embed-exploration/embed-timeline';
import { selectedCompareDateAtom, selectedDateAtom } from './atoms/dates';
import Map, { Compare, MapControls } from '$components/common/map';
import {
  NavigationControl,
  ScaleControl
} from '$components/common/map/controls';
import { Layer } from '$components/exploration/components/map/layer';
import {
  VizDataset,
  VizDatasetSuccess,
  DatasetStatus,
  TimelineDataset
} from '$components/exploration/types.d.ts';
import { useReconcileWithStacMetadata } from '$components/exploration/hooks/use-stac-metadata-datasets';
import { ProjectionOptions } from '$types/veda';
import { useVedaUI } from '$context/veda-ui-provider';
import { LayoutProps } from '$components/common/layout-root';

export const mapHeight = '32rem';
const Carto = styled.div`
  position: relative;
  flex-grow: 1;
  height: ${mapHeight};
`;
const BaseTimelineContainer = styled.div<{ isCompareMode?: boolean }>`
  position: absolute;
  bottom: 2rem;
  left: ${({ isCompareMode }) => (isCompareMode ? '25%' : '50%')};
  transform: translateX(-50%);
  z-index: 10;
`;
const CompareTimelineContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 75%;
  transform: translateX(-50%);
  z-index: 10;
`;

// This global variable is used to give unique ID to mapbox container
let mapInstanceId = 0;
interface EmbeddedExplorationProps {
  datasets: TimelineDataset[];
}
export default function EmbeddedExploration(props: EmbeddedExplorationProps) {
  const { datasets } = props;
  const [selectedDay] = useAtom(selectedDateAtom);
  const [selectedCompareDay] = useAtom(selectedCompareDateAtom);
  return (
    <>
      <LayoutProps
        title='Exploration'
        description='Explore and analyze datasets'
        hideFooter
        hideNav
        hideHeader
      />

      <EmbeddedLayersExploration
        datasets={datasets}
        dateTime={selectedDay}
        compareDateTime={selectedCompareDay}
        compareLabel='CO₂ Emissions (left) VS NOₓ Emissions (right) (Dec 2021)'
        center={[-74.144488, 40.6976312]}
        zoom={3}
      />
    </>
  );
}

interface EmbeddedLayersExplorationProps {
  datasets: TimelineDataset[];
  dateTime?: Date | null;
  compareDateTime?: Date | null;
  center?: [number, number];
  zoom?: number;
  compareLabel?: string;
  projectionId?: ProjectionOptions['id'];
  projectionCenter?: ProjectionOptions['center'];
  projectionParallels?: ProjectionOptions['parallels'];
  basemapId?: BasemapId;
}

const getDataLayer = (
  layerIndex: number,
  layers: VizDataset[] | undefined
): VizDatasetSuccess | null => {
  if (!layers || layers.length <= layerIndex) return null;
  const layer = layers[layerIndex];
  // @NOTE: What to do when data returns ERROR
  if (layer.status !== DatasetStatus.SUCCESS) return null;
  return {
    ...layer,
    settings: {
      isVisible: true,
      opacity: 100
    }
  };
};

function EmbeddedLayersExploration(props: EmbeddedLayersExplorationProps) {
  const {
    datasets,
    dateTime,
    compareDateTime,
    compareLabel,
    center,
    zoom,
    projectionId,
    projectionCenter,
    projectionParallels,
    basemapId
  } = props;
  const [selectedDay, setSelectedDay] = useState(dateTime);
  const [comparedDay, setComparedDay] = useState(compareDateTime);
  const [layers, setLayers] = useState<VizDataset[]>(datasets);

  const generatedId = useMemo(() => `map-${++mapInstanceId}`, []);
  const { envApiStacEndpoint } = useVedaUI();
  useReconcileWithStacMetadata(layers, setLayers, envApiStacEndpoint);

  const projectionStart = useMemo(() => {
    if (projectionId) {
      // Ensure that the default center and parallels are used if none are
      // provided.
      const projection = convertProjectionToMapbox({
        id: projectionId,
        center: projectionCenter,
        parallels: projectionParallels
      });
      return {
        ...(projection as object),
        id: projectionId
      };
    } else {
      return projectionDefault;
    }
  }, [projectionId, projectionCenter, projectionParallels]);

  const [, setProjection] = useState(projectionStart);

  const baseDataLayer: VizDatasetSuccess | null = useMemo(
    () => getDataLayer(0, layers),
    [layers]
  );
  const compareDataLayer: VizDatasetSuccess | null = useMemo(
    () => getDataLayer(1, layers),
    [layers]
  );
  const baseTimeDensity = baseDataLayer?.data.timeDensity;
  const compareTimeDensity = compareDataLayer?.data.timeDensity;

  const mapOptions: Partial<MapboxOptions> = {
    style: DEFAULT_MAP_STYLE_URL,
    logoPosition: 'bottom-left',
    trackResize: true,
    pitchWithRotate: false,
    dragRotate: false,
    zoom: 1
  };

  const getMapPositionOptions = (position) => {
    const opts = {} as Pick<typeof mapOptions, 'center' | 'zoom'>;
    if (position?.lng !== undefined && position?.lat !== undefined) {
      opts.center = [position.lng, position.lat];
    }

    if (position?.zoom) {
      opts.zoom = position.zoom;
    }

    return opts;
  };

  useEffect(() => {
    setProjection(projectionStart);
  }, [projectionStart]);

  const [mapBasemapId, setMapBasemapId] = useState(basemapId);

  useEffect(() => {
    if (!basemapId) return;

    setMapBasemapId(basemapId);
  }, [basemapId]);

  const computedCompareLabel = useMemo(() => {
    // Use a provided label if it exist.
    if (compareLabel) return compareLabel as string;
    // Use label function from originalData.Compare
    else if (baseDataLayer?.data.compare?.mapLabel) {
      if (typeof baseDataLayer.data.compare.mapLabel === 'string')
        return baseDataLayer.data.compare.mapLabel;
      const labelFn = baseDataLayer.data.compare.mapLabel as (
        unknown
      ) => string;
      return labelFn({
        dateFns,
        datetime: selectedDay,
        compareDatetime: comparedDay
      });
    }

    // Default to date comparison.
    return selectedDay && comparedDay
      ? formatCompareDate(
          selectedDay,
          comparedDay,
          baseTimeDensity,
          compareTimeDensity
        )
      : null;
  }, [
    compareLabel,
    baseDataLayer,
    selectedDay,
    comparedDay,
    baseTimeDensity,
    compareTimeDensity
  ]);
  const initialPosition = useMemo(
    () => (center ? { lng: center[0], lat: center[1], zoom } : undefined),
    [center, zoom]
  );
  return (
    <Carto>
      <Map
        id={generatedId}
        mapOptions={{
          ...mapOptions,
          ...getMapPositionOptions(initialPosition)
        }}
      >
        <Basemap basemapStyleId={mapBasemapId} />
        {selectedDay && baseDataLayer && (
          <Layer
            key={baseDataLayer.data.id}
            id={`base-${baseDataLayer.data.id}`}
            dataset={baseDataLayer}
            selectedDay={selectedDay}
          />
        )}
        {baseDataLayer?.data.legend && (
          // Map overlay element
          // Layer legend for the active layer.
          <LayerLegendContainer>
            <LayerLegend
              id={`base-${baseDataLayer.data.id}`}
              title={baseDataLayer.data.name}
              description={baseDataLayer.data.description}
              {...baseDataLayer.data.legend}
            />
            {compareDataLayer?.data.legend &&
              !!comparedDay &&
              baseDataLayer.data.id !== compareDataLayer.data.id && (
                <LayerLegend
                  id={`compare-${compareDataLayer.data.id}`}
                  title={compareDataLayer.data.name}
                  description={compareDataLayer.data.description}
                  {...compareDataLayer.data.legend}
                />
              )}
          </LayerLegendContainer>
        )}
        <MapControls>
          {selectedDay && comparedDay ? (
            <MapMessage
              id='compare-message'
              active={!!(compareDataLayer && comparedDay)}
            >
              {computedCompareLabel}
            </MapMessage>
          ) : (
            <MapMessage
              id='single-map-message'
              active={!!(selectedDay && baseDataLayer)}
            >
              {selectedDay &&
                formatSingleDate(selectedDay, baseDataLayer?.data.timeDensity)}
            </MapMessage>
          )}
          <ScaleControl />
          <NavigationControl position='top-left' />
          <MapCoordsControl />
        </MapControls>
        {comparedDay && (
          <Compare>
            <Basemap basemapStyleId={mapBasemapId} />
            {compareDataLayer && (
              <Layer
                key={compareDataLayer.data.id}
                id={`compare-${compareDataLayer.data.id}`}
                dataset={compareDataLayer}
                selectedDay={comparedDay}
              />
            )}
          </Compare>
        )}
      </Map>
      <BaseTimelineContainer isCompareMode={!!comparedDay}>
        {selectedDay && (
          <DateTimePicker date={selectedDay} setDate={setSelectedDay} />
        )}
      </BaseTimelineContainer>
      <CompareTimelineContainer>
        {comparedDay && (
          <DateTimePicker date={comparedDay} setDate={setComparedDay} />
        )}
      </CompareTimelineContainer>
    </Carto>
  );
}
