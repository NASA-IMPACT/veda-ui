import { Feature, MultiPolygon, Polygon } from 'geojson';
import { fixAntimeridian } from './antimeridian';

describe('Antimeridian', () => {
  it('Should move a feature in the first map east (180/540) to the -180/180 range', () => {
    const feature: Feature<Polygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [190, 20],
            [190, -20],
            [200, -20],
            [200, 20],
            [190, 20]
          ]
        ],
        type: 'Polygon'
      }
    };

    const expected: Feature<MultiPolygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [
              [-170, -20],
              [-160, -20],
              [-160, 20],
              [-170, 20],
              [-170, -20]
            ]
          ]
        ],
        type: 'MultiPolygon'
      }
    };

    const result = fixAntimeridian(feature);
    expect(result).toEqual(expected);
  });

  it('Should split a feature crossing the 540 antimeridian into 2 that fall within the -180/180 range', () => {
    const feature: Feature<Polygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [500, 20],
            [500, -20],
            [580, -20],
            [580, 20],
            [500, 20]
          ]
        ],
        type: 'Polygon'
      }
    };

    const expected: Feature<MultiPolygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [
              [-180, -20],
              [-140, -20],
              [-140, 20],
              [-180, 20],
              [-180, -20]
            ]
          ],
          [
            [
              [140, -20],
              [180, -20],
              [180, 20],
              [140, 20],
              [140, -20]
            ]
          ]
        ],
        type: 'MultiPolygon'
      }
    };

    const result = fixAntimeridian(feature);
    expect(result).toEqual(expected);
  });

  it('Should calculate the resulting feature in the -180/180 range when the input spans several maps', () => {
    const feature: Feature<Polygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [-360, 10],
            [500, 10],
            [500, -10],
            [-360, -10],
            [-360, 10]
          ]
        ],
        type: 'Polygon'
      }
    };

    const expected: Feature<MultiPolygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [
              [-180, -10],
              [180, -10],
              [180, 10],
              [-180, 10],
              [-180, -10]
            ]
          ]
        ],
        type: 'MultiPolygon'
      }
    };

    const result = fixAntimeridian(feature);
    expect(result).toEqual(expected);
  });

  it('Should be able to process multipolygons, correctly resolving each polygon to the -180/180 range', () => {
    const feature: Feature<MultiPolygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [
              [170, 30],
              [190, 30],
              [190, 20],
              [170, 20],
              [170, 30]
            ]
          ],
          [
            [
              [-530, 10],
              [-530, 0],
              [-550, 0],
              [-550, 10],
              [-530, 10]
            ]
          ],
          [
            [
              [530, -10],
              [530, -20],
              [550, -20],
              [550, -10],
              [530, -10]
            ]
          ]
        ],

        type: 'MultiPolygon'
      }
    };

    const expected: Feature<MultiPolygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [
              [-180, -20],
              [-170, -20],
              [-170, -10],
              [-180, -10],
              [-180, -20]
            ]
          ],
          [
            [
              [-180, 0],
              [-170, 0],
              [-170, 10],
              [-180, 10],
              [-180, 0]
            ]
          ],
          [
            [
              [-180, 20],
              [-170, 20],
              [-170, 30],
              [-180, 30],
              [-180, 20]
            ]
          ],
          [
            [
              [170, -20],
              [180, -20],
              [180, -10],
              [170, -10],
              [170, -20]
            ]
          ],
          [
            [
              [170, 0],
              [180, 0],
              [180, 10],
              [170, 10],
              [170, 0]
            ]
          ],
          [
            [
              [170, 20],
              [180, 20],
              [180, 30],
              [170, 30],
              [170, 20]
            ]
          ]
        ],
        type: 'MultiPolygon'
      }
    };

    const result = fixAntimeridian(feature);
    expect(result).toEqual(expected);
  });
});
