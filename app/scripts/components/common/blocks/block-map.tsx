import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { utcString2userTzDate } from '$utils/date';
import MapboxMap, { MapboxMapProps } from '$components/common/mapbox';
import { validateRangeNum } from '$utils/utils';
import { HintedError } from '$utils/hinted-error';
import {
  Projection,
  projectionDefault,
  ProjectionName,
  projectionsList
} from '../mapbox/projection-selector';
import { useEffect } from 'react';

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
  const {
    dateTime,
    compareDateTime,
    center,
    zoom,
    projectionName,
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

  // Projections
  const projectionErrors: string[] = [];
  if (projectionName) {
    const allowedProjections = projectionsList.map((p) => p.id);
    const projectionsConic = projectionsList
      .filter((p) => p.isConic)
      .map((p) => p.id);

    if (!allowedProjections.includes(projectionName)) {
      const a = allowedProjections.join(', ');
      projectionErrors.push(`- Invalid projectionName. Must be one of: ${a}.`);
    }

    if (projectionsConic.includes(projectionName)) {
      if (
        !projectionCenter ||
        !lngValidator(projectionCenter[0]) ||
        !latValidator(projectionCenter[1])
      ) {
        const o = projectionsConic.join(', ');
        projectionErrors.push(
          `- Invalid projectionCenter. This property is required for ${o} projections. Use [longitude, latitude].`
        );
      }

      if (
        !projectionParallels ||
        !latValidator(projectionParallels[0]) ||
        !latValidator(projectionParallels[1])
      ) {
        const o = projectionsConic.join(', ');
        projectionErrors.push(
          `- Invalid projectionParallels. This property is required for ${o} projections. Use [Southern parallel latitude, Northern parallel latitude].`
        );
      }
    }
  }

  return [
    missingError,
    dateError,
    zoomError,
    centerError,
    compareDateError,
    ...projectionErrors
  ].filter(Boolean) as string[];
}

interface MapBlockProps extends Pick<MapboxMapProps, 'datasetId' | 'layerId'> {
  dateTime?: string;
  compareDateTime?: string;
  center?: [number, number];
  zoom?: number;
  compareLabel?: string;
  projectionName: ProjectionName;
  projectionCenter: Projection['center'];
  projectionParallels: Projection['parallels'];
  allowProjectionChange?: boolean;
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
    projectionName,
    projectionCenter,
    projectionParallels,
    allowProjectionChange
  } = props;

  const errors = validateBlockProps(props);

  if (errors.length) {
    throw new HintedError('Malformed Map Block', errors);
  }

  const selectedDatetime = dateTime
    ? utcString2userTzDate(dateTime)
    : undefined;
  const selectedCompareDatetime = compareDateTime
    ? utcString2userTzDate(compareDateTime)
    : undefined;

  const projectionStart = useMemo(
    () =>
      projectionName
        ? {
            name: projectionName,
            center: projectionCenter,
            parallels: projectionParallels
          }
        : projectionDefault,
    [projectionName, projectionCenter, projectionParallels]
  );

  const [projection, setProjection] = useState(projectionStart);

  useEffect(() => {
    setProjection(projectionStart);
  }, [projectionStart]);

  return (
    <Carto>
      <MapboxMap
        id={generatedId}
        datasetId={datasetId}
        layerId={layerId}
        date={selectedDatetime}
        isComparing={!!selectedCompareDatetime}
        compareDate={selectedCompareDatetime}
        compareLabel={compareLabel}
        initialPosition={{ lng: center?.[0], lat: center?.[1], zoom }}
        cooperativeGestures
        projection={projection}
        onProjectionChange={allowProjectionChange ? setProjection : undefined}
      />
    </Carto>
  );
}

export default MapBlock;
