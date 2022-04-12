import React, { useRef } from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { utcString2userTzDate, isValidDate } from '$utils/date';
import MapboxMap from '$components/common/mapbox';
import { validateRangeNum } from '$utils/utils';

const Carto = styled.div`
  position: relative;
  flex-grow: 1;
  height: 32rem;

  ${MapboxMap} {
    position: absolute;
    inset: 0;
  }
`;

// This global variable is used to give unique ID to mapbox container
let mapInstanceId = 0;

const lngValidator = validateRangeNum(-180, 180);
const latValidator = validateRangeNum(-90, 90);

function MapBlock({ datasetId, dateTime, layerId, isComparing, center, zoom }) {
  const mapboxRef = useRef(null);
  if (!isValidDate(dateTime)) {
    throw Error(
      'Date format is wrong. Did you pass the right date in yyyy-mm-dd format? '
    );
  }

  // center is not required, but if provided must be in the correct range.
  if (center && (!lngValidator(center[0]) || !latValidator(center[1]))) {
    throw Error(
      'center format is wrong. Did you use [longitude, latitude] format? '
    );
  }

  const selectedDatetime = utcString2userTzDate(dateTime);

  return (
    <Carto>
      <MapboxMap
        ref={mapboxRef}
        id={`map-${mapInstanceId++}`}
        datasetId={datasetId}
        layerId={layerId}
        date={selectedDatetime}
        isComparing={isComparing}
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
