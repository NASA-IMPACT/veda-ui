import { endOfDay, startOfDay } from 'date-fns';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { userTzDate2utcString } from '$utils/date';
import { format } from 'date-fns';

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
  aoi: FeatureCollection<Polygon>,
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
      // Stac search spatial intersect needs to be done on a single feature.
      // Using a Multipolygon
      {
        op: 's_intersects',
        args: [{ property: 'geometry' }, combineFeatureCollection(aoi).geometry]
      },
      {
        op: 'in',
        args: [{ property: 'collection' }, collections]
      }
    ]
  };
  return filterPayload;
}

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

export function combineFeatureCollection(
  featureCollection: FeatureCollection<Polygon>
): Feature<MultiPolygon> {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        featureCollection.features.map((f) => f.geometry.coordinates[0])
      ]
    }
  };
}

export function getDateRangeFormatted(startDate, endDate) {
  const dFormat = 'yyyy-MM-dd';
  const startDateFormatted = format(startDate, dFormat);
  const endDateFormatted = format(endDate, dFormat);
  return [startDateFormatted, endDateFormatted].join('-')
}