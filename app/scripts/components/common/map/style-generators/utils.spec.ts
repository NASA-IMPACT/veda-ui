import { formatTitilerParameter } from './utils';

describe('formatTitilerParameter', () => {
  it('formats basic parameters correctly', () => {
    const params = {
      tile_format: 'png',
      tile_scale: 2,
      minzoom: 0,
      maxzoom: 12
    };

    const result = formatTitilerParameter(params);

    expect(result).toBe('tile_format=png&tile_scale=2&minzoom=0&maxzoom=12');
  });

  it('formats array parameters correctly', () => {
    const params = {
      assets: ['visual', 'cog'],
      bidx: [1, 2, 3]
    };

    const result = formatTitilerParameter(params);

    expect(result).toBe('assets=visual&assets=cog&bidx=1&bidx=2&bidx=3');
  });

  it('does not encode bbox parameter', () => {
    const params = {
      bbox: '{bbox-epsg-3857}'
    };

    const result = formatTitilerParameter(params);

    expect(result).toBe('bbox={bbox-epsg-3857}');
  });

  it('combines all parameter types correctly', () => {
    const params = {
      tile_format: 'png',
      assets: ['visual', 'cog'],
      bidx: [1, 2, 3],
      bbox: '{bbox-epsg-3857}',
      rescale: '0,1',
      colormap_name: 'viridis'
    };

    const result = formatTitilerParameter(params);

    const decodedResult = decodeURIComponent(result);

    // The exact order might vary depending on implementation details
    expect(decodedResult).toContain('tile_format=png');
    expect(decodedResult).toContain('rescale=0,1');
    expect(decodedResult).toContain('colormap_name=viridis');
    expect(decodedResult).toContain('assets=visual&assets=cog');
    expect(decodedResult).toContain('bidx=1&bidx=2&bidx=3');
    expect(decodedResult).toContain('bbox={bbox-epsg-3857}');
  });

  it('handles undefined and empty arrays correctly', () => {
    const params = {
      tile_format: 'png',
      assets: [],
      bidx: undefined,
      asset_bidx: undefined
    };

    const result = formatTitilerParameter(params);

    expect(result).toBe('tile_format=png');
  });

  it('handles asset_bidx parameter (repeat) correctly', () => {
    const params = {
      asset_bidx: ['data|1,2,3', 'visual|1']
    };

    const result = formatTitilerParameter(params);

    const decodedResult = decodeURIComponent(result);

    expect(decodedResult).toContain('asset_bidx=data|1,2,3');
    expect(decodedResult).toContain('asset_bidx=visual|1');
  });

  it('handles boolean parameters correctly', () => {
    const params = {
      return_mask: true,
      unscale: false
    };

    const result = formatTitilerParameter(params);

    expect(result).toBe('return_mask=true&unscale=false');
  });
});
