import React, { useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { utcString2userTzDate } from '$utils/date';
import MapboxMap, { MapboxMapProps } from '$components/common/mapbox';
import { validateRangeNum } from '$utils/utils';
import { HintedError } from '.';

export const mapHeight = '32rem';
const Carto = styled.div`
  position: relative;
  flex-grow: 1;
  height: ${mapHeight};

  ${MapboxMap} {
    position: absolute;
    inset: 0;
  }
`;

// This global variable is used to give unique ID to mapbox container
let mapInstanceId = 0;

const lngValidator = validateRangeNum(-180, 180);
const latValidator = validateRangeNum(-90, 90);

function validateBlockProps(props: MapBlockProps) {
  const { dateTime, compareDateTime, center, zoom } = props;

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

  if (
    missingError ||
    dateError ||
    zoomError ||
    centerError ||
    compareDateError
  ) {
    return [
      missingError,
      dateError,
      zoomError,
      centerError,
      compareDateError
    ].filter(Boolean) as string[];
  }

  return [];
}

interface MapBlockProps
  extends Pick<MapboxMapProps, 'datasetId' | 'layerId' | 'isComparing'> {
  dateTime?: string;
  compareDateTime?: string;
  center?: [number, number];
  zoom?: number;
  compareLabel?: string;
}

function MapBlock(props: MapBlockProps) {
  const generatedId = useMemo(() => `map-${++mapInstanceId}`, []);

  const {
    datasetId,
    layerId,
    dateTime,
    compareDateTime,
    isComparing,
    compareLabel,
    center,
    zoom
  } = props;

  const errors = validateBlockProps(props);

  if (errors.length) {
    const e = new HintedError('Malformed Map Block');
    e.hints = errors;
    throw e;
  }

  const selectedDatetime = dateTime
    ? utcString2userTzDate(dateTime)
    : undefined;
  const selectedCompareDatetime = compareDateTime
    ? utcString2userTzDate(compareDateTime)
    : undefined;

  return (
    <Carto>
      <MapboxMap
        id={generatedId}
        datasetId={datasetId}
        layerId={layerId}
        date={selectedDatetime}
        isComparing={isComparing}
        compareDate={selectedCompareDatetime}
        compareLabel={compareLabel}
        initialPosition={{ lng: center?.[0], lat: center?.[1], zoom }}
        cooperativeGestures
      />
    </Carto>
  );
}

MapBlock.propTypes = {
  datasetId: T.string,
  dateTime: T.string,
  layerId: T.string,
  isComparing: T.bool,
  center: T.arrayOf(T.number),
  zoom: T.number
};

export default MapBlock;
