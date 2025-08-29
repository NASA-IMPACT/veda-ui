import axios from 'axios';
import { DatasetStatus } from '../types.d.ts';
import {
  didDataChange,
  reconcileQueryDataWithDataset,
  normalizeDomain
} from './use-stac-metadata-datasets';

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
  it('replaces null with now', () => {
    const result = normalizeDomain(['2020-01-01T00:00:00Z', null]);
    expect(result[0]).toBe('2020-01-01T00:00:00Z');
    expect(new Date(result[1]).getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('returns [] if domain is undefined', () => {
    expect(normalizeDomain(undefined)).toEqual([]);
  });
});

describe('didDataChange', () => {
  it('returns false if keys are the same', () => {
    const q = { errorUpdatedAt: 1, dataUpdatedAt: 2, failureCount: 0 } as any;
    expect(didDataChange(q, q)).toBe(false);
  });

  it('returns true if keys differ', () => {
    const curr = {
      errorUpdatedAt: 1,
      dataUpdatedAt: 2,
      failureCount: 0
    } as any;
    const prev = {
      errorUpdatedAt: 1,
      dataUpdatedAt: 5,
      failureCount: 0
    } as any;
    expect(didDataChange(curr, prev)).toBe(true);
  });
});

describe('reconcileQueryDataWithDataset', () => {
  const dataset = {
    data: { id: 'foo', type: 'raster', sourceParams: {} }
  } as any;

  it('returns dataset with error on failure', () => {
    const query = { status: 'error', error: new Error('fail') } as any;
    const res = reconcileQueryDataWithDataset(query, dataset);
    expect(res.status).toBe('error');
    expect(res.error).toBeTruthy();
  });

  it('merges SUCCESS data with renders', () => {
    const query = {
      status: DatasetStatus.SUCCESS,
      data: { renders: [{ id: 'r1' }] }
    } as any;
    const res = reconcileQueryDataWithDataset(query, dataset);
    expect((res.data as any).renders).toEqual([{ id: 'r1' }]);
    expect(res.status).toBe(DatasetStatus.SUCCESS);
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
    expect(new Date(result.domain[1]).getTime()).toBeLessThanOrEqual(
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
    expect(new Date(result.domain[1]).getTime()).toBeLessThanOrEqual(
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
});
