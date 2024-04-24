import { endOfDay, startOfDay, format } from 'date-fns';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import combine from '@turf/combine';
import { userTzDate2utcString } from '$utils/date';
import { fixAntimeridian } from '$utils/antimeridian';

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
  const aoiMultiPolygon = fixAoiFcForStacSearch(aoi);

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
        args: [{ property: 'geometry' }, aoiMultiPolygon.geometry]
      },
      {
        op: 'in',
        args: [{ property: 'collection' }, collections]
      }
    ]
  };
  return filterPayload;
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

/**
 * Converts a Feature Collection of polygons into a MultiPolygon
 *
 * @param featureCollection Feature Collection of Polygons
 *
 * @see multiPolygonToPolygons() for opposite
 *
 * @returns MultiPolygon Feature
 */
export function combineFeatureCollection(
  featureCollection: FeatureCollection<Polygon>
): Feature<MultiPolygon> {
  const combined = combine(featureCollection);
  return {
    type: 'Feature',
    properties: {},
    geometry: combined.features[0].geometry as MultiPolygon
  };
}

/**
 * Fixes the AOI feature collection for a STAC search by converting all polygons
 * to a single multipolygon and ensuring that every polygon is inside the
 * -180/180 range.
 * @param aoi The AOI feature collection
 * @returns AOI as a multipolygon with every polygon inside the -180/180 range
 */
export function fixAoiFcForStacSearch(aoi: FeatureCollection<Polygon>) {
  // Stac search spatial intersect needs to be done on a single feature.
  // Using a Multipolygon
  const singleMultiPolygon = combineFeatureCollection(aoi);
  // And every polygon must be inside the -180/180 range.
  // See: https://github.com/NASA-IMPACT/veda-ui/issues/732
  const aoiMultiPolygon = fixAntimeridian(singleMultiPolygon);
  return aoiMultiPolygon;
}

export function getDateRangeFormatted(startDate, endDate) {
  const dFormat = 'yyyy-MM-dd';
  const startDateFormatted = format(startDate, dFormat);
  const endDateFormatted = format(endDate, dFormat);
  return [startDateFormatted, endDateFormatted].join('-');
}
