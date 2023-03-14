import { AnyLayer, AnySourceImpl, Style } from 'mapbox-gl';
import React, { createContext, useCallback, useEffect, useState } from 'react';

interface LayerWrapper {
  layer: AnyLayer;
  layerOrderPosition?: LayerOrderPosition;
}

interface SourceWrapper {
  id: string;
  source: AnySourceImpl;
}

interface GeneratorParams {
  generatorId: string;
  layers: LayerWrapper[];
  sources: SourceWrapper[];
  sprite?: string;
  metadata?: Record<string, unknown>;
}

interface StylesContextType {
  updateStyle: (params: GeneratorParams) => void;
}

export const StylesContext = createContext<StylesContextType>({
  updateStyle: (params: GeneratorParams) => {
    return params;
  }
});

export type LayerOrderPosition =
  | 'basemap-background'
  | 'raster'
  | 'markers'
  | 'vector'
  | 'basemap-foreground';

const LAYER_ORDER: LayerOrderPosition[] = [
  'basemap-background',
  'raster',
  'markers',
  'vector',
  'basemap-foreground'
];

// Takes in a dictionary associating each generator id with a series of
//  Mapbox layers and sources to be added to the final style. Outputs
//  a style object directly usable by the map instance.
const generateStyle = (stylesData: Record<string, GeneratorParams>) => {
  let sources: Record<string, AnySourceImpl> = {};
  let layers: AnyLayer[] = [];

  Object.entries(stylesData).map(([generatorId, generatorParams]) => {
    const newSources = Object.fromEntries(
      generatorParams.sources.map((sourceWrapper) => [
        sourceWrapper.id,
        sourceWrapper.source
      ])
    );
    sources = {
      ...sources,
      ...newSources
    };

    // TODO sort layers - first by LAYER_ORDER, then by generatorId
    const newLayers = generatorParams.layers.map(
      (layerWrapper) => layerWrapper.layer
    );
    layers = [...layers, ...newLayers];
  });

  return {
    version: 8,
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    layers,
    sources
  };
};

export function Styles({
  onStyleUpdate,
  children
}: {
  onStyleUpdate?: (style: Style) => void;
  children?: React.ReactNode;
}) {
  const [stylesData, setStylesData] = useState<Record<string, GeneratorParams>>(
    {}
  );
  const updateStyle = useCallback(
    (params: GeneratorParams) => {
      setStylesData((prevStyle) => ({
        ...prevStyle,
        [params.generatorId]: params
      }));
    },
    [setStylesData]
  );
  useEffect(() => {
    const style = generateStyle(stylesData);
    onStyleUpdate?.(style as any);
  }, [stylesData, onStyleUpdate]);
  return (
    <StylesContext.Provider value={{ updateStyle }}>
      {children}
    </StylesContext.Provider>
  );
}
