import {
  resolveRenderParams,
  formatRenderExtensionData
} from './data-utils-no-faux-module';
import { RENDER_KEY } from './constants';

const renderExtensionData = {
  dashboard: {
    bidx: [1],
    title: 'VEDA Dashboard Render Parameters',
    assets: ['cog_default'],
    resampling: 'bilinear',
    colormap_name: 'viridis'
  }
};

const renderExtensionDataWithAsset = {
  dashboard: {
    bidx: [1],
    title: 'VEDA Dashboard Render Parameters',
    assets: ['soil_texture_0cm_250m'],
    nodata: 255,
    resampling: 'nearest',
    return_mask: true,
    colormap_name: 'soil_texture'
  }
};

const renderExtensionDataWithColormap = {
  dashboard: {
    title: 'VEDA Dashboard Render Parameters',
    assets: ['cog_default'],
    rescale: [[0, 0.0001]],
    colormap: {
      '0': [22, 158, 242, 255]
    }
  }
};

const userDefinedSourceParameters = {
  resampling: 'bilinear',
  bidx: 1,
  colormap_name: 'viridis',
  rescale: [0, 0.0001]
};

const userDefinedSourceParametersWithAsset = {
  assets: 'soil_texture_5cm_250m',
  colormap_name: 'soil_texture',
  nodata: 255
};

describe('Resolve Render Params', () => {
  it('give precedence to render parameter data', () => {
    const sourceParameter = resolveRenderParams(
      userDefinedSourceParameters,
      renderExtensionData
    );
    expect(sourceParameter).toMatchObject(renderExtensionData[RENDER_KEY]);
  });

  it('falls back to user defined source parameters when render extension does not have asset namespace', () => {
    const sourceParameter = resolveRenderParams(
      userDefinedSourceParametersWithAsset,
      renderExtensionDataWithAsset
    );
    expect(sourceParameter).toMatchObject(userDefinedSourceParametersWithAsset);
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
