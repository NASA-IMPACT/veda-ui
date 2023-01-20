import bbox from '@turf/bbox';
import featArea from '@turf/area';
import { Feature, FeatureCollection, Polygon } from 'geojson';

import { AoiBounds, AoiBoundsUnset, AoiFeature } from './types';
import { formatThousands } from '$utils/format';

export const boundsFromFeature = (
  feat: AoiFeature | null
): AoiBounds | AoiBoundsUnset => {
  if (!feat) {
    return { ne: [], sw: [] };
  }

  const b = bbox(feat);
  return {
    ne: [b[2], b[3]],
    sw: [b[0], b[1]]
  };
};

/**
 * Returns a feature with a polygon geometry made of the provided bounds.
 * If a feature is provided, the properties are maintained.
 *
 * @param {object} feature Feature to update
 * @param {object} bounds Bounds in NE/SW format
 */
export const featureFromBounds = (
  feature: AoiFeature | null,
  bounds: AoiBounds
): AoiFeature => {
  const {
    ne: [neLng, neLat],
    sw: [swLng, swLat]
  } = bounds;

  const geometry: Polygon = {
    type: 'Polygon',
    coordinates: [
      [
        [swLng, neLat],
        [neLng, neLat],
        [neLng, swLat],
        [swLng, swLat],
        [swLng, neLat]
      ]
    ]
  };

  return feature
    ? {
        ...feature,
        geometry
      }
    : {
        type: 'Feature',
        id: 'aoi-feature',
        properties: {},
        geometry
      };
};

export const calcFeatCollArea = (fc: FeatureCollection | null) => {
  if (!fc?.features.length) return '0';

  // Convert from m2 to km2.
  const km2 = featArea(fc) / 1e6;
  return formatThousands(km2, { decimals: 0, shorten: true });
};

export const areBoundsValid = (bounds: AoiBounds | AoiBoundsUnset) => {
  // Check if bounds are valid.
  return (
    bounds.ne[0] !== undefined &&
    bounds.ne[1] !== undefined &&
    bounds.sw[0] !== undefined &&
    bounds.sw[1] !== undefined
  );
};

export const featureCollection = (
  features = [] as Feature<Polygon>[]
): FeatureCollection<Polygon> => ({
  type: 'FeatureCollection',
  features
});
