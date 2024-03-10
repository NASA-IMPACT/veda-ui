import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { DatasetDatumFnResolverBag, ProjectionOptions } from 'veda';

import {
  convertProjectionToMapbox,
  projectionDefault,
  validateProjectionBlockProps
} from '../mapbox/map-options/utils';
import { BasemapId } from '../mapbox/map-options/basemaps';

import { utcString2userTzDate } from '$utils/date';
import MapboxMap, { MapboxMapProps } from '$components/common/mapbox';

import Map, { Compare, MapControls } from '$components/common/map';

import { validateRangeNum } from '$utils/utils';
import { HintedError } from '$utils/hinted-error';
import { Basemap } from '../map/style-generators/basemap';

import { datasets } from 'veda';

import {
  ScaleControl
} from '$components/common/map/controls';
import { Layer } from '$components/exploration/components/map/layer';
import { useDatasetAsyncLayer } from '$context/layer-data';
import { TimelineDatasetSuccess } from '$components/exploration/types.ts';
import MapOptionsControl from '../map/controls/map-options';
import { useBasemap } from '../map/controls/hooks/use-basemap';
import { LayerLegend, LayerLegendContainer } from '../mapbox/layer-legend';
import MapCoordsControl from '../map/controls/coords';
import MapMessage from '../mapbox/map-message';
import { formatCompareDate } from '../mapbox/utils';
import * as dateFns from 'date-fns';
import {
  S_SUCCEEDED
} from '$utils/status';
import { resolveConfigFunctions } from '../mapbox/layers/utils';

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
    allowProjectionChange,
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

  // @TODO-SANDRA: Temp for now, will revisit, need to get working for now
  const transformDataLayer: TimelineDatasetSuccess = (data) => {
    let transformedData = {};

    transformedData['data'] = data;
    return transformedData;
  }

  const baseDataLayer = transformDataLayer(baseLayerResolvedData);
  const compareDataLayer = transformDataLayer(compareLayerResolvedData);

  useEffect(() => {
    setProjection(projectionStart);
  }, [projectionStart]);

  const [mapBasemapId, setMapBasemapId] = useState(basemapId);

  useEffect(() => {
    if (!basemapId) return;

    setMapBasemapId(basemapId);
  }, [basemapId]);

  const baseTimeDensity = baseLayer?.data?.timeseries.timeDensity;
  const compareTimeDensity = compareLayer?.data?.timeseries.timeDensity;

  const compareToDate = useMemo(() => {
    const theDate = selectedCompareDatetime ?? selectedDatetime;
    return theDate instanceof Date && !isNaN(theDate.getTime())
      ? theDate
      : null;
  }, [selectedCompareDatetime, selectedDatetime]);

  const computedCompareLabel = useMemo(() => {
    // Use a provided label if it exist.
    const providedLabel = compareLabel ?? compareLayer?.data?.mapLabel;
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
    compareLayer?.data?.mapLabel,
    selectedDatetime,
    compareToDate,
    baseTimeDensity,
    compareTimeDensity
  ]);

  return (
    <>
      <Carto>
        <MapboxMap
          id={generatedId}
          datasetId={datasetId}
          layerId={layerId}
          date={selectedDatetime}
          isComparing={!!selectedCompareDatetime}
          compareDate={selectedCompareDatetime}
          compareLabel={compareLabel}
          initialPosition={
            center ? { lng: center[0], lat: center[1], zoom } : undefined
          }
          cooperativeGestures
          projection={projection}
          onProjectionChange={allowProjectionChange ? setProjection : undefined}
          basemapStyleId={mapBasemapId}
          onBasemapStyleIdChange={setMapBasemapId}
          withScale
        />
      </Carto>
      <Carto>
        <Map id={generatedId}>
          <Basemap
            basemapStyleId={mapBasemapId}
          />
          {
            dataset &&
            selectedDatetime &&
            layerId &&
            baseLayer?.data &&
            (
              <Layer
                key={baseDataLayer.data.id}
                id={`base-${baseDataLayer.data.id}`}
                dataset={(baseDataLayer as unknown) as TimelineDatasetSuccess || dataset}
                selectedDay={selectedDatetime}
                order={0}
              />
            )
          }
          {baseLayer?.data?.legend && (
            // Map overlay element
            // Layer legend for the active layer.
            //TODO-SANDRA: This is in the old mapbox directory, may want to move this over to new directory as well
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
            <ScaleControl/>
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
            compareLayer?.data &&
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
    </>
  );
}

export default MapBlock;
