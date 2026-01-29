import axios from 'axios';
import { normalizeDomain } from './use-stac-metadata-datasets';

jest.mock('$components/exploration/data-utils', () => ({
  resolveLayerTemporalExtent: jest.fn(() => [
    '2020-01-01T00:00:00Z',
    '2020-01-02T00:00:00Z'
  ]),
  resolveRenderParams: jest.fn(),
  isRenderParamsApplicable: jest.fn(() => false),
  getTimeDensityFromInterval: jest.fn(() => 'day')
}));

jest.mock('axios');

const mockedGet = axios.get as jest.Mock;

describe('normalizeDomain', () => {
  it('replaces null end with now', () => {
    const result = normalizeDomain(['2020-01-01T00:00:00Z', null]);
    expect(result[0]).toBe('2020-01-01T00:00:00Z');
    expect(result[1]).not.toBeNull();
    expect(new Date(result[1] as string).getTime()).toBeLessThanOrEqual(
      Date.now()
    );
  });

  it('returns [] if domain is undefined', () => {
    expect(normalizeDomain(undefined)).toEqual([]);
  });

  it('preserves null start', () => {
    const result = normalizeDomain([null, '2025-06-27T00:00:00Z']);
    expect(result[0]).toBeNull();
    expect(result[1]).toBe('2025-06-27T00:00:00Z');
  });
});

describe('fetchStacDatasetById', () => {
  it('handles wmts with null end date', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        summaries: { datetime: ['2020-01-01T00:00:00Z', null] },
        extent: { temporal: { interval: [['2020-01-01T00:00:00Z', null]] } },
        'dashboard:time_density': 'day'
      }
    });

    const dataset = {
      data: { id: 'd1', type: 'wmts', stacCol: 'col1' }
    } as any;

    const { fetchStacDatasetById } = await import(
      './use-stac-metadata-datasets'
    );
    const result = await fetchStacDatasetById(dataset, 'http://fake');

    expect(result.domain[0]).toBe('2020-01-01T00:00:00Z');
    expect(result.domain[1]).not.toBeNull();
    expect(new Date(result.domain[1] as string).getTime()).toBeLessThanOrEqual(
      Date.now()
    );
  });

  it('handles wms with timeless data', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        extent: {
          temporal: {
            interval: [['2020-01-01T00:00:00Z', '2020-02-01T00:00:00Z']]
          }
        },
        'dashboard:time_density': 'day',
        'dashboard:is_timeless': true
      }
    });

    const dataset = {
      data: { id: 'd2', type: 'wms', stacCol: 'col2' }
    } as any;

    const { fetchStacDatasetById } = await import(
      './use-stac-metadata-datasets'
    );
    const result = await fetchStacDatasetById(dataset, 'http://fake');

    expect(result.domain.length).toBe(2);
    expect(result.domain[0]).not.toBeNull();
    expect(result.domain[1]).not.toBeNull();
  });

  it('handles cmr with null end date', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        summaries: { datetime: ['2020-01-01T00:00:00Z', null] },
        extent: { temporal: { interval: [['2020-01-01T00:00:00Z', null]] } },
        'dashboard:time_density': 'day'
      }
    });

    const dataset = {
      data: { id: 'd3', type: 'cmr', stacCol: 'col3' }
    } as any;

    const { fetchStacDatasetById } = await import(
      './use-stac-metadata-datasets'
    );
    const result = await fetchStacDatasetById(dataset, 'http://fake');

    expect(result.domain[0]).toBe('2020-01-01T00:00:00Z');
    expect(result.domain[1]).not.toBeNull();
    expect(new Date(result.domain[1] as string).getTime()).toBeLessThanOrEqual(
      Date.now()
    );
    expect(result.isPeriodic).toBe(true);
  });

  it('handles vector data', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        links: [{ rel: 'external', href: 'http://fake-features' }],
        'dashboard:time_density': 'day'
      }
    });
    mockedGet.mockResolvedValueOnce({
      data: {
        extent: {
          temporal: {
            interval: [['2020-01-01T00:00:00Z', '2020-02-01T00:00:00Z']]
          }
        }
      }
    });

    const dataset = {
      data: { id: 'd4', type: 'vector', stacCol: 'col4' }
    } as any;

    const { fetchStacDatasetById } = await import(
      './use-stac-metadata-datasets'
    );
    const result = await fetchStacDatasetById(dataset, 'http://fake');

    expect(result.domain[0]).toBe('2020-01-01T00:00:00Z');
    expect(result.domain[1]).toBe('2020-02-01T00:00:00Z');
  });

  it('handles generic type with renders', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        summaries: {
          datetime: ['2020-01-01T00:00:00Z', '2020-02-01T00:00:00Z']
        },
        renders: [{ id: 'r2' }],
        'dashboard:time_density': 'day'
      }
    });

    const dataset = {
      data: { id: 'd5', type: 'other', stacCol: 'col5' }
    } as any;

    const { fetchStacDatasetById } = await import(
      './use-stac-metadata-datasets'
    );
    const result = await fetchStacDatasetById(dataset, 'http://fake');

    expect(result.domain).toEqual([
      '2020-01-01T00:00:00Z',
      '2020-02-01T00:00:00Z'
    ]);
    expect(result.renders).toEqual([{ id: 'r2' }]);
  });

  it('preserves all dates for non-periodic data with summaries.datetime', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        summaries: {
          datetime: [
            '2000-01-01T00:00:00Z',
            '2005-01-01T00:00:00Z',
            '2010-01-01T00:00:00Z',
            '2015-01-01T00:00:00Z',
            '2020-01-01T00:00:00Z'
          ]
        },
        extent: {
          temporal: {
            interval: [['2000-01-01T00:00:00Z', '2020-01-01T00:00:00Z']]
          }
        },
        'dashboard:is_periodic': false,
        'dashboard:time_density': 'year'
      }
    });

    const dataset = {
      data: { id: 'd6', type: 'raster', stacCol: 'col6' }
    } as any;

    const { fetchStacDatasetById } = await import(
      './use-stac-metadata-datasets'
    );
    const result = await fetchStacDatasetById(dataset, 'http://fake');

    // Should preserve all 5 dates, not just the first 2
    expect(result.domain).toEqual([
      '2000-01-01T00:00:00Z',
      '2005-01-01T00:00:00Z',
      '2010-01-01T00:00:00Z',
      '2015-01-01T00:00:00Z',
      '2020-01-01T00:00:00Z'
    ]);
    expect(result.isPeriodic).toBe(false);
  });

  it('preserves all dates for non-periodic wmts with summaries.datetime', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        summaries: {
          datetime: [
            '2000-01-01T00:00:00Z',
            '2005-01-01T00:00:00Z',
            '2010-01-01T00:00:00Z'
          ]
        },
        extent: {
          temporal: {
            interval: [['2000-01-01T00:00:00Z', '2010-01-01T00:00:00Z']]
          }
        },
        'dashboard:is_periodic': false,
        'dashboard:time_density': 'year'
      }
    });

    const dataset = {
      data: { id: 'd7', type: 'wmts', stacCol: 'col7' }
    } as any;

    const { fetchStacDatasetById } = await import(
      './use-stac-metadata-datasets'
    );
    const result = await fetchStacDatasetById(dataset, 'http://fake');

    // Should preserve all 3 dates, not just the first 2
    expect(result.domain).toEqual([
      '2000-01-01T00:00:00Z',
      '2005-01-01T00:00:00Z',
      '2010-01-01T00:00:00Z'
    ]);
    expect(result.isPeriodic).toBe(false);
  });
});
