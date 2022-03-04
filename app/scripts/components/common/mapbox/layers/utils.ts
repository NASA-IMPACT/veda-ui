import defaultsDeep from 'lodash.defaultsdeep';
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
    return {
      id: compareSTAC.stacCol,
      type: compareSTAC.type || layerData.type,
      zoomExtent: compareSTAC.zoomExtent || layerData.zoomExtent,
      datetime: compareSTAC.datetime,
      sourceParams: defaultsDeep(
        {},
        compareSTAC.sourceParams,
        layerData.sourceParams
      )
    };
  }

  // When we're comparing against a layer from another dataset, that layer's
  // properties are overridden with the ones provided in the compare object.
  if (compareInternal.layerId) {
    const datasetData = datasets[compareInternal.datasetId].data;
    const otherLayer = datasetData.layers.find(
      (l) => l.id === compareInternal.layerId
    );

    return {
      id: otherLayer.id,
      type: otherLayer.type,
      zoomExtent: compareInternal.zoomExtent || otherLayer.zoomExtent,
      datetime: compareInternal.datetime,
      sourceParams: defaultsDeep(
        {},
        compareSTAC.sourceParams,
        otherLayer.sourceParams
      )
    };
  }

  throw new Error('Layer specified in compare was not found.');
};

type Fn = (...args: any[]) => any

type ObjResMap<T> = {
  [K in keyof T]: Res<T[K]>
}

type Res<T> = T extends Fn
  ? T extends DatasetDatumFn<DatasetDatumReturnType>
    ? DatasetDatumReturnType
    : never
  : T extends any[]
    ? Array<Res<T[number]>>
    : T extends object
      ? ObjResMap<T>
      : T;

export function resolveConfigFunctions<T>(datum: T, bag: DatasetDatumFnResolverBag): Res<T>
export function resolveConfigFunctions<T extends Array<any>>(datum: T, bag: DatasetDatumFnResolverBag): Array<Res<T[number]>>
export function resolveConfigFunctions(datum: any, bag: DatasetDatumFnResolverBag): any {
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
    return datum(bag);
  }

  return datum;
}
