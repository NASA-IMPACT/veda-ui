import React, { useMemo, useRef, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { useDatasetAsyncLayers } from '$context/layer-data';
import { utcString2userTzDate } from '$utils/date';
import MapboxMap from '$components/common/mapbox';
import { checkLayerLoadStatus } from '$components/common/mapbox/layers/utils';

const Carto = styled.div`
  position: relative;
  flex-grow: 1;
  background: ${themeVal('color.surface')};
  height: 500px;

  ${MapboxMap} {
    position: absolute;
    inset: 0;
  }
`;

let mapInstanceId = 0;
function MapBlock({ datasetId, dateTime, layerId, isComparing }) {
  const mapboxRef = useRef(null);
  const selectedDatetime = utcString2userTzDate(new Date(dateTime));
  const asyncLayers = useDatasetAsyncLayers(datasetId);

  const activeLayer = useMemo(() => {
    return asyncLayers.find((l) => {
      const status = checkLayerLoadStatus(l);
      return status === 'succeeded' && l.baseLayer.data.id === layerId;
    });
  }, [asyncLayers, layerId]);

  return (
    <Carto>
      <MapboxMap
        ref={mapboxRef}
        id={`map-${mapInstanceId++}`}
        datasetId={datasetId}
        layerId={activeLayer?.baseLayer.data?.id}
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
