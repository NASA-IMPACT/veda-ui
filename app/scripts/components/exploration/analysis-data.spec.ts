import { formatCMRResponse, SINGLE_BAND_KEY_NAME } from './analysis-data';
import { utcString2userTzDate } from '$utils/date';

const timeseriesData = {
  min: -271.0,
  max: 2171.0,
  mean: 292.54150390625,
  count: 897880.1875,
  sum: 262667232.0,
  std: 97.4808522040278,
  median: 264.0,
  majority: 247.0,
  minority: -271.0,
  unique: 1247.0,
  histogram: [
    [3, 79041, 763470, 50502, 5721, 863, 154, 9, 0, 3],
    [
      -271.0, -26.80000000000001, 217.39999999999998, 461.5999999999999, 705.8,
      950.0, 1194.1999999999998, 1438.3999999999999, 1682.6, 1926.7999999999997,
      2171.0
    ]
  ] as [number[], number[]],
  valid_percent: 100.0,
  masked_pixels: 0.0,
  valid_pixels: 899766.0,
  percentile_2: 195.0,
  percentile_98: 609.0
};

// Mock dependency function
jest.mock('$utils/date', () => ({
  utcString2userTzDate: jest.fn()
}));

describe('formatCMRResponse', () => {
  const mockDate = new Date('2023-01-01');

  beforeEach(() => {
    jest.clearAllMocks();
    (utcString2userTzDate as jest.Mock).mockReturnValue(mockDate);
  });

  describe('rasterio flag', () => {
    it('should format multi-band response correctly', () => {
      const mockStatResponse = {
        '2023-01-01T00:00:00Z/2023-01-01T23:59:59Z': {
          Band1: { ...timeseriesData, max: 100, min: 0, mean: 50 },
          Band2: { ...timeseriesData, max: 200, min: 10, mean: 105 }
        },
        '2023-01-02T00:00:00Z/2023-01-02T23:59:59Z': {
          Band1: { ...timeseriesData, max: 120, min: 5, mean: 60 },
          Band2: { ...timeseriesData, max: 180, min: 15, mean: 95 }
        }
      };

      const result = formatCMRResponse(mockStatResponse, 'rasterio');

      expect(result).toEqual({
        Band1: [
          { ...timeseriesData, max: 100, min: 0, mean: 50, date: mockDate },
          { ...timeseriesData, max: 120, min: 5, mean: 60, date: mockDate }
        ],
        Band2: [
          { ...timeseriesData, max: 200, min: 10, mean: 105, date: mockDate },
          { ...timeseriesData, max: 180, min: 15, mean: 95, date: mockDate }
        ]
      });
    });

    it('should handle single timestamp with multiple bands', () => {
      const mockStatResponse = {
        '2023-01-01T00:00:00Z/2023-01-01T23:59:59Z': {
          Band1: { ...timeseriesData, max: 100, min: 0 },
          Band2: { ...timeseriesData, max: 200, min: 10 },
          Band3: { ...timeseriesData, max: 300, min: 20 }
        }
      };

      const result = formatCMRResponse(mockStatResponse, 'rasterio');

      expect(result).toEqual({
        Band1: [{ ...timeseriesData, max: 100, min: 0, date: mockDate }],
        Band2: [{ ...timeseriesData, max: 200, min: 10, date: mockDate }],
        Band3: [{ ...timeseriesData, max: 300, min: 20, date: mockDate }]
      });
    });

    it('should handle empty statistics object', () => {
      const mockStatResponse = {};
      const result = formatCMRResponse(mockStatResponse, 'rasterio');
      expect(result).toEqual({});
    });
  });

  describe('xarray flag', () => {
    it('should format single-band response correctly', () => {
      const mockStatResponse = {
        '2023-01-01T00:00:00Z/2023-01-01T23:59:59Z': {
          '2023-01-01T00:00:00Z': {
            ...timeseriesData,
            max: 100,
            min: 0,
            mean: 50
          }
        },
        '2023-01-02T00:00:00Z/2023-01-02T23:59:59Z': {
          '2023-01-02T00:00:00Z': {
            ...timeseriesData,
            max: 120,
            min: 5,
            mean: 60
          }
        }
      };

      const result = formatCMRResponse(mockStatResponse, 'xarray');
      expect(result).toEqual({
        [SINGLE_BAND_KEY_NAME]: [
          {
            ...timeseriesData,
            max: 100,
            min: 0,
            mean: 50,
            date: mockDate
          },
          {
            ...timeseriesData,
            max: 120,
            min: 5,
            mean: 60,
            date: mockDate
          }
        ]
      });
    });

    it('should handle empty statistics object', () => {
      const mockStatResponse = {};
      const result = formatCMRResponse(mockStatResponse, 'xarray');
      expect(result).toEqual({});
    });
  });

  describe('error handling', () => {
    it('should throw ExtendedError for invalid flag', () => {
      const mockStatResponse = {
        '2023-01-01T00:00:00Z/2023-01-01T23:59:59Z': {
          Band1: { ...timeseriesData, max: 100, min: 0 }
        }
      };

      expect(() => {
        formatCMRResponse(mockStatResponse, 'invalid_flag');
      }).toThrow();
    });
  });
});
