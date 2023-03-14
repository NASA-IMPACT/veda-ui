import { useQuery } from '@tanstack/react-query';
import { Layer, Style } from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BasemapId,
  BASEMAP_STYLES,
  DEFAULT_MAP_STYLE_URL,
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

  const { data: styleJson } = useQuery(
    ['basemap', basemapStyleId],
    async ({ signal }) => {
      const mapboxId = basemapStyleId
        ? BASEMAP_STYLES.find((b) => b.id === basemapStyleId)!.mapboxId
        : BASEMAP_STYLES[0].mapboxId;

      try {
        const url = getStyleUrl(mapboxId);
        const styleRaw = await fetch(url, { signal });
        const styleJson = await styleRaw.json();
        return styleJson;
      } catch (e) {
        /* eslint-disable-next-line no-console */
        console.error(e);
      }
    }
  );

  useEffect(() => {
    setBaseStyle(styleJson as Style);
  }, [styleJson]);

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
    // Fallback to style as URL if Mapbox API failed to respond
    style: style ?? DEFAULT_MAP_STYLE_URL,
    basemapStyleId,
    onBasemapStyleIdChange,
    labelsOption,
    boundariesOption,
    onOptionChange
  };
}
