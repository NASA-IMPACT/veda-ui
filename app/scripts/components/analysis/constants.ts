import { FeatureCollection, Polygon } from 'geojson';
import { featureCollection } from '@turf/helpers';

export type RegionPreset = 'world' | 'north-america';

export const FeatureByRegionPreset: Record<
  RegionPreset,
  FeatureCollection<Polygon>
> = {
  world: featureCollection([
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
  ]),
  'north-america': featureCollection([
    {
      type: 'Feature',
      id: 'north-america',
      properties: {},
      geometry: {
        coordinates: [
          [
            [-180, 0],
            [-180, 89],
            [-60, 89],
            [-60, 0],
            [-180, 0]
          ]
        ],
        type: 'Polygon'
      }
    }
  ])
};

export const MAX_QUERY_NUM = 300;