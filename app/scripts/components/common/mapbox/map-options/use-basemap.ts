import { Layer, Style } from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BasemapId,
  BASEMAP_STYLES,
  getStyleUrl,
  GROUPS_BY_OPTION,
  Option
} from './basemaps';

export function useBasemap() {
  const [basemapStyleId, setBasemapStyleId] = useState<BasemapId>('satellite');

  const onBasemapStyleIdChange = useCallback((basemapId) => {
    setBasemapStyleId(basemapId);
  }, []);

  const [baseStyle, setBaseStyle] = useState<Style | undefined>(undefined);

  useEffect(() => {
    const mapboxId = basemapStyleId
      ? BASEMAP_STYLES.find((b) => b.id === basemapStyleId)!.mapboxId
      : BASEMAP_STYLES[0].mapboxId;

    const url = getStyleUrl(mapboxId);
    const controller = new AbortController();

    const load = async () => {
      const styleRaw = await fetch(url, { signal: controller.signal });
      const styleJson = await styleRaw.json();
      setBaseStyle(styleJson as Style);
    };
    load();
    return () => {
      controller.abort();
    };
  }, [basemapStyleId]);

  const [labelsOption, setLabelsOption] = useState(true);
  const [boundariesOption, setBoundariesOption] = useState(true);
  const onOptionChange = useCallback(
    (option: Option, value: boolean) => {
      if (option === 'labels') {
        setLabelsOption(value);
      } else {
        setBoundariesOption(value);
      }
    },
    [setLabelsOption, setBoundariesOption]
  );

  // Apply labels and boundaries options, by setting visibility on related layers
  // For simplicity's sake, the Mapbox layer group (as set in Mapbox Studio) is used
  // to determine wehether a layer is a labels layer or boundaries or none of those.
  const style = useMemo(() => {
    if (!baseStyle) return;

    const style = { ...baseStyle };

    style.layers = style.layers.map((layer) => {
      const layerGroup = (layer as Layer).metadata?.['mapbox:group'];

      if (layerGroup) {
        const isLabelsLayer = GROUPS_BY_OPTION.labels.includes(layerGroup);
        const isBoundariesLayer =
          GROUPS_BY_OPTION.boundaries.includes(layerGroup);

        const visibility =
          (isLabelsLayer && labelsOption) ||
          (isBoundariesLayer && boundariesOption)
            ? 'visible'
            : 'none';

        if (isLabelsLayer || isBoundariesLayer) {
          return {
            ...layer,
            layout: {
              ...(layer as Layer).layout,
              visibility
            }
          };
        }

        return { ...layer };
      }
      return { ...layer };
    });

    return style;
  }, [labelsOption, boundariesOption, baseStyle]);

  return {
    style,
    basemapStyleId,
    onBasemapStyleIdChange,
    labelsOption,
    boundariesOption,
    onOptionChange
  };
}
