import { FeatureCollection, Polygon } from 'geojson';
import gjv from 'geojson-validation';
import { decode, encode } from 'google-polyline';

/**
 * Decodes a multi polygon string converting it into a FeatureCollection of
 * Polygons.
 *
 * lon,lat|lon,lat||lon,lat|lon,lat || separates polygons | separates points
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
 *
 * lon,lat|lon,lat||lon,lat|lon,lat
 * || separates polygons
 * | separates points
 *
 */
export function polygonUrlEncode(fc: FeatureCollection<Polygon>) {
  return fc.features
    .map((feature) => {
      const points = feature.geometry.coordinates[0]
        // Remove last coordinate since it is repeated.
        .slice(0, -1);
      return encode(points);
    })
    .join('||');
}
