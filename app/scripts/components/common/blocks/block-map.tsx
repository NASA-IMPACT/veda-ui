import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { DatasetDatumFnResolverBag, ProjectionOptions, datasets } from 'veda';
import { MapboxOptions } from 'mapbox-gl';
import * as dateFns from 'date-fns';
import {
  convertProjectionToMapbox,
  projectionDefault,
  validateProjectionBlockProps
} from '../map/controls/map-options/projections';
import { Basemap } from '../map/style-generators/basemap';
import { LayerLegend, LayerLegendContainer } from '../map/layer-legend';
import MapCoordsControl from '../map/controls/coords';
import MapMessage from '../map/map-message';
import {
  formatCompareDate,
  formatSingleDate,
  resolveConfigFunctions
} from '../map/utils';
import {
  BasemapId,
  DEFAULT_MAP_STYLE_URL
} from '../map/controls/map-options/basemap';
import { utcString2userTzDate } from '$utils/date';
import Map, { Compare, MapControls } from '$components/common/map';
import { validateRangeNum } from '$utils/utils';
import { HintedError } from '$utils/hinted-error';
import {
  NavigationControl,
  ScaleControl
} from '$components/common/map/controls';
import { Layer } from '$components/exploration/components/map/layer';
import { S_SUCCEEDED } from '$utils/status';
import {
  TimelineDataset,
  TimelineDatasetSuccess
} from '$components/exploration/types.d.ts';

import { reconcileDatasets } from '$components/exploration/data-utils';
import { datasetLayers } from '$components/exploration/data-utils';
import { useReconcileWithStacMetadata } from '$components/exploration/hooks/use-stac-metadata-datasets';

export const mapHeight = '32rem';
const Carto = styled.div`
  position: relative;
  flex-grow: 1;
  height: ${mapHeight};
`;

// This global variable is used to give unique ID to mapbox container
let mapInstanceId = 0;

const lngValidator = validateRangeNum(-180, 180);
const latValidator = validateRangeNum(-90, 90);

function validateBlockProps(props: MapBlockProps) {
  const {
    dateTime,
    compareDateTime,
    center,
    zoom,
    projectionId,
    projectionCenter,
    projectionParallels
  } = props;

  const requiredProperties = ['datasetId', 'layerId', 'dateTime'];
  const missingMapProps = requiredProperties.filter(
    (p) => props[p] === undefined
  );

  const missingError =
    !!missingMapProps.length &&
    `- Missing some properties: ${missingMapProps
      .map((p) => `[${p}]`)
      .join(', ')}`;

  const dateError =
    dateTime &&
    isNaN(utcString2userTzDate(dateTime).getTime()) &&
    '- Invalid dateTime. Use YYYY-MM-DD format';

  // center is not required, but if provided must be in the correct range.
  const centerError =
    center &&
    (!lngValidator(center[0]) || !latValidator(center[1])) &&
    '- Invalid center. Use [longitude, latitude].';

  // zoom is not required, but if provided must be in the correct range.
  const zoomError = zoom && (isNaN(zoom) || zoom < 0);
  ('- Invalid zoom. Use number greater than 0');

  const compareDateError =
    compareDateTime &&
    isNaN(utcString2userTzDate(compareDateTime).getTime()) &&
    '- Invalid compareDateTime. Use YYYY-MM-DD format';

  const projectionErrors = validateProjectionBlockProps({
    id: projectionId,
    center: projectionCenter,
    parallels: projectionParallels
  });

  return [
    missingError,
    dateError,
    zoomError,
    centerError,
    compareDateError,
    ...projectionErrors
  ].filter(Boolean) as string[];
}

interface MapBlockProps {
  dateTime?: string;
  compareDateTime?: string;
  center?: [number, number];
  zoom?: number;
  compareLabel?: string;
  projectionId?: ProjectionOptions['id'];
  projectionCenter?: ProjectionOptions['center'];
  projectionParallels?: ProjectionOptions['parallels'];
  allowProjectionChange?: boolean;
  basemapId?: BasemapId;
  datasetId?: string;
  layerId: string;
}

function MapBlock(props: MapBlockProps) {
  const generatedId = useMemo(() => `map-${++mapInstanceId}`, []);

  const {
    datasetId,
    layerId,
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

  const errors = validateBlockProps(props);
  if (errors.length) {
    throw new HintedError('Malformed Map Block', errors);
  }

  const [baseLayers, setBaseLayers] = useState<TimelineDataset[] | undefined>();
  const [compareLayers, setCompareLayers] = useState<
    TimelineDataset[] | undefined
  >();

  const [baseMapStaticData] = reconcileDatasets([layerId], datasetLayers, []);
  const baseMapStaticCompareData = baseMapStaticData.data.compare;

  let compareLayerId: undefined | string;
  if (baseMapStaticCompareData && 'layerId' in baseMapStaticCompareData) {
    compareLayerId = baseMapStaticCompareData.layerId;
  }

  const [compareMapStaticData] = reconcileDatasets(
    compareLayerId ? [compareLayerId] : [],
    datasetLayers,
    []
  );

  useReconcileWithStacMetadata([baseMapStaticData], setBaseLayers);
  useReconcileWithStacMetadata([compareMapStaticData], setCompareLayers);

  const selectedDatetime = dateTime
    ? utcString2userTzDate(dateTime)
    : undefined;
  const selectedCompareDatetime = compareDateTime
    ? utcString2userTzDate(compareDateTime)
    : undefined;

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
        ...projection,
        id: projectionId
      };
    } else {
      return projectionDefault;
    }
  }, [projectionId, projectionCenter, projectionParallels]);

  const [, setProjection] = useState(projectionStart);

  const dataset = datasetId ? datasets[datasetId] : null;

  const resolverBag = useMemo<DatasetDatumFnResolverBag>(
    () => ({
      datetime: selectedDatetime,
      compareDatetime: selectedCompareDatetime,
      dateFns
    }),
    [selectedDatetime, selectedCompareDatetime]
  );

  const [baseLayerResolvedData] = useMemo(() => {
    if (!baseLayers || baseLayers.length !== 1) return [null, null];
    const baseLayer = baseLayers[0];

    if (baseLayer.status !== S_SUCCEEDED) return [null, null];

    const bag = { ...resolverBag, raw: baseLayer.data };
    const data = resolveConfigFunctions(baseLayer.data, bag);
    return [data];
  }, [baseLayers, resolverBag]);

  const baseDataLayer: TimelineDataset | null = {
    data: baseLayerResolvedData
  } as unknown as TimelineDataset;
  const baseTimeDensity = baseLayerResolvedData?.timeDensity;

  // Resolve data needed for the compare layer once it is loaded.
  const [compareLayerResolvedData] = useMemo(() => {
    if (!compareLayers || compareLayers.length !== 1) return [null, null];
    const compareLayer = compareLayers[0];

    if (compareLayer.status !== S_SUCCEEDED) return [null, null];
    // Include access to raw data.
    const bag = { ...resolverBag, raw: compareLayer.data };
    const data = resolveConfigFunctions(compareLayer.data, bag);
    return [data];
  }, [compareLayers, resolverBag]);

  const compareDataLayer: TimelineDataset | null = {
    data: compareLayerResolvedData
  } as unknown as TimelineDataset;
  const compareTimeDensity = compareLayerResolvedData?.timeDensity;

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

  const compareToDate = useMemo(() => {
    const theDate = selectedCompareDatetime ?? selectedDatetime;
    return theDate instanceof Date && !isNaN(theDate.getTime())
      ? theDate
      : null;
  }, [selectedCompareDatetime, selectedDatetime]);

  const computedCompareLabel = useMemo(() => {
    // Use a provided label if it exist.
    if (compareLabel && compareLayerResolvedData) {
      const providedLabel = compareLayerResolvedData?.mapLabel as string;
      return providedLabel;
    }

    // Default to date comparison.
    return selectedDatetime && compareToDate
      ? formatCompareDate(
          selectedDatetime,
          compareToDate,
          baseTimeDensity,
          compareTimeDensity
        )
      : null;
  }, [
    compareLabel,
    compareLayerResolvedData,
    selectedDatetime,
    compareToDate,
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
        {dataset && selectedDatetime && layerId && baseLayerResolvedData && (
          <Layer
            key={baseLayerResolvedData?.id}
            id={`base-${baseLayerResolvedData?.id}`}
            dataset={baseDataLayer as unknown as TimelineDatasetSuccess}
            selectedDay={selectedDatetime}
          />
        )}
        {baseLayerResolvedData?.legend && (
          // Map overlay element
          // Layer legend for the active layer.
          // @NOTE: LayerLegendContainer is in old mapbox directory, may want to move this over to /map directory once old directory is deprecated
          <LayerLegendContainer>
            <LayerLegend
              id={`base-${baseLayerResolvedData.id}`}
              title={baseLayerResolvedData.name}
              description={baseLayerResolvedData.description}
              {...baseLayerResolvedData.legend}
            />
            {compareLayerResolvedData?.legend &&
              !!selectedCompareDatetime &&
              baseLayerResolvedData.id !== compareLayerResolvedData.id && (
                <LayerLegend
                  id={`compare-${compareLayerResolvedData.id}`}
                  title={compareLayerResolvedData.name}
                  description={compareLayerResolvedData.description}
                  {...compareLayerResolvedData.legend}
                />
              )}
          </LayerLegendContainer>
        )}
        <MapControls>
          {selectedDatetime && selectedCompareDatetime ? (
            <MapMessage
              id='compare-message'
              active={!!(selectedCompareDatetime && compareLayerResolvedData)}
            >
              {computedCompareLabel}
            </MapMessage>
          ) : (
            <MapMessage
              id='single-map-message'
              active={!!(selectedDatetime && baseLayerResolvedData)}
            >
              {selectedDatetime &&
                formatSingleDate(
                  selectedDatetime,
                  baseLayerResolvedData?.timeDensity
                )}
            </MapMessage>
          )}
          <ScaleControl />
          <NavigationControl position='top-left' />
          <MapCoordsControl />
        </MapControls>
        {selectedCompareDatetime && (
          <Compare>
            <Basemap basemapStyleId={mapBasemapId} />
            {dataset &&
              selectedCompareDatetime &&
              layerId &&
              compareLayerResolvedData && (
                <Layer
                  key={compareLayerResolvedData.id}
                  id={`compare-${compareLayerResolvedData.id}`}
                  dataset={
                    compareDataLayer as unknown as TimelineDatasetSuccess
                  }
                  selectedDay={selectedCompareDatetime}
                />
              )}
          </Compare>
        )}
      </Map>
    </Carto>
  );
}

export default MapBlock;
