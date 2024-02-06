import { Feature, FeatureCollection, Polygon } from 'geojson';
import gjv from 'geojson-validation';
import { chunk } from 'lodash';
import { decode, encode } from 'google-polyline';
import { AoIFeature } from '$components/common/map/types';
import { toAoIid } from '$components/common/map/utils';

function decodeFeature(polygon: string): Feature<Polygon> {
  const coords = decode(polygon);
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[...coords, coords[0]]]
    }
  } as Feature<Polygon>;
}

/**
 * Decodes a multi polygon string converting it into a FeatureCollection of
 * Polygons.
 *
 * Format: polyline-encoding;polyline-encoding
 *
 * ; separates polygons
 *
 */
export function polygonUrlDecode(polygonStr: string) {
  const geojson = {
    type: 'FeatureCollection',
    features: polygonStr.split(';').map((polygon) => {
      return decodeFeature(polygon) as Feature<Polygon>;
    })
  } as FeatureCollection<Polygon>;

  return {
    geojson,
    errors: gjv.valid(geojson, true) as string[]
  };
}

function encodePolygon(polygon: Polygon) {
  const points = polygon.coordinates[0]
    // Remove last coordinate since it is repeated.
    .slice(0, -1);
  return encode(points);
}

/**
 * Converts a FeatureCollection of Polygons into a url string.
 * Removes the last point of the polygon as it is the same as the first.
 *
 * Format: polyline-encoding;polyline-encoding
 *
 * ; separates polygons
 *
 */
export function polygonUrlEncode(
  featureCollection: FeatureCollection<Polygon>
) {
  return featureCollection.features
    .map((feature) => {
      return encodePolygon(feature.geometry);
    })
    .join(';');
}

export function encodeAois(aois: AoIFeature[]): string {
  const encoded = aois.reduce((acc, aoi) => {
    const encodedGeom = encodePolygon(aoi.geometry);
    return [...acc, encodedGeom, toAoIid(aoi.id), !!aoi.selected];
  }, []);
  return JSON.stringify(encoded);
}

export function decodeAois(aois: string): AoIFeature[] {
  const decoded = JSON.parse(aois) as string[];
  const features: AoIFeature[] = chunk(decoded, 3).map((data) => {
    const [polygon, id, selected] = data;
    const decodedFeature = decodeFeature(polygon) as AoIFeature;
    return { ...decodedFeature, id, selected: selected as unknown as boolean };
  });
  return features!;
}
