import axios, { Method } from 'axios';
import { format } from 'date-fns';
import { Map as MapboxMap } from 'mapbox-gl';
import { MapRef } from 'react-map-gl';
import { endOfDay, startOfDay } from 'date-fns';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import {
  DatasetDatumFn,
  DatasetDatumFnResolverBag,
  DatasetDatumReturnType
} from 'veda';

import { StacFeature } from './types';
import { TimeDensity } from '$context/layer-data';
import { userTzDate2utcString } from '$utils/date';
import { validateRangeNum } from '$utils/utils';

export const FIT_BOUNDS_PADDING = 32;

export const validateLon = validateRangeNum(-180, 180);
export const validateLat = validateRangeNum(-90, 90);

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

export function checkFitBoundsFromLayer(
  layerBounds?: [number, number, number, number],
  mapInstance?: MapboxMap | MapRef
) {
  if (!layerBounds || !mapInstance) return false;

  const [minXLayer, minYLayer, maxXLayer, maxYLayer] = layerBounds;
  const [[minXMap, minYMap], [maxXMap, maxYMap]] = mapInstance
    .getBounds()
    .toArray();
  const isOutside =
    maxXLayer < minXMap ||
    minXLayer > maxXMap ||
    maxYLayer < minYMap ||
    minYLayer > maxYMap;
  const layerExtentSmaller =
    maxXLayer - minXLayer < maxXMap - minXMap &&
    maxYLayer - minYLayer < maxYMap - minYMap;

  // only fitBounds if layer extent is smaller than viewport extent (ie zoom to area of interest),
  // or if layer extent does not overlap at all with viewport extent (ie pan to area of interest)
  return layerExtentSmaller || isOutside;
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
export function requestQuickCache<T>({
  url,
  payload,
  controller,
  method = 'post'
}: RequestQuickCacheParams): Promise<T> {
  if (controller.signal.aborted) {
    return Promise.reject(controller.signal.reason);
  }

  // Using a complicated promise structure to be able to abort the request even
  // for a synchronous cache hit.
  return new Promise((resolve, reject) => {
    const abortHandler = () => {
      reject(controller.signal.reason);
    };

    const key = `${method}:${url}${JSON.stringify(payload)}`;
    // Operation that will return the data.
    const dataPromise = !quickCache.has(key)
      ? axios({
          url,
          method,
          data: payload,
          signal: controller.signal
        }).then((response) => response.data)
      : Promise.resolve(quickCache.get(key));

    // Run the promise.
    dataPromise
      .then((data) => {
        quickCache.set(key, data);
        resolve(data);
      })
      .catch((error) => reject(error))
      .finally(() => {
        controller.signal.removeEventListener('abort', abortHandler);
      });

    controller.signal.addEventListener('abort', abortHandler);
  });
}

type Fn = (...args: any[]) => any;

export type ObjResMap<T> = {
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
export function resolveConfigFunctions<T extends any[]>(
  datum: T,
  bag: DatasetDatumFnResolverBag
): Res<T[number]>[];
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
      // console.error(
      //   'Failed to resolve function %s(%o) with error %s',
      //   datum.name,
      //   bag,
      //   error.message
      // );
      return null;
    }
  }

  return datum;
}

export function toAoIid(drawId: string) {
  return drawId.slice(-6);
}

/**
 * Converts a MultiPolygon to a Feature Collection of polygons.
 *
 * @param feature MultiPolygon feature
 *
 * @see combineFeatureCollection() for opposite
 *
 * @returns Feature Collection of Polygons
 */
export function multiPolygonToPolygons(feature: Feature<MultiPolygon>) {
  const polygons = feature.geometry.coordinates.map(
    (coordinates) =>
      ({
        type: 'Feature',
        properties: { ...feature.properties },
        geometry: {
          type: 'Polygon',
          coordinates: coordinates
        }
      } as Feature<Polygon>)
  );

  return polygons;
}

const dateFormats = {
  year: 'yyyy',
  month: 'LLL yyyy',
  day: 'LLL do, yyyy'
};

export function formatSingleDate(date: Date, timeDensity?: TimeDensity) {
  return format(date, dateFormats[timeDensity || 'day']);
}

export function formatCompareDate(
  dateA: Date,
  dateB: Date,
  timeDensityA?: TimeDensity,
  timeDensityB?: TimeDensity
) {
  return `${formatSingleDate(dateA, timeDensityA)} VS ${formatSingleDate(
    dateB,
    timeDensityB
  )}`;
}
