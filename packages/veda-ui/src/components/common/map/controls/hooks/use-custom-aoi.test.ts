import { Feature, MultiPolygon, Polygon } from '@turf/helpers';
import {
  getNumPoints,
  validateGeometryType,
  extractPolygonsFromGeojson,
  validateFeatureCount,
  removePolygonHoles,
  simplifyFeatures,
  getAoiAppropriateFeatures,
  PolygonGeojson,
  eachFeatureMaxPointNum,
  maxPolygonNum,
  INVALID_GEOMETRY_ERROR,
  TOO_MANY_POLYGONS_ERROR
} from './use-custom-aoi';

// Mock data
const mockPolygon: Feature<Polygon> = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [1, 1],
        [2, 2],
        [0, 0]
      ]
    ]
  },
  properties: {}
};

const mockMultiPolygon: Feature<MultiPolygon> = {
  type: 'Feature',
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [0, 0],
          [1, 1],
          [2, 2],
          [0, 0]
        ]
      ]
    ]
  },
  properties: {}
};

const mockGeojson = {
  type: 'FeatureCollection',
  features: [mockPolygon, mockMultiPolygon]
} as PolygonGeojson;

describe('getNumPoints', () => {
  it('should return the number of points in a polygon', () => {
    const numPoints = getNumPoints(mockPolygon);
    expect(numPoints).toBe(4);
  });
});

describe('validateGeometryType', () => {
  it('should validate that all features are polygons or multipolygons', () => {
    const isValid = validateGeometryType(mockGeojson);
    expect(isValid).toBe(true);
  });

  it('should return false for invalid geometry types', () => {
    const invalidGeojson = {
      ...mockGeojson,
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 0] },
          properties: {}
        }
      ]
    };
    // @ts-expect-error: testing invalid case
    const isValid = validateGeometryType(invalidGeojson);
    expect(isValid).toBe(false);
  });
});

describe('extractPolygonsFromGeojson', () => {
  it('should extract all polygons from GeoJSON, including from MultiPolygons', () => {
    const polygons = extractPolygonsFromGeojson(mockGeojson);
    expect(polygons).toHaveLength(2);
    expect(polygons[0].geometry.type).toBe('Polygon');
  });
});

describe('validateFeatureCount', () => {
  it('should validate that the number of features is within the allowed limit', () => {
    const isValid = validateFeatureCount([mockPolygon]);
    expect(isValid).toBe(true);
  });

  it('should return false if feature count exceeds the limit', () => {
    const tooManyFeatures = Array(maxPolygonNum + 1).fill(mockPolygon);
    const isValid = validateFeatureCount(tooManyFeatures);
    expect(isValid).toBe(false);
  });
});

describe('removePolygonHoles', () => {
  it('should remove holes from polygons and return warnings if holes are removed', () => {
    const polygonWithHole = {
      ...mockPolygon,
      geometry: {
        ...mockPolygon.geometry,
        coordinates: [
          [
            [0, 0],
            [1, 1],
            [2, 2],
            [0, 0]
          ],
          [
            [0.1, 0.1],
            [0.2, 0.2],
            [0.3, 0.3],
            [0.1, 0.1]
          ]
        ]
      }
    };
    const { simplifiedFeatures, warnings } = removePolygonHoles([
      polygonWithHole
    ]);
    expect(simplifiedFeatures[0].geometry.coordinates).toHaveLength(1);
    expect(warnings).toContain(
      'Polygons with rings are not supported and were simplified to remove them'
    );
  });
});

describe('simplifyFeatures', () => {
  it('should simplify features to reduce the number of points if necessary', () => {
    const largePolygon = {
      ...mockPolygon,
      geometry: {
        ...mockPolygon.geometry,
        coordinates: [
          Array.from({ length: 600 }, (_, i) => [
            Math.cos(i * ((2 * Math.PI) / 600)),
            Math.sin(i * ((2 * Math.PI) / 600))
          ]).concat([[1, 0]]) // Ensure the ring is closed
        ]
      }
    };
    const { simplifiedFeatures, warnings } = simplifyFeatures([largePolygon]);
    expect(getNumPoints(simplifiedFeatures[0])).toBeLessThanOrEqual(
      eachFeatureMaxPointNum
    );
    expect(warnings).toContainEqual(expect.stringContaining('simplified'));
  });
});

describe('getAoiAppropriateFeatures', () => {
  it('should process GeoJSON and return simplified features with warnings', () => {
    const result = getAoiAppropriateFeatures(mockGeojson);
    expect(result.simplifiedFeatures).toHaveLength(2);
    expect(result.warnings).toEqual(expect.any(Array));
  });

  it('should throw an error if geometry type validation fails', () => {
    const invalidGeojson = {
      ...mockGeojson,
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 0] },
          properties: {}
        }
      ]
    };
    // @ts-expect-error: testing invalid case
    expect(() => getAoiAppropriateFeatures(invalidGeojson)).toThrow(
      INVALID_GEOMETRY_ERROR
    );
  });

  it('should throw an error if feature count exceeds the allowed limit', () => {
    const tooManyFeatures = {
      ...mockGeojson,
      features: Array(maxPolygonNum + 1).fill(mockPolygon)
    };
    expect(() => getAoiAppropriateFeatures(tooManyFeatures)).toThrow(
      TOO_MANY_POLYGONS_ERROR
    );
  });
});
