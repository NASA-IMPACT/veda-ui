import { AnyLayer, AnySourceImpl, Style } from 'mapbox-gl';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

export type ExtendedLayer = AnyLayer & {
  metadata?: {
    layerOrderPosition?: LayerOrderPosition;
    [key: string]: any;
  };
};
export interface GeneratorParams {
  generatorId: string;
  layers: ExtendedLayer[];
  sources: Record<string, AnySourceImpl>;
  metadata?: Record<string, unknown>;
}

interface StylesContextType {
  updateStyle: (params: GeneratorParams) => void;
  style?: Style;
  updateMetaData?: (params: unknown) => void;
  metaData?: unknown;
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
  'vector',
  'basemap-foreground',
  'markers'
];

export type ExtendedStyle = ReturnType<typeof generateStyle>;

// Takes in a dictionary associating each generator id with a series of
//  Mapbox layers and sources to be added to the final style. Outputs
//  a style object directly usable by the map instance.
const generateStyle = (stylesData: Record<string, GeneratorParams>) => {
  let sources: Record<string, AnySourceImpl> = {};
  let layers: ExtendedLayer[] = [];

  Object.entries(stylesData).forEach(([generatorId, generatorParams]) => {
    // TODO check duplicate source ids?
    sources = {
      ...sources,
      ...generatorParams.sources
    };

    const layersWithMeta = [
      ...generatorParams.layers.map((layer) => {
        const metadata = layer.metadata ?? {};
        metadata.generatorId = generatorId;
        return { ...layer, metadata };
      })
    ];

    layers = [...layers, ...layersWithMeta];
  });

  // Allow sort as it uses a copy of the array so mutating is ok
  /* eslint-disable-next-line fp/no-mutating-methods */
  layers = [...layers].sort((layerA, layerB) => {
    const layerAOrder = layerA.metadata?.layerOrderPosition;
    const layerBOrder = layerB.metadata?.layerOrderPosition;
    const layerAIndex = LAYER_ORDER.indexOf(layerAOrder);
    const layerBIndex = LAYER_ORDER.indexOf(layerBOrder);
    const sortDeltaOrder = layerAIndex - layerBIndex;
    const sortDeltaGeneratorId = layerA.metadata?.generatorId.localeCompare(
      layerB.metadata?.generatorId
    );
    // If compared layers have different layer orders, sort by layer order, otherwise
    // fallback on generatorId to ensure layer stacks from the same generator stay contiguous
    return sortDeltaOrder !== 0 ? sortDeltaOrder : sortDeltaGeneratorId;
  });

  return {
    version: 8,
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    // This is the spritesheet used in the default satellite basemap (cldu1cb8f00ds01p6gi583w1m)
    sprite:
      'mapbox://sprites/covid-nasa/cldu1cb8f00ds01p6gi583w1m/e3w0e56evrnnyy9tj4v36mbo4',
    layers,
    sources
  };
};

export function Styles({
  onStyleUpdate,
  children
}: {
  onStyleUpdate?: (style: ExtendedStyle) => void;
  children?: ReactNode;
}) {
  const [stylesData, setStylesData] = useState<Record<string, GeneratorParams>>(
    {}
  );

  const [style, setStyle] = useState<Style | undefined>();

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
    onStyleUpdate?.(style);
    setStyle(style as any);
  }, [stylesData, onStyleUpdate]);

  return (
    <StylesContext.Provider value={{ updateStyle, style }}>
      {children}
    </StylesContext.Provider>
  );
}

export const useMapStyle = () => {
  const { updateStyle, style } = useContext(StylesContext);
  return { updateStyle, style };
};
