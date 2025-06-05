import React, { useMemo, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { MapboxOptions } from 'mapbox-gl';
import * as dateFns from 'date-fns';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import {
  convertProjectionToMapbox,
  projectionDefault
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
import { RasterTimeseries } from '$components/common/map/style-generators/raster-timeseries';
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

import { ProjectionOptions, VedaData, DatasetData } from '$types/veda';
import { useVedaUI } from '$context/veda-ui-provider';

export const mapHeight = '32rem';
const Carto = styled.div`
  position: relative;
  flex-grow: 1;
  height: ${mapHeight};
`;

// This global variable is used to give unique ID to mapbox container
let mapInstanceId = 0;

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
  layerProps: VizDataset[];
}

const getDataLayer = (
  layerIndex: number,
  layers: VizDataset[] | undefined
): VizDatasetSuccess | null => {
  if (!layers || layers.length <= layerIndex) return null;
  const layer = layers[layerIndex];
  // @NOTE: What to do when data returns ERROR
  if (layer.status !== DatasetStatus.SUCCESS) return null;
  return {
    ...layer,
    settings: {
      isVisible: true,
      opacity: 100
    }
  };
};

async function fetchStacDatasetById(
  stacID: string,
  stacApiEndpointToUse: string
): Promise<StacDatasetData> {
  const { data } = await axios.get(
    `${stacApiEndpointToUse}/collections/${stacID}`
  );
  console.log(data);
  return data;
}

// Create a query object for react query.
function makeQueryObject(stacCol, envApiStacEndpoint: string) {
  return {
    queryKey: ['stac-collection', stacCol],
    queryFn: () => fetchStacDatasetById(stacCol, envApiStacEndpoint),
    // This data will not be updated in the context of a browser session, so it is
    // safe to set the staleTime to Infinity. As specified by react-query's
    // "Important Defaults", cached data is considered stale which means that
    // there would be a constant refetching.
    staleTime: Infinity,
    // Errors are always considered stale. If any layer errors, any refocus would
    // cause a refetch. This is normally a good thing but since we have a refetch
    // button, this is not needed.
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  };
}

export default function MapBlock(props: MapBlockProps) {
  const generatedId = useMemo(() => `map-${++mapInstanceId}`, []);

  const {
    layerProps,
    stacIDs = ['no2-monthly', 'nightlights-hd-monthly'],
    dateTime,
    compareDateTime,
    compareLabel,
    center,
    zoom,
    projectionId,
    projectionCenter,
    projectionParallels,
    children,
    basemapId
  } = props;

  // const [layers, setLayers] = useState<VizDataset[]>(layerProps);

  const { envApiStacEndpoint, envApiRasterEndpoint } = useVedaUI();

  // useReconcileWithStacMetadata(stacIDs, setLayers, envApiStacEndpoint);
  // Get data directly from queries - no state updates, no re-renders
  const fetchedData = useQueries({
    queries: stacIDs.map((id) => makeQueryObject(id, envApiStacEndpoint))
  });
  const layers = fetchedData.map((d) => d.data);

  const baseLayer = layers ? layers[0] : null;
  const compareLayer = layers.length > 1 ? layers[1] : null;
  const selectedDatetime: Date | undefined = dateTime
    ? utcString2userTzDate(dateTime)
    : undefined;

  const selectedCompareDatetime: Date | undefined = compareDateTime
    ? utcString2userTzDate(compareDateTime)
    : undefined;

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
        <Basemap basemapStyleId={basemapId} />
        {selectedDatetime && baseLayer && (
          <RasterTimeseries
            id='hard-coded-id'
            stacCol={stacIDs[0]}
            stacApiEndpoint={envApiStacEndpoint}
            tileApiEndpoint={envApiRasterEndpoint}
            date={selectedDatetime}
            zoomExtent={[0, 12]}
            sourceParams={baseLayer.renders.dashboard}
            envApiStacEndpoint={envApiStacEndpoint}
            envApiRasterEndpoint={envApiRasterEndpoint}
          />
        )}
        {children}
        <MapControls>
          <ScaleControl />
          <NavigationControl position='top-left' />
          <MapCoordsControl />
        </MapControls>
        {selectedCompareDatetime && compareLayer && (
          <Compare>
            <Basemap basemapStyleId={basemapId} />
            {compareLayer && (
              <RasterTimeseries
                id='hard-coded-compare'
                stacCol={stacIDs[1]}
                stacApiEndpoint={envApiStacEndpoint}
                tileApiEndpoint={envApiRasterEndpoint}
                date={selectedCompareDatetime}
                zoomExtent={[0, 12]}
                sourceParams={compareLayer.renders.dashboard}
                envApiStacEndpoint={envApiStacEndpoint}
                envApiRasterEndpoint={envApiRasterEndpoint}
              />
            )}
          </Compare>
        )}
      </Map>
    </Carto>
  );
}
