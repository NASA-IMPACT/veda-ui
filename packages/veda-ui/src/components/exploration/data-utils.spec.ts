import {
  getTimeDensityFromInterval,
  getBiggestDurationDesignator,
  formatRenderExtensionData,
  generateDates,
  resolveRenderParams,
  SourceParametersWithLayerId
} from './data-utils';
import { RENDER_KEY } from '$components/exploration/constants';
import { TimeDensity } from '$components/exploration/types.d.ts';

const LAYER_KEY = 'layer-1';
const renderExtensionData = {
  dashboard: {
    colormap_name: 'viridis'
  }
};

const renderExtensionDataWithLayerSpecificNameSpace = {
  [LAYER_KEY]: {
    colormap_name: 'colormap'
  },
  dashboard: {
    colormap_name: 'viridis'
  }
};

const renderExtensionDataWithColormap = {
  dashboard: {
    rescale: [[0, 0.0001]],
    colormap: {
      '0': [22, 158, 242, 255]
    }
  }
};

const userDefinedSourceParameters: SourceParametersWithLayerId = {
  layerId: 'layer-1',
  resampling: 'bilinear',
  bidx: 1,
  colormap_name: 'viridis',
  rescale: [0, 0.0001]
};

const userDefinedSourceParametersWithAsset = {
  layerId: 'layer-2',
  assets: 'soil_texture_5cm_250m',
  colormap_name: 'soil_texture',
  nodata: 255
};

describe('Resolve Render Params', () => {
  it('1. give precedence to layer specific render parameter data', () => {
    const sourceParameter = resolveRenderParams(
      userDefinedSourceParameters,
      renderExtensionDataWithLayerSpecificNameSpace
    );
    expect(sourceParameter).toMatchObject(
      renderExtensionDataWithLayerSpecificNameSpace[LAYER_KEY]
    );
  });

  it('2. returns user defined source parameters when source parameters have assets defined', () => {
    const sourceParameter = resolveRenderParams(
      userDefinedSourceParametersWithAsset,
      renderExtensionDataWithLayerSpecificNameSpace
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { layerId, ...rest } = userDefinedSourceParametersWithAsset;
    expect(sourceParameter).toMatchObject(rest);
  });

  it('3. returns render extension data when neither 1 nor 2, but render extension data has dashboard name space', () => {
    const sourceParameter = resolveRenderParams(
      userDefinedSourceParameters,
      renderExtensionData
    );

    expect(sourceParameter).toMatchObject(renderExtensionData[RENDER_KEY]);
  });

  it('4. falls back to user defined source parameters', () => {
    const sourceParameter = resolveRenderParams(
      userDefinedSourceParameters,
      undefined
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { layerId, ...rest } = userDefinedSourceParameters;
    expect(sourceParameter).toMatchObject(rest);
  });

  it('formats render parameter data correctly', () => {
    const renderData = renderExtensionDataWithColormap['dashboard'];
    const sourceParameter = formatRenderExtensionData(renderData);
    expect(sourceParameter).toMatchObject({
      ...renderData,
      rescale: renderData.rescale.flat(),
      colormap: JSON.stringify(renderData.colormap)
    });
  });
});

describe('generateDates', () => {
  it('should generate daily dates correctly', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-05');
    const interval = 'P1D'; // 1 day interval

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(5);
    expect(result[0]).toEqual(new Date('2023-01-01'));
    expect(result[1]).toEqual(new Date('2023-01-02'));
    expect(result[2]).toEqual(new Date('2023-01-03'));
    expect(result[3]).toEqual(new Date('2023-01-04'));
    expect(result[4]).toEqual(new Date('2023-01-05'));
  });

  it('should generate weekly dates correctly', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-02-01');
    const interval = 'P1W'; // 1 week interval

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(5);
    expect(result[0]).toEqual(new Date('2023-01-01'));
    expect(result[1]).toEqual(new Date('2023-01-08'));
    expect(result[2]).toEqual(new Date('2023-01-15'));
    expect(result[3]).toEqual(new Date('2023-01-22'));
    expect(result[4]).toEqual(new Date('2023-01-29'));
  });

  it('should generate monthly dates correctly', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-06-01');
    const interval = 'P1M'; // 1 month interval

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(6);
    expect(result[0]).toEqual(new Date('2023-01-01'));
    expect(result[1]).toEqual(new Date('2023-02-01'));
    expect(result[2]).toEqual(new Date('2023-03-01'));
    expect(result[3]).toEqual(new Date('2023-04-01'));
    expect(result[4]).toEqual(new Date('2023-05-01'));
    expect(result[5]).toEqual(new Date('2023-06-01'));
  });

  it('should generate yearly dates correctly', () => {
    const start = new Date('2020-01-01');
    const end = new Date('2025-01-01');
    const interval = 'P1Y'; // 1 year interval

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(6);
    expect(result[0]).toEqual(new Date('2020-01-01'));
    expect(result[1]).toEqual(new Date('2021-01-01'));
    expect(result[2]).toEqual(new Date('2022-01-01'));
    expect(result[3]).toEqual(new Date('2023-01-01'));
    expect(result[4]).toEqual(new Date('2024-01-01'));
    expect(result[5]).toEqual(new Date('2025-01-01'));
  });

  it('should handle hourly intervals correctly', () => {
    const start = new Date('2023-01-01T12:00:00');
    const end = new Date('2023-01-01T16:00:00');
    const interval = 'PT1H'; // 1 hour interval

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(5);
    expect(result[0]).toEqual(new Date('2023-01-01T12:00:00'));
    expect(result[1]).toEqual(new Date('2023-01-01T13:00:00'));
    expect(result[2]).toEqual(new Date('2023-01-01T14:00:00'));
    expect(result[3]).toEqual(new Date('2023-01-01T15:00:00'));
    expect(result[4]).toEqual(new Date('2023-01-01T16:00:00'));
  });

  it('should handle minute intervals correctly', () => {
    const start = new Date('2023-01-01T12:00:00');
    const end = new Date('2023-01-01T12:10:00');
    const interval = 'PT2M'; // 2 minute interval

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(6);
    expect(result[0]).toEqual(new Date('2023-01-01T12:00:00'));
    expect(result[1]).toEqual(new Date('2023-01-01T12:02:00'));
    expect(result[2]).toEqual(new Date('2023-01-01T12:04:00'));
    expect(result[3]).toEqual(new Date('2023-01-01T12:06:00'));
    expect(result[4]).toEqual(new Date('2023-01-01T12:08:00'));
    expect(result[5]).toEqual(new Date('2023-01-01T12:10:00'));
  });

  it('should handle second intervals correctly', () => {
    const start = new Date('2023-01-01T12:00:00');
    const end = new Date('2023-01-01T12:00:10');
    const interval = 'PT2S'; // 2 second interval

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(6);
    expect(result[0]).toEqual(new Date('2023-01-01T12:00:00'));
    expect(result[1]).toEqual(new Date('2023-01-01T12:00:02'));
    expect(result[2]).toEqual(new Date('2023-01-01T12:00:04'));
    expect(result[3]).toEqual(new Date('2023-01-01T12:00:06'));
    expect(result[4]).toEqual(new Date('2023-01-01T12:00:08'));
    expect(result[5]).toEqual(new Date('2023-01-01T12:00:10'));
  });

  it('should handle combined date intervals correctly', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-03-07');
    const interval = 'P1M3D'; // 1 month and 3 days

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(3);
    expect(result[0]).toEqual(new Date('2023-01-01'));
    expect(result[1]).toEqual(new Date('2023-02-04'));
    expect(result[2]).toEqual(new Date('2023-03-07'));
  });

  it('should handle combined date and time intervals correctly', () => {
    const start = new Date('2023-01-01T12:00:00');
    const end = new Date('2023-01-01T18:30:00');
    const interval = 'PT2H15M'; // 2 hours and 15 minutes

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(3);
    expect(result[0]).toEqual(new Date('2023-01-01T12:00:00'));
    expect(result[1]).toEqual(new Date('2023-01-01T14:15:00'));
    expect(result[2]).toEqual(new Date('2023-01-01T16:30:00'));
  });

  it('should handle full ISO duration format correctly', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2025-03-25');
    const interval = 'P1Y2M10DT6H30M15S'; // 1 year, 2 months, 10 days, 6 hours, 30 minutes, 15 seconds

    const result = generateDates(start, end, interval);

    // Check first and last values
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toEqual(new Date('2023-01-01'));
    expect(result[result.length - 1].getTime()).toBeLessThanOrEqual(
      new Date('2025-03-25').getTime()
    );
  });

  it('should handle zero duration parts correctly', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-05');
    const interval = 'P0Y0M1D'; // Only 1 day, explicitly zeros for years and months

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(5);
    expect(result[0]).toEqual(new Date('2023-01-01'));
    expect(result[1]).toEqual(new Date('2023-01-02'));
    expect(result[2]).toEqual(new Date('2023-01-03'));
    expect(result[3]).toEqual(new Date('2023-01-04'));
    expect(result[4]).toEqual(new Date('2023-01-05'));
  });

  it('should return only start date when start equals end', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-01');
    const interval = 'P1D';

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(start);
  });

  it('should handle complex intervals correctly', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-03-01');
    const interval = 'P14D'; // 14 days

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(5);
    expect(result[0]).toEqual(new Date('2023-01-01'));
    expect(result[1]).toEqual(new Date('2023-01-15'));
    expect(result[2]).toEqual(new Date('2023-01-29'));
    expect(result[3]).toEqual(new Date('2023-02-12'));
    expect(result[4]).toEqual(new Date('2023-02-26'));
  });

  it('should throw error for invalid ISO duration format', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-05');
    const invalidInterval = 'Invalid';

    expect(() => {
      generateDates(start, end, invalidInterval);
    }).toThrow('Invalid ISO duration');
  });

  it('should handle edge case with February and leap years', () => {
    const start = new Date('2024-01-31'); // 2024 is a leap year
    const end = new Date('2024-04-30');
    const interval = 'P1M'; // 1 month

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(4);
    expect(result[0]).toEqual(new Date('2024-01-31'));
    expect(result[1]).toEqual(new Date('2024-02-29')); // February 29 in a leap year
    expect(result[2]).toEqual(new Date('2024-03-29'));
    expect(result[3]).toEqual(new Date('2024-04-29'));
  });

  it('should handle different timezone dates correctly', () => {
    // Create dates with specific timezone offset
    const start = new Date('2023-01-01T00:00:00Z'); // UTC
    const end = new Date('2023-01-05T00:00:00Z'); // UTC
    const interval = 'P1D';

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(5);
    expect(result[0].toISOString()).toBe(start.toISOString());
    expect(result[4].toISOString()).toBe(end.toISOString());
  });

  it('should stop generating dates once passing the end date', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-04');
    const interval = 'P2D'; // 2 days

    const result = generateDates(start, end, interval);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(new Date('2023-01-01'));
    expect(result[1]).toEqual(new Date('2023-01-03'));
    // It shouldn't include 2023-01-05 because it's beyond the end date
  });
});

describe('getBiggestDurationDesignator', () => {
  it('returns Y for year-based duration', () => {
    expect(getBiggestDurationDesignator('P1Y')).toBe('Y');
  });

  it('returns M for month-based duration', () => {
    expect(getBiggestDurationDesignator('P2M')).toBe('M');
  });

  it('returns W for week-based duration', () => {
    expect(getBiggestDurationDesignator('P3W')).toBe('W');
  });

  it('returns D for day-based duration', () => {
    expect(getBiggestDurationDesignator('P10D')).toBe('D');
  });

  it('returns TH for hour-based duration with T', () => {
    expect(getBiggestDurationDesignator('PT5H')).toBe('TH');
  });

  it('returns TM for minute-based duration with T', () => {
    expect(getBiggestDurationDesignator('PT30M')).toBe('TM');
  });

  it('returns TS for second-based duration with T', () => {
    expect(getBiggestDurationDesignator('PT45S')).toBe('TS');
  });

  it('returns Y from mixed duration', () => {
    expect(getBiggestDurationDesignator('P1Y2M10DT5H30M')).toBe('Y');
  });

  it('returns TH from time-only duration', () => {
    expect(getBiggestDurationDesignator('PT5H30M')).toBe('TH');
  });

  it('throws error on invalid input (no P)', () => {
    expect(() => getBiggestDurationDesignator('T5H')).toThrow(
      'Invalid ISO duration'
    );
  });

  it('throws error if no valid designators found', () => {
    expect(() => getBiggestDurationDesignator('P')).toThrow(
      'No valid designators found'
    );
  });
});

describe('getTimeDensityFromInterval', () => {
  it('returns YEAR for "P1Y"', () => {
    expect(getTimeDensityFromInterval('P1Y')).toBe(TimeDensity.YEAR);
  });

  it('returns MONTH for "P1M"', () => {
    expect(getTimeDensityFromInterval('P1M')).toBe(TimeDensity.MONTH);
  });

  it('returns DAY for "P1W"', () => {
    expect(getTimeDensityFromInterval('P1W')).toBe(TimeDensity.DAY);
  });

  it('returns DAY when the biggest interval is smaller than a day ("PT5H30M")', () => {
    expect(getTimeDensityFromInterval('PT5H30M')).toBe(TimeDensity.DAY);
  });

  it('returns DAY for null interval', () => {
    expect(getTimeDensityFromInterval(null)).toBe(TimeDensity.DAY);
  });

  it('returns correct density from mixed duration', () => {
    expect(getTimeDensityFromInterval('P1Y2M10DT5H')).toBe(TimeDensity.YEAR);
    expect(getTimeDensityFromInterval('P2M10DT5H')).toBe(TimeDensity.MONTH);
    expect(getTimeDensityFromInterval('P10DT5H')).toBe(TimeDensity.DAY);
  });
});
