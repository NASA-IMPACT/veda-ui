import { Feature, MultiPolygon } from 'geojson';
import gjv from 'geojson-validation';

/**
 * Decodes a multi polygon string converting it into a MultiPolygon feature.
 *
 * lon,lat|lon,lat||lon,lat|lon,lat
 * || separates polygons
 * | separates points
 *
 */
export function polygonUrlDecode(polygonStr: string) {
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: polygonStr.split('||').map((polygon) => {
        const coords = polygon
          .split('|')
          .map((coord) => coord.split(',').map(Number));

        return [[...coords, coords[0]]];
      })
    }
  } as Feature<MultiPolygon>;

  return {
    geojson,
    errors: gjv.valid(geojson, true) as string[]
  };
}

/**
 * Converts a MultiPolygon feature into a url string.
 *
 * lon,lat|lon,lat||lon,lat|lon,lat
 * || separates polygons
 * | separates points
 *
 */
export function polygonUrlEncode(f: Feature<MultiPolygon>, precision = Infinity) {
  return f.geometry.coordinates
    .map((polygon) =>
      polygon[0]
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

// 👇 Same functions but to work with a FeatureCollection of Polygons.
// The api is currently not offering support for FCs, but it may come soon.

// export function polygonUrlDecode(polygonStr: string) {
//   const geojson = {
//     type: 'FeatureCollection',
//     features: polygonStr.split('||').map((polygon) => {
//       const coords = polygon
//         .split('|')
//         .map((coord) => coord.split(',').map(Number));

//       return {
//         type: 'Feature',
//         properties: {},
//         geometry: {
//           type: 'Polygon',
//           // Add start to close the polygon.
//           coordinates: [[...coords, coords[0]]]
//         }
//       };
//     })
//   } as FeatureCollection<Polygon>;

//   return {
//     geojson,
//     errors: gjv.valid(geojson, true) as string[]
//   };
// }

// export function polygonUrlEncode(
//   fc: FeatureCollection<Polygon>,
//   precision = Infinity
// ) {
//   return fc.features
//     .map((f) =>
//       f.geometry.coordinates[0]
//         // Remove last coordinate since it is repeated.
//         .slice(0, -1)
//         .map((point) => {
//           let p = point;
//           if (precision !== Infinity) {
//             const m = Math.pow(10, precision);
//             p = point.map((v) => Math.floor(v * m) / m);
//           }

//           return p.join(',');
//         })
//         .join('|')
//     )
//     .join('||');
// }
