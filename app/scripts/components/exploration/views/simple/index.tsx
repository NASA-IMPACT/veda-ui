import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import {
  selectedCompareDateAtom,
  selectedDateAtom
} from '$components/exploration/atoms/dates';
import { zoomAtom } from '$components/exploration/atoms/zoom';
import { centerAtom } from '$components/exploration/atoms/center';
import TimelineSimpleView from '$components/exploration/views/simple/timeline-simple-view';
import { BasemapId } from '$components/common/map/controls/map-options/basemap';
import {
  convertProjectionToMapbox,
  projectionDefault
} from '$components/common/map/controls/map-options/projections';
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

interface ExplorationAndAnalysisSimpleViewProps {
  datasets: TimelineDataset[];
}
export default function ExplorationAndAnalysisSimpleView(
  props: ExplorationAndAnalysisSimpleViewProps
) {
  const { datasets } = props;
  const [selectedDay, setSelectedDay] = useAtom(selectedDateAtom);
  const [selectedCompareDay, setSelectedComparedDay] = useAtom(
    selectedCompareDateAtom
  );
  const [zoom] = useAtom(zoomAtom);
  const [center] = useAtom(centerAtom);
  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <ExplorationAndAnalysisSimpleViewContent
      datasets={datasets}
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
      setSelectedComparedDay={setSelectedComparedDay}
      selectedCompareDay={selectedCompareDay}
      center={center}
      zoom={zoom}
    />
  );
}

interface ExplorationAndAnalysisSimpleViewContentProps {
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

function ExplorationAndAnalysisSimpleViewContent(
  props: ExplorationAndAnalysisSimpleViewContentProps
) {
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
    <StyledContainer>
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
      <StyledTimelineContainer isCompareMode={!!selectedCompareDay}>
        {selectedDay && (
          <TimelineSimpleView
            label=''
            date={selectedDay}
            setDate={setSelectedDay}
            datasets={layers as TimelineDataset[]}
            timeDensity={baseTimeDensity}
            tipContent={
              selectedCompareDay
                ? 'Date shown on left map'
                : 'Date shown on map'
            }
          />
        )}
      </StyledTimelineContainer>
      <StyledCompareTimelineContainer>
        {selectedCompareDay && (
          <TimelineSimpleView
            label=''
            date={selectedCompareDay}
            setDate={setSelectedComparedDay}
            datasets={layers as TimelineDataset[]}
            timeDensity={compareTimeDensity}
            tipContent='Date shown on right map'
          />
        )}
      </StyledCompareTimelineContainer>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  flex-grow: 1;
  height: 100vh;
  display: flex;
`;
const StyledTimelineContainer = styled.div<{ isCompareMode?: boolean }>`
  position: absolute;
  bottom: 2rem;
  left: ${({ isCompareMode }) => (isCompareMode ? '25%' : '50%')};
  transform: translateX(-50%);
  z-index: 10;
`;
const StyledCompareTimelineContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 75%;
  transform: translateX(-50%);
  z-index: 10;
`;
