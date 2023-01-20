import { FeatureCollection, Polygon } from 'geojson';
import { featureCollection } from '$components/common/aoi/utils';

export type RegionPreset = 'world';

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
  ])
};
