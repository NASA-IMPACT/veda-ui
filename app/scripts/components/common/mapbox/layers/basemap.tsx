import { useQuery } from '@tanstack/react-query';
import { AnySourceImpl, Layer, Style } from 'mapbox-gl';
import { useContext, useEffect, useState } from 'react';
import {
  BasemapId,
  BASEMAP_STYLES,
  getStyleUrl,
  GROUPS_BY_OPTION
} from '../map-options/basemaps';
import { ExtendedLayer, StylesContext } from './styles';

interface BasemapProps {
  basemapStyleId: BasemapId;
  labelsOption: boolean;
  boundariesOption: boolean;
}

export function Basemap(props: BasemapProps) {
  const { basemapStyleId, labelsOption, boundariesOption } = props;
  const { updateStyle } = useContext(StylesContext);

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

  // Apply labels and boundaries options, by setting visibility on related layers
  // For simplicity's sake, the Mapbox layer group (as set in Mapbox Studio) is used
  // to determine wehether a layer is a labels layer or boundaries or none of those.
  useEffect(() => {
    if (!baseStyle) return;

    const layers = baseStyle.layers.map((layer) => {
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

        // TODO set up layerOrderPosition in metadata
        return { ...layer };
      }
      // TODO set up layerOrderPosition in metadata
      return { ...layer };
    });

    updateStyle({
      generatorId: 'basemap',
      sources: baseStyle.sources as Record<string, AnySourceImpl>,
      layers: layers as ExtendedLayer[]
    });
  }, [updateStyle, labelsOption, boundariesOption, baseStyle]);

  return null;
}
