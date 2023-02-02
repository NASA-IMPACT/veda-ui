import { FeatureCollection, Polygon } from 'geojson';
import gjv from 'geojson-validation';
import { decode, encode } from 'google-polyline';

/**
 * Decodes a multi polygon string converting it into a FeatureCollection of
 * Polygons.
 *
 * Format: polyline-encoding||polyline-encoding
 *
 * || separates polygons
 *
 */
export function polygonUrlDecode(polygonStr: string) {
  const geojson = {
    type: 'FeatureCollection',
    features: polygonStr.split('||').map((polygon) => {
      const coords = decode(polygon);
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[...coords, coords[0]]]
        }
      };
    })
  } as FeatureCollection<Polygon>;

  return {
    geojson,
    errors: gjv.valid(geojson, true) as string[]
  };
}

/**
 * Converts a FeatureCollection of Polygons into a url string.
 * Removes the last point of the polygon as it is the same as the first.
 *
 * Format: polyline-encoding||polyline-encoding
 *
 * || separates polygons
 *
 */
export function polygonUrlEncode(
  featureCollection: FeatureCollection<Polygon>
) {
  return featureCollection.features
    .map((feature) => {
      const points = feature.geometry.coordinates[0]
        // Remove last coordinate since it is repeated.
        .slice(0, -1);
      return encode(points);
    })
    .join('||');
}
