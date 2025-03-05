import {
  resolveRenderParams,
  formatRenderExtensionData,
  SourceParametersWithLayerId
} from './data-utils-no-faux-module';
import { RENDER_KEY } from './constants';

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
