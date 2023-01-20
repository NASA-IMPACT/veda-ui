import { endOfDay, startOfDay } from 'date-fns';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { userTzDate2utcString } from '$utils/date';

/**
 * Creates the appropriate filter object to send to STAC.
 *
 * @param {Date} start Start date to request
 * @param {Date} end End date to request
 * @param {string} collection STAC collection to request
 * @returns Object
 */
export function getFilterPayload(
  start: Date,
  end: Date,
  aoiFeature: Feature<Polygon | MultiPolygon>,
  collections: string[]
) {
  const filterPayload = {
    op: 'and',
    args: [
      {
        op: 't_intersects',
        args: [
          { property: 'datetime' },
          {
            interval: [
              userTzDate2utcString(startOfDay(start)),
              userTzDate2utcString(endOfDay(end))
            ]
          }
        ]
      },
      {
        op: 's_intersects',
        args: [{ property: 'geometry' }, aoiFeature.geometry]
      },
      {
        op: 'in',
        args: [{ property: 'collection' }, collections]
      }
    ]
  };
  return filterPayload;
}

export function multiPolygonToPolygon(
  feature: Feature<MultiPolygon | Polygon>
): Feature<Polygon> {
  const coordinates = feature.geometry.type === 'MultiPolygon' ? feature.geometry.coordinates[0] : [feature.geometry.coordinates[0]];
  return {
    type: 'Feature',
    properties: { ...feature.properties },
    geometry: {
      type: 'Polygon',
      coordinates
    }
  };
}
