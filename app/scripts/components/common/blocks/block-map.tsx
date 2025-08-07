import React, { useMemo, useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import styled from 'styled-components';
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
import { formatCompareDate, formatSingleDate } from '../map/utils';
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
import { VizDatasetSuccess } from '$components/exploration/types.d.ts';
import { ProjectionOptions } from '$types/veda';

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

  const requiredProperties = ['dateTime'];
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
  const zoomError =
    zoom &&
    (isNaN(zoom) || zoom < 0) &&
    '- Invalid zoom. Use number greater than 0';

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
  baseDataLayer?: VizDatasetSuccess | null;
  compareDataLayer?: VizDatasetSuccess | null;
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
  layerId?: string;
  onLayerDataUpdate?: (layerData: VizDatasetSuccess | null) => void;
  isMapMessageEnabled?: boolean;
  navigationControlPosition?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
}

export default function MapBlock(props: PropsWithChildren<MapBlockProps>) {
  const generatedId = useMemo(() => `map-${++mapInstanceId}`, []);

  const {
    baseDataLayer,
    compareDataLayer,
    dateTime,
    compareDateTime,
    compareLabel,
    center,
    zoom,
    projectionId,
    projectionCenter,
    projectionParallels,
    basemapId,
    isMapMessageEnabled = true,
    navigationControlPosition = 'top-left'
  } = props;

  const errors = validateBlockProps(props);

  if (errors.length) {
    throw new HintedError('Malformed Map Block', errors);
  }

  const selectedDatetime: Date | undefined = dateTime
    ? utcString2userTzDate(dateTime)
    : undefined;
  const selectedCompareDatetime: Date | undefined = compareDateTime
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
        ...(projection as object),
        id: projectionId
      };
    } else {
      return projectionDefault;
    }
  }, [projectionId, projectionCenter, projectionParallels]);

  const [, setProjection] = useState(projectionStart);

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

  const compareToDate = useMemo(() => {
    const theDate = selectedCompareDatetime ?? selectedDatetime;
    return theDate instanceof Date && !isNaN(theDate.getTime())
      ? theDate
      : null;
  }, [selectedCompareDatetime, selectedDatetime]);

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
        datetime: selectedDatetime,
        compareDatetime: compareToDate
      });
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
    baseDataLayer,
    selectedDatetime,
    compareToDate,
    baseTimeDensity,
    compareTimeDensity
  ]);

  const initialPosition = useMemo(
    () => (center ? { lng: center[0], lat: center[1], zoom } : undefined),
    [center, zoom]
  );

  useEffect(() => {
    if (props.onLayerDataUpdate && baseDataLayer) {
      props.onLayerDataUpdate(baseDataLayer);
    }
  }, [baseDataLayer, props, props.onLayerDataUpdate]);

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
        {selectedDatetime && baseDataLayer && (
          <Layer
            key={baseDataLayer.data.id}
            id={`base-${baseDataLayer.data.id}`}
            dataset={baseDataLayer}
            selectedDay={selectedDatetime}
          />
        )}

        {/* Allow custom layers from users */}
        {props.children}

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
              !!selectedCompareDatetime &&
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
          {isMapMessageEnabled && (
            <>
              {selectedDatetime && selectedCompareDatetime ? (
                <MapMessage
                  id='compare-message'
                  active={!!(compareDataLayer && selectedCompareDatetime)}
                >
                  {computedCompareLabel}
                </MapMessage>
              ) : (
                <MapMessage
                  id='single-map-message'
                  active={!!(selectedDatetime && baseDataLayer)}
                >
                  {selectedDatetime &&
                    formatSingleDate(
                      selectedDatetime,
                      baseDataLayer?.data.timeDensity
                    )}
                </MapMessage>
              )}
            </>
          )}
          <ScaleControl />
          <NavigationControl position={navigationControlPosition} />
          <MapCoordsControl />
        </MapControls>
        {selectedCompareDatetime && (
          <Compare>
            <Basemap basemapStyleId={mapBasemapId} />
            {compareDataLayer && (
              <Layer
                key={compareDataLayer.data.id}
                id={`compare-${compareDataLayer.data.id}`}
                dataset={compareDataLayer}
                selectedDay={selectedCompareDatetime}
              />
            )}
          </Compare>
        )}
      </Map>
    </Carto>
  );
}
