import { FunctionComponent, useEffect } from 'react';
import { Feature } from 'geojson';
import { Map as MapboxMap } from 'mapbox-gl';
import { defaultsDeep, clamp } from 'lodash';
import axios, { Method } from 'axios';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval
} from 'date-fns';
import { endOfDay, startOfDay } from 'date-fns';
import {
  datasets,
  DatasetLayer,
  DatasetLayerCompareInternal,
  DatasetLayerCompareSTAC,
  DatasetDatumFn,
  DatasetDatumFnResolverBag,
  DatasetDatumReturnType,
  DatasetLayerCompareNormalized,
  DatasetLayerType
} from 'veda';
import {
  MapLayerRasterTimeseriesProps,
  StacFeature
} from './raster-timeseries';
import { MapLayerVectorTimeseriesProps } from './vector-timeseries';
import { MapLayerZarrTimeseriesProps } from './zarr-timeseries';
import { MapLayerCMRTimeseriesProps } from './cmr-timeseries';

import { userTzDate2utcString, utcString2userTzDate } from '$utils/date';
import { AsyncDatasetLayer } from '$context/layer-data';
import { S_FAILED, S_IDLE, S_LOADING, S_SUCCEEDED } from '$utils/status';
import { HintedError } from '$utils/hinted-error';
import { RasterTimeseries } from '$components/common/map/style-generators/raster-timeseries';
import { VectorTimeseries } from '$components/common/map/style-generators/vector-timeseries';
import { ZarrTimeseries } from '$components/common/map/style-generators/zarr-timeseries';
import { CMRTimeseries } from '$components/common/map/style-generators/cmr-timeseries';

export const getLayerComponent = (
  isTimeseries: boolean,
  layerType: DatasetLayerType
): FunctionComponent<
  | MapLayerRasterTimeseriesProps
  | MapLayerVectorTimeseriesProps
  | MapLayerZarrTimeseriesProps
  | MapLayerCMRTimeseriesProps
> | null => {
  if (isTimeseries) {
    if (layerType === 'raster') return RasterTimeseries;
    if (layerType === 'vector') return VectorTimeseries;
    if (layerType === 'zarr') return ZarrTimeseries;
    if (layerType === 'cmr') return CMRTimeseries;
  }

  return null;
};

/**
 * Returns the correct data for the compare layer depending on whether is a
 * layer from another dataset, or a STAC layer declared inline.
 *
 * @param layerData object The data for the current layer
 * @returns object
 */
export const getCompareLayerData = (
  layerData: DatasetLayer | null
): DatasetLayerCompareNormalized | null => {
  if (!layerData?.compare) return null;
  const { compare } = layerData;

  /* eslint-disable-next-line prettier/prettier */
  const compareInternal = compare as DatasetLayerCompareInternal;
  const compareSTAC = compare as DatasetLayerCompareSTAC;

  // If the stacCol property exists it is a layer to be loaded from STAC. In the
  // case of a STAC layer defined inline the missing properties are inherited
  // from the parent layer.
  if (compareSTAC.stacCol) {
    // Extract properties that need special handling, letting the other ones
    // through.
    const { stacCol, type, zoomExtent, sourceParams, ...passThroughProps } =
      compareSTAC;

    return {
      id: stacCol,
      stacCol,
      type: type || layerData.type,
      zoomExtent: zoomExtent ?? layerData.zoomExtent,
      sourceParams: defaultsDeep({}, sourceParams, layerData.sourceParams),
      ...passThroughProps
    };
  }

  // When we're comparing against a layer from another dataset, that layer's
  // properties are overridden with the ones provided in the compare object.
  if (compareInternal.layerId) {
    // Extract properties that need special handling, letting the other ones
    // through.
    const {
      datasetId,
      layerId,
      zoomExtent,
      sourceParams,
      ...passThroughProps
    } = compareInternal;

    const errorHints: string[] = [];

    const datasetData = datasets[datasetId]?.data;
    if (!datasetData) {
      // eslint-disable-next-line fp/no-mutating-methods
      errorHints.push(`Dataset [${datasetId}] not found (compare.datasetId)`);
    }

    const otherLayer = datasetData?.layers.find((l) => l.id === layerId);
    if (!otherLayer) {
      // eslint-disable-next-line fp/no-mutating-methods
      errorHints.push(
        `Layer [${layerId}] not found in dataset [${datasetId}] (compare.layerId)`
      );
    }

    if (!datasetData || !otherLayer) {
      throw new HintedError(
        `Malformed compare for layer: ${layerData.id}`,
        errorHints
      );
    }

    return {
      id: otherLayer.id,
      type: otherLayer.type,
      name: otherLayer.name,
      description: otherLayer.description,
      legend: otherLayer.legend,
      stacApiEndpoint: otherLayer.stacApiEndpoint,
      tileApiEndpoint: otherLayer.tileApiEndpoint,
      stacCol: otherLayer.stacCol,
      zoomExtent: zoomExtent ?? otherLayer.zoomExtent,
      sourceParams: defaultsDeep({}, sourceParams, otherLayer.sourceParams),
      ...passThroughProps
    };
  }

  throw new Error('Layer specified in compare was not found.');
};

type Fn = (...args: any[]) => any;

type ObjResMap<T> = {
  [K in keyof T]: Res<T[K]>;
};

type Res<T> = T extends Fn
  ? T extends DatasetDatumFn<DatasetDatumReturnType>
    ? DatasetDatumReturnType
    : never
  : T extends any[]
  ? Res<T[number]>[]
  : T extends object
  ? ObjResMap<T>
  : T;

export function resolveConfigFunctions<T>(
  datum: T,
  bag: DatasetDatumFnResolverBag
): Res<T>;
/* eslint-disable-next-line no-redeclare */
export function resolveConfigFunctions<T extends any[]>(
  datum: T,
  bag: DatasetDatumFnResolverBag
): Res<T[number]>[];
/* eslint-disable-next-line no-redeclare */
export function resolveConfigFunctions(
  datum: any,
  bag: DatasetDatumFnResolverBag
): any {
  if (Array.isArray(datum)) {
    return datum.map((v) => resolveConfigFunctions(v, bag));
  }

  if (datum != null && typeof datum === 'object') {
    // Use for loop instead of reduce as it faster.
    const ready = {};
    for (const [k, v] of Object.entries(datum as object)) {
      ready[k] = resolveConfigFunctions(v, bag);
    }
    return ready;
  }

  if (typeof datum === 'function') {
    try {
      return datum(bag);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(
        'Failed to resolve function %s(%o) with error %s',
        datum.name,
        bag,
        error.message
      );
      return null;
    }
  }

  return datum;
}

/**
 * Checks the loading status of a layer taking into account the base layer and
 * the compare layer if any.
 * @param asyncLayer The async layer to check
 * @returns Coalesced status
 */
export function checkLayerLoadStatus(asyncLayer: AsyncDatasetLayer) {
  const { baseLayer, compareLayer } = asyncLayer;

  if (
    baseLayer.status === S_SUCCEEDED &&
    (!compareLayer || compareLayer.status === S_SUCCEEDED)
  ) {
    return S_SUCCEEDED;
  }

  if (
    baseLayer.status === S_LOADING ||
    (compareLayer && compareLayer.status === S_LOADING)
  ) {
    return S_LOADING;
  }

  if (
    baseLayer.status === S_FAILED ||
    (compareLayer && compareLayer.status === S_FAILED)
  ) {
    return S_FAILED;
  }

  return S_IDLE;
}

declare global {
  interface Array<T> {
    last: T;
  }
}

type AsyncDatasetLayerData<T extends 'baseLayer' | 'compareLayer'> = Exclude<
  AsyncDatasetLayer[T],
  null
>['data'];

/**
 * Resolves the temporal extend of the given Async Layer.
 * Uses the properties from the timeseries to generate the layer's full temporal
 * extent.
 *
 * @param layerData The Async layer data.
 * @returns Array of Dates
 */
export function resolveLayerTemporalExtent(
  layerData:
    | AsyncDatasetLayerData<'baseLayer'>
    | AsyncDatasetLayerData<'compareLayer'>
): Date[] | null {
  if (!layerData?.timeseries) return null;

  const { domain, isPeriodic, timeDensity } = layerData.timeseries;

  if (!isPeriodic) return domain.map((d) => utcString2userTzDate(d));

  if (timeDensity === 'year') {
    return eachYearOfInterval({
      start: utcString2userTzDate(domain[0]),
      end: utcString2userTzDate(domain.last)
    });
  } else if (timeDensity === 'month') {
    return eachMonthOfInterval({
      start: utcString2userTzDate(domain[0]),
      end: utcString2userTzDate(domain.last)
    });
  } else if (timeDensity === 'day') {
    return eachDayOfInterval({
      start: utcString2userTzDate(domain[0]),
      end: utcString2userTzDate(domain.last)
    });
  }

  throw new Error(
    `Invalid time density [${timeDensity}] on layer [${layerData.id}]`
  );
}

// There are cases when the data can't be displayed properly on low zoom levels.
// In these cases instead of displaying the raster tiles, we display markers to
// indicate whether or not there is data in a given location. When the user
// crosses the marker threshold, if below the min zoom we have to request the
// marker position, and if above we have to register a mosaic query. Since this
// switching can happen several times, we cache the api response using the
// request params as key.
const quickCache = new Map<string, any>();
interface RequestQuickCacheParams {
  url: string;
  method?: Method;
  payload?: any;
  controller: AbortController;
}
export async function requestQuickCache({
  url,
  payload,
  controller,
  method = 'post'
}: RequestQuickCacheParams) {
  const key = `${method}:${url}${JSON.stringify(payload)}`;

  // No cache found, make request.
  if (!quickCache.has(key)) {
    const response = await axios({
      url,
      method,
      data: payload,
      signal: controller.signal
    });
    quickCache.set(key, response.data);
  }
  return quickCache.get(key);
}

/**
 * Creates the appropriate filter object to send to STAC.
 *
 * @param {Date} date Date to request
 * @param {string} collection STAC collection to request
 * @returns Object
 */
export function getFilterPayload(date: Date, collection: string) {
  return {
    op: 'and',
    args: [
      {
        op: '>=',
        args: [{ property: 'datetime' }, userTzDate2utcString(startOfDay(date))]
      },
      {
        op: '<=',
        args: [{ property: 'datetime' }, userTzDate2utcString(endOfDay(date))]
      },
      {
        op: 'eq',
        args: [{ property: 'collection' }, collection]
      }
    ]
  };
}

export function getMergedBBox(features: StacFeature[]) {
  const mergedBBox = [
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY
  ];
  return features.reduce(
    (acc, feature) => [
      feature.bbox[0] < acc[0] ? feature.bbox[0] : acc[0],
      feature.bbox[1] < acc[1] ? feature.bbox[1] : acc[1],
      feature.bbox[2] > acc[2] ? feature.bbox[2] : acc[2],
      feature.bbox[3] > acc[3] ? feature.bbox[3] : acc[3]
    ],
    mergedBBox
  ) as [number, number, number, number];
}

export const FIT_BOUNDS_PADDING = 32;

interface LayerInteractionHookOptions {
  layerId: string;
  mapInstance: MapboxMap;
  onClick: (features: Feature<any>[]) => void;
}
export function useLayerInteraction({
  layerId,
  mapInstance,
  onClick
}: LayerInteractionHookOptions) {
  useEffect(() => {
    const onPointsClick = (e) => {
      if (!e.features.length) return;
      onClick(e.features);
    };

    const onPointsEnter = () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    };

    const onPointsLeave = () => {
      mapInstance.getCanvas().style.cursor = '';
    };

    mapInstance.on('click', layerId, onPointsClick);
    mapInstance.on('mouseenter', layerId, onPointsEnter);
    mapInstance.on('mouseleave', layerId, onPointsLeave);

    return () => {
      mapInstance.off('click', layerId, onPointsClick);
      mapInstance.off('mouseenter', layerId, onPointsEnter);
      mapInstance.off('mouseleave', layerId, onPointsLeave);
    };
  }, [layerId, mapInstance, onClick]);
}

type OptionalBbox = number[] | undefined | null;

/**
 * MapboxGL requires maxX value to be 180, minX -180, maxY 90, minY -90
 * While some of the datasets having bbox going above it.
 * @param bounds Bounding box to fit layer
 * @returns Boolean
 */

function clampBbox(
  bounds: [number, number, number, number]
): [number, number, number, number] {
  const [minX, minY, maxX, maxY] = bounds;
  return [
    clamp(minX, -180, 180),
    clamp(minY, -90, 90),
    clamp(maxX, -180, 180),
    clamp(maxY, -90, 90)
  ];
}

/**
 * Centers on the given bounds if the current position is not within the bounds,
 * and there's no user defined position (via user initiated map movement). Gives
 * preference to the layer defined bounds over the STAC collection bounds.
 *
 * @param mapInstance Mapbox instance
 * @param isUserPositionSet Whether the user has set a position
 * @param initialBbox Bounding box from the layer
 * @param stacBbox Bounds from the STAC collection
 */
export function useFitBbox(
  mapInstance: MapboxMap,
  isUserPositionSet: boolean,
  initialBbox: OptionalBbox,
  stacBbox: OptionalBbox
) {
  useEffect(() => {
    if (isUserPositionSet) return;

    // Prefer layer defined bounds to STAC collection bounds.
    const bounds = (initialBbox ?? stacBbox) as
      | [number, number, number, number]
      | undefined;

    if (bounds?.length) {
      const clampedBbox = clampBbox(bounds);
      mapInstance.fitBounds(clampedBbox, { padding: FIT_BOUNDS_PADDING });
    }
  }, [mapInstance, isUserPositionSet, initialBbox, stacBbox]);
}
