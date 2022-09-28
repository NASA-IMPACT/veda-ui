import { FeatureCollection, Polygon } from 'geojson';
import gjv from 'geojson-validation';

/**
 * Decodes a polygon string converting it into multiple features in a
 * collection.
 * 
 * lon,lat|lon,lat||lon,lat|lon,lat
 * || separates polygons
 * | separates points
 * 
 */
export function polygonUrlDecode(polygonStr: string) {
  const geojson = {
    type: 'FeatureCollection',
    features: polygonStr.split('||').map((polygon) => {
      const coords = polygon
        .split('|')
        .map((coord) => coord.split(',').map(Number));

      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          // Add start to close the polygon.
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
 * Converts a feature collection of multiple polygons to a url string
 * 
 * lon,lat|lon,lat||lon,lat|lon,lat
 * || separates polygons
 * | separates points
 * 
 */
export function polygonUrlEncode(
  fc: FeatureCollection<Polygon>,
  precision = Infinity
) {
  return fc.features
    .map((f) =>
    f.geometry.coordinates[0]
        // Remove last coordinate since it is repeated.
        .slice(0, -1)
        .map((point) => {
          let p = point;
          if (precision !== Infinity) {
            const m = Math.pow(10, precision);
            p = point.map((v) => Math.floor(v * m) / m);
          }

          return p.join(',');
        })
        .join('|')
    )
    .join('||');
}
