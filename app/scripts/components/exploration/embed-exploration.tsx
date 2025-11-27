/**
 * @fileoverview Embedded Exploration Component for E&A embed mode.
 * This module provides the main component for rendering the exploration view
 * in embed mode. It displays a minimal, iframe-friendly interface with:
 * - An interactive map with dataset visualization
 * - Timeline controls for date selection
 * - Support for comparing two datasets side by side
 * 
 * The component is designed to be embedded in external websites via iframe,
 * with URL parameters controlling zoom, center, and other view settings.
 * 
 * @module exploration/embed-exploration
 */

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
import { LayoutProps } from '$components/common/layout-root';

/**
 * Styled container for the map and visualization area.
 * Takes up full viewport height with relative positioning for overlays.
 */
const Carto = styled.div`
  position: relative;
  flex-grow: 1;
  height: 100vh;
  display: flex;
`;

/**
 * Styled container for the base (primary) timeline picker.
 * Positioned at bottom of screen, centered or offset based on compare mode.
 */
const BaseTimelineContainer = styled.div<{ isCompareMode?: boolean }>`
  position: absolute;
  bottom: 2rem;
  left: ${({ isCompareMode }) => (isCompareMode ? '25%' : '50%')};
  transform: translateX(-50%);
  z-index: 10;
`;

/**
 * Styled container for the compare (secondary) timeline picker.
 * Positioned at bottom-right when comparing two datasets.
 */
const CompareTimelineContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 75%;
  transform: translateX(-50%);
  z-index: 10;
`;

/**
 * Props interface for the EmbeddedExploration component.
 * @interface EmbeddedExplorationProps
 */
interface EmbeddedExplorationProps {
  /** Array of timeline datasets to display and visualize */
  datasets: TimelineDataset[];
}

/**
 * Main embedded exploration component for E&A embed mode.
 * Renders a minimal exploration interface suitable for iframe embedding.
 * Manages date selection state and renders the layers exploration with map.
 * 
 * @component
 * @param {EmbeddedExplorationProps} props - Component props
 * @returns {JSX.Element} The embedded exploration view
 * 
 * @example
 * <EmbeddedExploration datasets={timelineDatasets} />
 */
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
      <LayoutProps
        title='Exploration'
        description='Explore and analyze datasets'
        hideFooter
        hideNav
        hideHeader
      />
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

/**
 * Props interface for the EmbeddedLayersExploration component.
 * Supports extensive map configuration options.
 * @interface EmbeddedLayersExplorationProps
 */
interface EmbeddedLayersExplorationProps {
  /** Array of timeline datasets to visualize */
  datasets: TimelineDataset[];
  /** Callback to update the selected date */
  setSelectedDay: (x: Date) => void;
  /** Callback to update the compared date */
  setSelectedComparedDay: (x: Date) => void;
  /** Currently selected date for primary dataset */
  selectedDay?: Date | null;
  /** Currently selected date for comparison dataset */
  selectedCompareDay?: Date | null;
  /** Map center coordinates [lng, lat] */
  center?: [number, number];
  /** Map zoom level */
  zoom?: number;
  /** Map projection identifier */
  projectionId?: ProjectionOptions['id'];
  /** Center point for map projection */
  projectionCenter?: ProjectionOptions['center'];
  /** Parallels for conic map projections */
  projectionParallels?: ProjectionOptions['parallels'];
  /** Basemap style identifier */
  basemapId?: BasemapId;
}

/**
 * Extracts and validates a dataset layer at a given index.
 * Returns null if the layer doesn't exist or hasn't loaded successfully.
 * 
 * @param {number} layerIndex - Index of the layer to extract
 * @param {VizDataset[] | undefined} layers - Array of visualization datasets
 * @returns {VizDatasetSuccess | null} The extracted layer with default settings, or null
 */
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

/**
 * Inner component that handles layer visualization and map rendering.
 * Manages map projection, basemap, and layer data state.
 * Renders the MapBlock with timeline controls for date selection.
 * 
 * @component
 * @param {EmbeddedLayersExplorationProps} props - Component props
 * @returns {JSX.Element} The map and timeline interface
 */
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
