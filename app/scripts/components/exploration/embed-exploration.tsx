import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import {
  convertProjectionToMapbox,
  projectionDefault
} from '../common/map/controls/map-options/projections';
import { BasemapId } from '../common/map/controls/map-options/basemap';
import { selectedCompareDateAtom, selectedDateAtom } from './atoms/dates';
import { zoomAtom } from './atoms/zoom';
import { centerAtom } from './atoms/center';
import EmbedTimeline from './components/embed-exploration/embed-timeline';
import MapBlock from '$components/common/blocks/block-map';
import {
  VizDataset,
  VizDatasetSuccess,
  DatasetStatus,
  TimelineDataset
} from '$components/exploration/types.d.ts';
import { useReconcileWithStacMetadata } from '$components/exploration/hooks/use-stac-metadata-datasets';
import { ProjectionOptions, TimeDensity } from '$types/veda';
import { useVedaUI } from '$context/veda-ui-provider';

const Carto = styled.div`
  position: relative;
  flex-grow: 1;
  height: 100vh;
  display: flex;
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

interface EmbeddedExplorationProps {
  datasets: TimelineDataset[];
}
export default function EmbeddedExploration(props: EmbeddedExplorationProps) {
  const { datasets } = props;
  const [selectedDay, setSelectedDay] = useAtom(selectedDateAtom);
  const [selectedCompareDay, setSelectedComparedDay] = useAtom(
    selectedCompareDateAtom
  );
  const [zoom] = useAtom(zoomAtom);
  const [center] = useAtom(centerAtom);
  return (
    <>
      <EmbeddedLayersExploration
        datasets={datasets}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        setSelectedComparedDay={setSelectedComparedDay}
        selectedCompareDay={selectedCompareDay}
        center={center}
        zoom={zoom}
      />
    </>
  );
}

interface EmbeddedLayersExplorationProps {
  datasets: TimelineDataset[];
  setSelectedDay: (x: Date) => void;
  setSelectedComparedDay: (x: Date) => void;
  selectedDay?: Date | null;
  selectedCompareDay?: Date | null;
  center?: [number, number];
  zoom?: number;
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
    selectedDay,
    setSelectedDay,
    selectedCompareDay,
    setSelectedComparedDay,
    center,
    zoom,
    projectionId,
    projectionCenter,
    projectionParallels,
    basemapId
  } = props;
  const [layers, setLayers] = useState<VizDataset[]>(datasets);

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
  const baseTimeDensity: TimeDensity = baseDataLayer?.data
    .timeDensity as TimeDensity;
  const compareTimeDensity: TimeDensity = compareDataLayer?.data
    .timeDensity as TimeDensity;
  const compareLabel = `${baseDataLayer?.data?.name} vs ${compareDataLayer?.data?.name}`;

  useEffect(() => {
    setProjection(projectionStart);
  }, [projectionStart]);

  const [mapBasemapId, setMapBasemapId] = useState(basemapId);

  useEffect(() => {
    if (!basemapId) return;
    setMapBasemapId(basemapId);
  }, [basemapId]);

  return (
    <Carto>
      <MapBlock
        baseDataLayer={baseDataLayer}
        compareDataLayer={compareDataLayer}
        dateTime={selectedDay?.toDateString()}
        compareDateTime={selectedCompareDay?.toDateString()}
        center={center}
        zoom={zoom}
        compareLabel={compareLabel}
        projectionId={projectionId}
        projectionCenter={projectionCenter}
        projectionParallels={projectionParallels}
        basemapId={mapBasemapId}
        isMapMessageEnabled={true}
        navigationControlPosition='top-right'
        height='100%'
      />
      <BaseTimelineContainer isCompareMode={!!selectedCompareDay}>
        {selectedDay && (
          <EmbedTimeline
            label=''
            date={selectedDay}
            setDate={setSelectedDay}
            datasets={layers as TimelineDataset[]}
            timeDensity={baseTimeDensity}
          />
        )}
      </BaseTimelineContainer>
      <CompareTimelineContainer>
        {selectedCompareDay && (
          <EmbedTimeline
            label=''
            date={selectedCompareDay}
            setDate={setSelectedComparedDay}
            datasets={layers as TimelineDataset[]}
            timeDensity={compareTimeDensity}
          />
        )}
      </CompareTimelineContainer>
    </Carto>
  );
}
