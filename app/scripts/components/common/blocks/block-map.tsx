import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { DatasetDatumFnResolverBag, ProjectionOptions, datasets } from 'veda';
import { MapboxOptions } from 'mapbox-gl';
import * as dateFns from 'date-fns';
import {
  convertProjectionToMapbox,
  projectionDefault,
  validateProjectionBlockProps
} from '../mapbox/map-options/utils';
import { BasemapId } from '../mapbox/map-options/basemaps';
import { Basemap } from '../map/style-generators/basemap';
import MapOptionsControl from '../map/controls/map-options';
import { LayerLegend, LayerLegendContainer } from '../mapbox/layer-legend';
import MapCoordsControl from '../map/controls/coords';
import MapMessage from '../mapbox/map-message';
import { formatCompareDate } from '../mapbox/utils';
import { resolveConfigFunctions } from '../mapbox/layers/utils';
import { useBasemap } from '../map/controls/hooks/use-basemap';
import { DEFAULT_MAP_STYLE_URL } from '../map/controls/map-options/basemap';
import { utcString2userTzDate } from '$utils/date';
import MapboxMap, { MapboxMapProps } from '$components/common/mapbox';
import Map, { Compare, MapControls } from '$components/common/map';
import { validateRangeNum } from '$utils/utils';
import { HintedError } from '$utils/hinted-error';
import {
  AttributionControl,
  NavigationControl,
  ScaleControl
} from '$components/common/map/controls';
import { Layer } from '$components/exploration/components/map/layer';
import { useDatasetAsyncLayer } from '$context/layer-data';
import {
  S_SUCCEEDED
} from '$utils/status';
import { TimelineDatasetSuccess } from '$components/exploration/types.d.ts';

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

interface MapBlockProps extends Pick<MapboxMapProps, 'datasetId' | 'layerId'> {
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
    projectionId,
    projectionCenter,
    projectionParallels,
    basemapId
  } = props;

  const errors = validateBlockProps(props);

  const {
    labelsOption,
    boundariesOption,
    onOptionChange
  } = useBasemap();

  if (errors.length) {
    throw new HintedError('Malformed Map Block', errors);
  }

  const selectedDatetime = dateTime
    ? utcString2userTzDate(dateTime)
    : undefined;
  const selectedCompareDatetime = compareDateTime
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
        ...projection,
        id: projectionId
      };
    } else {
      return projectionDefault;
    }
  }, [projectionId, projectionCenter, projectionParallels]);

  const [projection, setProjection] = useState(projectionStart);

  const dataset = datasetId ? datasets[datasetId] : null;

  const author = dataset?.data?.media?.author?.name;
  const { baseLayer, compareLayer } = useDatasetAsyncLayer(datasetId, layerId);

  const resolverBag = useMemo<DatasetDatumFnResolverBag>(
    () => ({ datetime: selectedDatetime, compareDatetime: selectedCompareDatetime, dateFns }),
    [selectedDatetime, selectedCompareDatetime]
  );

  // Resolve data needed for the base layer once the layer is loaded
  const [baseLayerResolvedData] = useMemo(() => {
    if (baseLayer?.status !== S_SUCCEEDED || !baseLayer.data)
      return [null, null];

    // Include access to raw data.
    const bag = { ...resolverBag, raw: baseLayer.data };
    const data = resolveConfigFunctions(baseLayer.data, bag);

    return [data];
  }, [baseLayer, resolverBag]);

  // Resolve data needed for the compare layer once it is loaded.
  const [compareLayerResolvedData] = useMemo(() => {
    if (compareLayer?.status !== S_SUCCEEDED || !compareLayer.data)
      return [null, null];

    // Include access to raw data.
    const bag = { ...resolverBag, raw: compareLayer.data };
    const data = resolveConfigFunctions(compareLayer.data, bag);

    return [data];
  }, [compareLayer, resolverBag]);

  const baseDataLayer = {data: baseLayerResolvedData};
  const compareDataLayer = {data: compareLayerResolvedData};

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

  const baseTimeDensity = baseDataLayer?.data?.timeseries.timeDensity;
  const compareTimeDensity = compareDataLayer?.data?.timeseries.timeDensity;

  const compareToDate = useMemo(() => {
    const theDate = selectedCompareDatetime ?? selectedDatetime;
    return theDate instanceof Date && !isNaN(theDate.getTime())
      ? theDate
      : null;
  }, [selectedCompareDatetime, selectedDatetime]);

  const computedCompareLabel = useMemo(() => {
    // Use a provided label if it exist.
    const providedLabel = compareLabel ?? compareDataLayer?.data?.mapLabel;
    if (providedLabel) return providedLabel as string;

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
    compareDataLayer?.data?.mapLabel,
    selectedDatetime,
    compareToDate,
    baseTimeDensity,
    compareTimeDensity
  ]);

  const initialPosition = useMemo(() => center ? { lng: center[0], lat: center[1], zoom } : undefined , [center, zoom]);

  return (
    <Carto>
      <Map id={generatedId} mapOptions={{...mapOptions, ...getMapPositionOptions(initialPosition)}} enableDefaultAttribution={false}>
        <Basemap
          basemapStyleId={mapBasemapId}
        />
        {
          dataset &&
          selectedDatetime &&
          layerId &&
          baseDataLayer?.data &&
          (
            <Layer
              key={baseDataLayer.data.id}
              id={`base-${baseDataLayer.data.id}`}
              dataset={(baseDataLayer as unknown) as TimelineDatasetSuccess}
              selectedDay={selectedDatetime}
            />
          )
        }
        {baseLayer?.data?.legend && (
          // Map overlay element
          // Layer legend for the active layer.
          // @NOTE: LayerLegendContainer is in old mapbox directory, may want to move this over to /map directory once old directory is deprecated
          <LayerLegendContainer>
            <LayerLegend
              id={`base-${baseLayer.data.id}`}
              title={baseLayer.data.name}
              description={baseLayer.data.description}
              {...baseLayer.data.legend}
            />
            {compareLayer?.data?.legend &&
              !!selectedCompareDatetime &&
              baseLayer.data.id !== compareLayer.data.id && (
                <LayerLegend
                  id={`compare-${compareLayer.data.id}`}
                  title={compareLayer.data.name}
                  description={compareLayer.data.description}
                  {...compareLayer.data.legend}
                />
              )}
          </LayerLegendContainer>
        )}
        <MapControls>
          <MapMessage
            id='compare-message'
            active={
              !!(
                selectedCompareDatetime &&
                compareLayer?.data
              )
            }
          >
            {computedCompareLabel}
          </MapMessage>
          {
            author && <AttributionControl message={`Figure by ${author}`} />
          }
          <ScaleControl />
          <NavigationControl />
          <MapCoordsControl />
          <MapOptionsControl
            projection={projection}
            onProjectionChange={setProjection}
            basemapStyleId={mapBasemapId}
            onBasemapStyleIdChange={setMapBasemapId}
            labelsOption={labelsOption}
            boundariesOption={boundariesOption}
            onOptionChange={onOptionChange}
          />
        </MapControls>
        <Compare>
          <Basemap
            basemapStyleId={mapBasemapId}
          />
        {
          dataset &&
          selectedCompareDatetime &&
          layerId &&
          compareDataLayer?.data &&
          (
            <Layer
              key={compareDataLayer.data.id}
              id={`compare-${compareDataLayer.data.id}`}
              dataset={(compareDataLayer as unknown) as TimelineDatasetSuccess}
              selectedDay={selectedCompareDatetime}
            />
          )
        }
        </Compare>
      </Map>
    </Carto>
  );
}

export default MapBlock;
