import React, { useMemo, useState, useEffect } from 'react';

import Calendar from 'react-calendar';
import * as dateFns from 'date-fns';
import type { Value } from 'react-calendar/dist/cjs/shared/types';
import type { BasemapId } from '../map/controls/map-options/basemap';
import MapBlock from './block-map';
import {
  USWDSIcon as Icon,
  USWDSSelect as Select,
  USWDSTextInput as TextInput,
  USWDSInputSuffix as InputSuffix,
  USWDSInputGroup as InputGroup
} from '$uswds';
import type { ProjectionOptions } from '$types/veda';
import type { VizDatasetSuccess } from '$components/exploration/types.d.ts';
import type { DatasetLayer } from '$types/veda';

import 'react-calendar/dist/Calendar.css';
import './multilayer-map.scss';

interface MultiLayerMapBlockProps {
  baseDataLayer?: VizDatasetSuccess | null;
  availableLayers?: DatasetLayer[];
  selectedLayerId: string;
  dateTime?: string;
  center?: [number, number];
  zoom?: number;
  projectionId?: ProjectionOptions['id'];
  projectionCenter?: ProjectionOptions['center'];
  projectionParallels?: ProjectionOptions['parallels'];
  basemapId?: BasemapId;
  excludeLayers?: string[];
  onLayerChange?: (layerId: string) => void;
  onDateChange?: (date: string) => void;
}

export default function MultiLayerMapBlock({
  baseDataLayer,
  availableLayers = [],
  selectedLayerId,
  dateTime,
  center,
  zoom,
  projectionId,
  projectionCenter,
  projectionParallels,
  basemapId,
  excludeLayers = [],
  onLayerChange,
  onDateChange
}: MultiLayerMapBlockProps) {
  const [selectedDate, setSelectedDate] = useState(dateTime);
  const [calendarDate, setCalendarDate] = useState(
    dateTime ? new Date(dateTime) : null
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentLayerData, setCurrentLayerData] =
    useState<VizDatasetSuccess | null>(baseDataLayer || null);

  useEffect(() => {
    setSelectedDate(dateTime);
    setCalendarDate(dateTime ? new Date(dateTime) : null);
  }, [dateTime]);

  useEffect(() => {
    setCurrentLayerData(baseDataLayer ?? null);
  }, [baseDataLayer]);

  const filteredLayers = useMemo(() => {
    return availableLayers.filter((layer) => !excludeLayers.includes(layer.id));
  }, [availableLayers, excludeLayers]);

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
      const newDateString = dateFns.format(date, 'yyyy-MM-01');
      setCalendarDate(date);
      setSelectedDate(newDateString);
      setShowCalendar(false);
      if (onDateChange) {
        onDateChange(newDateString);
      }
    }
  };

  const handleLayerDataUpdate = (layerData: VizDatasetSuccess | null) => {
    setCurrentLayerData(layerData);
  };

  const handleLayerSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLayerId = e.target.value;
    if (onLayerChange) {
      onLayerChange(newLayerId);
    }
  };

  return (
    <div className='multilayer-map position-relative'>
      <MapBlock
        baseDataLayer={baseDataLayer}
        dateTime={selectedDate}
        center={center}
        zoom={zoom}
        projectionId={projectionId}
        projectionCenter={projectionCenter}
        projectionParallels={projectionParallels}
        basemapId={basemapId}
        onLayerDataUpdate={handleLayerDataUpdate}
        isMapMessageEnabled={false}
        navigationControlPosition='bottom-left'
      />

      <div className='position-absolute top-3 left-3 z-200 radius-md shadow-lg'>
        <div className='grid-row grid-gap-1'>
          {filteredLayers.length > 1 && (
            <div>
              <Select
                id='layer-select'
                name='layer-select'
                className='truncate-select padding-1 padding-right-3 margin-top-0'
                value={selectedLayerId}
                onChange={handleLayerSelectChange}
              >
                {filteredLayers.map((layer) => (
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
