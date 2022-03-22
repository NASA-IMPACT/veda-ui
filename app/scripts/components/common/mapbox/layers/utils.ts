import defaultsDeep from 'lodash.defaultsdeep';
import { eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import {
  datasets,
  DatasetLayer,
  DatasetLayerCompareInternal,
  DatasetLayerCompareSTAC,
  DatasetDatumFn,
  DatasetDatumFnResolverBag,
  DatasetDatumReturnType,
  DatasetLayerCompareNormalized
} from 'delta/thematics';

import { utcString2userTzDate } from '$utils/date';
import { AsyncDatasetLayer } from '$context/layer-data';
import { MapLayerRasterTimeseries } from './raster-timeseries';

export const RASTER_ENDPOINT =
  'https://b38fnvpkoh.execute-api.us-east-1.amazonaws.com';
export const STAC_ENDPOINT =
  'https://j2wlly6xg8.execute-api.us-east-1.amazonaws.com';

export const getLayerComponent = (isTimeseries, layerType) => {
  if (isTimeseries) {
    if (layerType === 'raster') return MapLayerRasterTimeseries;
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
): DatasetLayerCompareNormalized => {
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
      type: type || layerData.type,
      zoomExtent: zoomExtent || layerData.zoomExtent,
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

    const datasetData = datasets[datasetId].data;
    const otherLayer = datasetData.layers.find((l) => l.id === layerId);

    return {
      id: otherLayer.id,
      type: otherLayer.type,
      zoomExtent: zoomExtent || otherLayer.zoomExtent,
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
  ? Array<Res<T[number]>>
  : T extends object
  ? ObjResMap<T>
  : T;

export function resolveConfigFunctions<T>(
  datum: T,
  bag: DatasetDatumFnResolverBag
): Res<T>;
export function resolveConfigFunctions<T extends Array<any>>(
  datum: T,
  bag: DatasetDatumFnResolverBag
): Array<Res<T[number]>>;
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
      console.error('Failed to resolve function %s(%o) with error %s', datum.name, bag, error.message);
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
    baseLayer.status === 'succeeded' &&
    (!compareLayer || compareLayer.status === 'succeeded')
  ) {
    return 'succeeded';
  }

  if (
    baseLayer.status === 'loading' ||
    (compareLayer && compareLayer.status === 'loading')
  ) {
    return 'loading';
  }

  if (
    baseLayer.status === 'failed' ||
    (compareLayer && compareLayer.status === 'failed')
  ) {
    return 'failed';
  }

  return 'idle';
}

declare global {
  interface Array<T> {
    last: T;
  }
}

type AsyncDatasetLayerData<T extends keyof AsyncDatasetLayer> =
  AsyncDatasetLayer[T]['data'];

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
): Date[] {
  if (!layerData?.timeseries) return null;

  const { domain, isPeriodic, timeDensity } = layerData.timeseries;

  if (!isPeriodic) return domain.map((d) => utcString2userTzDate(d));

  if (timeDensity === 'month') {
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
