import React, { useMemo, useRef } from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { utcString2userTzDate } from '$utils/date';
import MapboxMap from '$components/common/mapbox';

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

function MapBlock({ datasetId, dateTime, layerId, isComparing }) {
  const mapboxRef = useRef(null);
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
      />
    </Carto>
  );
}

MapBlock.propTypes = {
  datasetId: T.string,
  dateTime: T.string,
  layerId: T.string,
  isComparing: T.bool
};

export default MapBlock;
