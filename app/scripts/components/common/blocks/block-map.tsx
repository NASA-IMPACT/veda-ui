/* eslint-disable */
// @ts-nocheck
import React, { useMemo, useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { MapboxOptions } from 'mapbox-gl';
import * as dateFns from 'date-fns';
import { DateInput, Icon } from '@trussworks/react-uswds';
import Calendar from 'react-calendar';
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
import {
  VizDataset,
  VizDatasetSuccess,
  DatasetStatus
} from '$components/exploration/types.d.ts';
import { reconcileDatasets } from '$components/exploration/data-utils';
import { getDatasetLayers } from '$utils/data-utils';
import { useReconcileWithStacMetadata } from '$components/exploration/hooks/use-stac-metadata-datasets';
import { ProjectionOptions, VedaData, DatasetData } from '$types/veda';
import { useVedaUI } from '$context/veda-ui-provider';

import 'react-calendar/dist/Calendar.css';

export const mapHeight = '32rem';
const Carto = styled.div`
  position: relative;
  flex-grow: 1;
  height: ${mapHeight};
`;

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

  const centerError =
    center &&
    (!lngValidator(center[0]) || !latValidator(center[1])) &&
    '- Invalid center. Use [longitude, latitude].';

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
  datasets: VedaData<DatasetData>;
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
  enableLayerSelector?: boolean;
  enableDateSelector?: boolean;
}

const getDataLayer = (
  layerIndex: number,
  layers: VizDataset[] | undefined
): VizDatasetSuccess | null => {
  if (!layers || layers.length <= layerIndex) return null;
  const layer = layers[layerIndex];
  if (layer.status !== DatasetStatus.SUCCESS) return null;
  return {
    ...layer,
    settings: {
      isVisible: true,
      opacity: 100
    }
  };
};

export default function MapBlock(props: PropsWithChildren<MapBlockProps>) {
  const generatedId = useMemo(() => `map-${++mapInstanceId}`, []);

  const {
    datasets,
    layerId,
    dateTime,
    compareDateTime,
    compareLabel,
    center,
    zoom,
    projectionId,
    projectionCenter,
    projectionParallels,
    basemapId,
    datasetId,
    enableLayerSelector,
    enableDateSelector
  } = props;

  console.log('datasets ', datasets);
  const [selectedLayerId, setSelectedLayerId] = useState(layerId);
  const [selectedDate, setSelectedDate] = useState(dateTime);

  const [calendarDate, setCalendarDate] = useState<Date | null>(
    selectedDate ? new Date(selectedDate) : null
  );
  useEffect(() => {
    setSelectedLayerId(layerId);
  }, [layerId]);

  useEffect(() => {
    setSelectedDate(dateTime);
  }, [dateTime]);

  const errors = validateBlockProps(props);
  if (errors.length) throw new HintedError('Malformed Map Block', errors);

  const datasetLayers = getDatasetLayers(datasets);
  const [showCalendar, setShowCalendar] = useState(false);

  const layerIds = useMemo(() => {
    if (compareDateTime) return [layerId];
    return [selectedLayerId];
  }, [compareDateTime, layerId, selectedLayerId]);

  const layersToFetch = useMemo(() => {
    return reconcileDatasets(layerIds, datasetLayers, []);
  }, [layerIds, datasetLayers]);

  const [layers, setLayers] = useState<VizDataset[]>(layersToFetch);

  const { envApiStacEndpoint } = useVedaUI();
  useReconcileWithStacMetadata(layersToFetch, setLayers, envApiStacEndpoint);

  console.log('layers', layers);
  const selectedDatetime = selectedDate
    ? utcString2userTzDate(selectedDate)
    : undefined;
  const selectedCompareDatetime = compareDateTime
    ? utcString2userTzDate(compareDateTime)
    : undefined;

  const projectionStart = useMemo(() => {
    if (projectionId) {
      const projection = convertProjectionToMapbox({
        id: projectionId,
        center: projectionCenter,
        parallels: projectionParallels
      });
      return { ...(projection as object), id: projectionId };
    } else return projectionDefault;
  }, [projectionId, projectionCenter, projectionParallels]);

  const [, setProjection] = useState(projectionStart);

  const baseDataLayer = useMemo(() => getDataLayer(0, layers), [layers]);
  const compareDataLayer = useMemo(() => getDataLayer(1, layers), [layers]);

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
    if (position?.lng !== undefined && position?.lat !== undefined)
      opts.center = [position.lng, position.lat];
    if (position?.zoom) opts.zoom = position.zoom;
    return opts;
  };

  useEffect(() => {
    setProjection(projectionStart);
  }, [projectionStart]);

  const [mapBasemapId, setMapBasemapId] = useState(basemapId);
  useEffect(() => {
    if (basemapId) setMapBasemapId(basemapId);
  }, [basemapId]);

  const compareToDate = useMemo(() => {
    const theDate = selectedCompareDatetime ?? selectedDatetime;
    return theDate instanceof Date && !isNaN(theDate.getTime())
      ? theDate
      : null;
  }, [selectedCompareDatetime, selectedDatetime]);

  const computedCompareLabel = useMemo(() => {
    if (compareLabel) return compareLabel;
    else if (baseDataLayer?.data.compare?.mapLabel) {
      if (typeof baseDataLayer.data.compare.mapLabel === 'string')
        return baseDataLayer.data.compare.mapLabel;
      return baseDataLayer.data.compare.mapLabel({
        dateFns,
        datetime: selectedDatetime,
        compareDatetime: compareToDate
      });
    }
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

  const maxDetail = useMemo(() => {
    const td = baseDataLayer?.data.timeDensity;
    switch (td) {
      case 'year':
        return 'year';
      case 'month':
        return 'year';
      case 'day':
      default:
        return 'month';
    }
  }, [baseDataLayer]);

  console.log('baseDataLayer', baseDataLayer);
  return (
    <Carto>
      {(enableLayerSelector || enableDateSelector) && !compareDateTime && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 10
          }}
        >
          {enableLayerSelector && datasetId && (
            <select
              value={selectedLayerId}
              onChange={(e) => setSelectedLayerId(e.target.value)}
              style={{ marginBottom: '0.5rem', display: 'block' }}
            >
              {datasets[datasetId]?.data.layers?.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name ?? l.id}
                </option>
              ))}
            </select>
          )}
          {enableDateSelector && baseDataLayer?.data.domain?.length > 0 && (
            <div style={{ display: 'block' }}>
              <input
                type='text'
                readOnly
                value={
                  calendarDate
                    ? dateFns.format(calendarDate, 'yyyy-MM-dd')
                    : 'Select date...'
                }
                onClick={() => setShowCalendar(!showCalendar)}
                style={{
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  width: '140px'
                }}
              />

              {showCalendar && (
                <Calendar
                  onChange={(value) => {
                    const date = Array.isArray(value) ? value[0] : value;
                    if (date instanceof Date && !isNaN(date.getTime())) {
                      setCalendarDate(date);
                      setSelectedDate(date.toISOString());
                    }
                  }}
                  value={calendarDate}
                  className='react-calendar'
                  nextLabel={<Icon.NavigateNext />}
                  prevLabel={<Icon.NavigateBefore />}
                  prev2Label={<Icon.NavigateFarBefore />}
                  next2Label={<Icon.NavigateFarNext />}
                  defaultView='decade'
                  maxDetail={maxDetail}
                  minDate={new Date(baseDataLayer.data.domain[0])}
                  maxDate={
                    new Date(
                      baseDataLayer.data.domain[
                        baseDataLayer.data.domain.length - 1
                      ]
                    )
                  }
                />
              )}
            </div>
          )}
        </div>
      )}

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

        {props.children}

        {baseDataLayer?.data.legend && (
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
          <ScaleControl />
          <NavigationControl position='top-left' />
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
