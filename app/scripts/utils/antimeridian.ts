import difference from '@turf/difference';
import intersect from '@turf/intersect';
import { Feature, MultiPolygon, Polygon, Position } from 'geojson';

type Direction = 'west' | 'east';

const earth: Feature<Polygon> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [180, 90],
        [180, -90],
        [-180, -90],
        [-180, 90],
        [180, 90]
      ]
    ]
  }
};

/**
 * Splits the input feature into three parts:
 * - valid: which is the parts of the polygon that is inside the -180/180 range.
 * - west: which is the parts of the polygon that is west of the -180.
 * - east: which is the parts of the polygon that is east of the 180.
 * @param feature The feature to split.
 * @returns An object with the three parts.
 */
function cutPolygon(feature: Feature<Polygon | MultiPolygon>) {
  const outside = toMultiPolygon(difference(feature, earth));
  const inside = toMultiPolygon(intersect(feature, earth));

  return {
    valid: inside,
    west: getOutsidePolygons(outside, 'west'),
    east: getOutsidePolygons(outside, 'east')
  };
}

/**
 * Converts a Polygon or MultiPolygon to MultiPolygon.
 * If the input Feature is null, returns null.
 * @param feature - The input Feature to convert.
 * @returns A new Feature with a MultiPolygon geometry, or null if the input Feature is null.
 */
function toMultiPolygon(
  feature: Feature<Polygon | MultiPolygon> | null
): Feature<MultiPolygon> | null {
  if (!feature) return null;

  if (feature.geometry.type === 'MultiPolygon') {
    return feature as Feature<MultiPolygon>;
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [feature.geometry.coordinates]
    }
  } as Feature<MultiPolygon>;
}

/**
 * Returns the rings of a MultiPolygon that are before -180 if direction is
 * 'west', and after 180 if direction is 'east'.
 * @param feature - The feature to check.
 * @param direction - The direction to check for (either 'west' or 'east').
 * @returns The MultiPolygon with the correct rings, or null if there are no
 * rings left after the filtering
 */
function getOutsidePolygons(
  feature: Feature<MultiPolygon> | null,
  direction: Direction
) {
  if (!feature) return null;

  const checkRing = (ring: Position[]): boolean =>
    ring.some(([lng]) => {
      if (direction === 'west') {
        return lng < -180;
      } else {
        return lng > 180;
      }
    });

  const outsidePolygons = feature.geometry.coordinates.filter(
    (poly: Position[][]) => poly.some(checkRing)
  );

  return outsidePolygons.length
    ? ({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPolygon',
          coordinates: outsidePolygons
        }
      } as Feature<MultiPolygon>)
    : null;
}

/**
 * Shifts a ring of coordinates either east or west.
 * This shift is not automatic. The caller needs to know which direction to shift.
 * For rings east of the 180, shift the coordinates west. The ring will be
 * shifted until the smallest lng is below 180.
 * For rings west of the -180, shift the coordinates east. The ring will be
 * shifted until the largest lng is above -180.
 *
 * @param ring - The ring of coordinates to shift.
 * @param direction - The direction to shift the ring. Either 'east' or 'west'.
 * @returns A new ring of coordinates shifted
 */
function shiftRing(ring: Position[], direction: Direction): Position[] {
  if (direction === 'west') {
    // We need to shift the ring west, but we want to shift the whole ring.
    // So we need to find out by how many times we need to shift 360. This will
    // be defined by the smallest lng value. Any coordinates that are still
    // outside after the shift will be shifted again in a later run.
    const smallestLng = Math.min.apply(
      null,
      ring.map(([lng]) => lng)
    );

    // Or 1 in case the smallestLng is exactly 180.
    const shift = Math.ceil(Math.abs((smallestLng - 180) / 360)) || 1;

    return ring.map(([lng, lat]) => {
      return [lng - shift * 360, lat];
    });
  } else {
    // We need to shift the ring east, but we want to shift the whole ring.
    // So we need to find out by how many times we need to shift 360. This will
    // be defined by the smallest lng value. Any coordinates that are still
    // outside after the shift will be shifted again in a later run.
    const largestLng = Math.max.apply(
      null,
      ring.map(([lng]) => lng)
    );

    // Or 1 in case the largestLng is exactly -180.
    const shift = Math.ceil(Math.abs((largestLng + 180) / 360)) || 1;

    return ring.map(([lng, lat]) => {
      return [lng + shift * 360, lat];
    });
  }
}

/**
 * Cuts a given Polygon or MultiPolygon by the antimeridian. Whenever some
 * feature crosses the Antimeridian (180° E or 180° W), it should be broken up
 * into two or more objects, none of which cross the antimeridian, and which
 * together are all equivalent. 
 * @param feature Input feature to fix
 * @returns A MultiPolygon feature with no Polygons crossing the antimeridian,
 * but that together are equivalent to the input feature.
 */
export function fixAntimeridian(
  feature: Feature<Polygon | MultiPolygon>
): Feature<MultiPolygon> {
  const { east, valid, west } = cutPolygon(feature);

  if (!east && !west) {
    if (!valid) throw new Error('There are no features left');
    return valid;
  }

  const shiftedEast: Feature<MultiPolygon> | null = east
    ? {
        ...east,
        geometry: {
          ...east.geometry,
          coordinates: east.geometry.coordinates.map((poly) =>
            poly.map((ring) => shiftRing(ring, 'west'))
          )
        }
      }
    : null;

  const shiftedWest: Feature<MultiPolygon> | null = west
    ? {
        ...west,
        geometry: {
          ...west.geometry,
          coordinates: west.geometry.coordinates.map((poly) =>
            poly.map((ring) => shiftRing(ring, 'east'))
          )
        }
      }
    : null;

  const merged: Feature<MultiPolygon> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        ...(shiftedEast ? shiftedEast.geometry.coordinates : []),
        ...(shiftedWest ? shiftedWest.geometry.coordinates : []),
        ...(valid ? valid.geometry.coordinates : [])
      ]
    }
  };

  // Recurse to handle the case where the antimeridian is crossed multiple times.
  return fixAntimeridian(merged);
}
