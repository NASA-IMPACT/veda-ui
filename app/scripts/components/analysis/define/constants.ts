import { Feature, Polygon } from 'geojson';

export type RegionPreset = 'world';

export const FeatureByRegionPreset: Record<RegionPreset, Feature<Polygon>> = {
  world: {
    type: 'Feature',
    properties: {},
    geometry: {
      coordinates: [
        [
          [-180, -89],
          [180, -89],
          [180, 89],
          [-180, 89],
          [-180, -89]
        ]
      ],
      type: 'Polygon'
    }
  }
};
