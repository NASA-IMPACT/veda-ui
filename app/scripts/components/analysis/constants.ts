import { FeatureCollection, Polygon } from 'geojson';
import { makeFeatureCollection } from '$components/common/aoi/utils';

export type RegionPreset = 'world';

export const FeatureByRegionPreset: Record<
  RegionPreset,
  FeatureCollection<Polygon>
> = {
  world: makeFeatureCollection([
    {
      type: 'Feature',
      id: 'world',
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
  ])
};

export const MAX_QUERY_NUM = 300;