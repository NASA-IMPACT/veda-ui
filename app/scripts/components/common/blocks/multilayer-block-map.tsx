import React, { useMemo, useState, useEffect } from 'react';
import {
  Icon,
  Select,
  TextInput,
  InputSuffix,
  InputGroup
} from '@trussworks/react-uswds';
import Calendar from 'react-calendar';
import * as dateFns from 'date-fns';
import type { PropsWithChildren } from 'react';
import type { Value } from 'react-calendar/dist/cjs/shared/types';
import type { BasemapId } from '../map/controls/map-options/basemap';
import MapBlock from './block-map';
import type { VedaData, DatasetData, ProjectionOptions } from '$types/veda';
import type { VizDatasetSuccess } from '$components/exploration/types.d.ts';

import 'react-calendar/dist/Calendar.css';
import './multilayer-map.scss';

export default function MultiLayerMapBlock({
  datasets,
  datasetId,
  layerId,
  dateTime,
  center,
  zoom,
  projectionId,
  projectionCenter,
  projectionParallels,
  basemapId,
  excludeLayers = []
}: PropsWithChildren<{
  datasets: VedaData<DatasetData>;
  datasetId: string;
  layerId: string;
  dateTime?: string;
  center?: [number, number];
  zoom?: number;
  projectionId?: ProjectionOptions['id'];
  projectionCenter?: ProjectionOptions['center'];
  projectionParallels?: ProjectionOptions['parallels'];
  basemapId?: BasemapId;
  excludeLayers?: string[];
}>) {
  const [selectedLayerId, setSelectedLayerId] = useState(layerId);
  const [selectedDate, setSelectedDate] = useState(dateTime);
  const [calendarDate, setCalendarDate] = useState(
    dateTime ? new Date(dateTime) : null
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const [currentLayerData, setCurrentLayerData] =
    useState<VizDatasetSuccess | null>(null);

  useEffect(() => {
    setSelectedLayerId(layerId);
  }, [layerId]);

  useEffect(() => {
    setSelectedDate(dateTime);
    setCalendarDate(dateTime ? new Date(dateTime) : null);
  }, [dateTime]);

  const availableLayers = useMemo(() => {
    return (
      datasets[datasetId]?.data.layers?.filter(
        (layer) => !excludeLayers.includes(layer.id)
      ) ?? []
    );
  }, [datasets, datasetId, excludeLayers]);

  const dateDomain = useMemo(() => {
    return currentLayerData?.data.domain ?? [];
  }, [currentLayerData]);

  const maxDetail = useMemo(() => {
    const td = currentLayerData?.data.timeDensity;
    if (td === 'year') return 'year';
    if (td === 'month') return 'year';
    return 'month';
  }, [currentLayerData]);

  const handleDateChange = (value: Value) => {
    if (!value) return;

    let date: Date | null = null;

    if (value instanceof Date) {
      date = value;
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      date = value[0];
    }

    if (date && !isNaN(date.getTime())) {
      setCalendarDate(date);
      setSelectedDate(dateFns.format(date, 'yyyy-MM-01'));
      setShowCalendar(false);
    }
  };

  const handleLayerDataUpdate = (layerData: VizDatasetSuccess | null) => {
    setCurrentLayerData(layerData);
  };

  return (
    <div className='multilayer-map position-relative'>
      <MapBlock
        datasets={datasets}
        datasetId={datasetId}
        layerId={selectedLayerId}
        dateTime={selectedDate}
        center={center}
        zoom={zoom}
        projectionId={projectionId}
        projectionCenter={projectionCenter}
        projectionParallels={projectionParallels}
        basemapId={basemapId}
        onLayerDataUpdate={handleLayerDataUpdate}
        isMapMessageEnabled={false}
      />

      <div className='position-absolute top-3 left-3 z-200 radius-md shadow-lg'>
        <div className='grid-row grid-gap-1'>
          {availableLayers.length > 1 && (
            <div>
              <Select
                id='layer-select'
                name='layer-select'
                className='truncate-select padding-1 padding-right-3 margin-top-0'
                value={selectedLayerId}
                onChange={(e) => setSelectedLayerId(e.target.value)}
              >
                {availableLayers.map((layer) => (
                  <option
                    key={layer.id}
                    value={layer.id}
                    title={layer.name || layer.id}
                  >
                    {layer.name || layer.id}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {dateDomain.length > 0 && (
            <div className='position-relative'>
              <InputGroup className='margin-top-0'>
                <TextInput
                  id='date-picker'
                  name='date-picker'
                  readOnly
                  type='text'
                  className='padding-1 cursor-pointer margin-top-0'
                  value={
                    calendarDate
                      ? dateFns.format(calendarDate, 'yyyy-MM-dd')
                      : ''
                  }
                  onClick={() => setShowCalendar(!showCalendar)}
                />
                <InputSuffix
                  className='display-flex'
                  style={{ pointerEvents: 'none' }}
                >
                  <Icon.CalendarToday />
                </InputSuffix>
              </InputGroup>
              {showCalendar && (
                <div className='position-absolute top-100 left-0 margin-top-1 z-300'>
                  <Calendar
                    onChange={handleDateChange}
                    value={calendarDate}
                    minDate={new Date(dateDomain[0])}
                    maxDate={new Date(dateDomain[dateDomain.length - 1])}
                    maxDetail={maxDetail}
                    selectRange={false}
                    nextLabel={<Icon.NavigateNext />}
                    prevLabel={<Icon.NavigateBefore />}
                    next2Label={<Icon.NavigateFarNext />}
                    prev2Label={<Icon.NavigateFarBefore />}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
