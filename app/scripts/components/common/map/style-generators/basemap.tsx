import { useQuery } from '@tanstack/react-query';
import { StyleSpecification } from 'mapbox-gl';
import { useEffect, useMemo, useState } from 'react';
import {
  BasemapId,
  getStyleUrl,
  GROUPS_BY_OPTION,
  getBasemapStyles
} from '../controls/map-options/basemap';
import { ExtendedLayer } from '../types';
import useMapStyle from '../hooks/use-map-style';
import { useVedaUI } from '$context/veda-ui-provider';

interface BasemapProps {
  basemapStyleId?: BasemapId;
  labelsOption?: boolean;
  boundariesOption?: boolean;
}

function mapGroupNameToGroupId(
  groupNames: string[],
  mapboxGroups: Record<string, { name: string }>
) {
  const groupsAsArray = Object.entries(mapboxGroups);

  return groupNames.map((groupName) => {
    return groupsAsArray.find(([, group]) => group.name === groupName)?.[0];
  });
}

export function Basemap({
  basemapStyleId = 'satellite',
  labelsOption = true,
  boundariesOption = true
}: BasemapProps) {
  const { envMapboxToken } = useVedaUI();
  const { updateStyle } = useMapStyle();
  const [baseStyle, setBaseStyle] = useState<StyleSpecification | undefined>(
    undefined
  );

  const basemapStyles = useMemo(
    () => getBasemapStyles(envMapboxToken),
    [envMapboxToken]
  );

  const { data: styleJson } = useQuery(
    ['basemap', basemapStyleId],
    async ({ signal }) => {
      const mapboxId = basemapStyleId
        ? basemapStyles.find((b) => b.id === basemapStyleId)!.mapboxId
        : basemapStyles[0].mapboxId;

      try {
        const url = getStyleUrl(mapboxId, envMapboxToken);
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
    setBaseStyle(styleJson as StyleSpecification);
  }, [styleJson]);

  // Apply labels and boundaries options, by setting visibility on related
  // layers For simplicity's sake, the Mapbox layer group (as set in Mapbox
  // Studio) is used to determine whether a layer is a labels layer or
  // boundaries or none of those.
  useEffect(() => {
    if (!baseStyle) return;

    // Mapbox creates a groupId that can't be changed, so we need to get
    // this id from the list of groups in the metadata section of the style.
    const labelsGroupIds = mapGroupNameToGroupId(
      GROUPS_BY_OPTION.labels,
      (baseStyle.metadata as Record<string, any>)['mapbox:groups']
    );
    const boundariesGroupIds = mapGroupNameToGroupId(
      GROUPS_BY_OPTION.boundaries,
      (baseStyle.metadata as Record<string, any>)['mapbox:groups']
    );

    const layers = baseStyle.layers.map((layer) => {
      const layerGroup = layer.metadata?.['mapbox:group'];

      if (layerGroup) {
        const isLabelsLayer = labelsGroupIds.includes(layerGroup);
        const isBoundariesLayer = boundariesGroupIds.includes(layerGroup);

        const visibility =
          (isLabelsLayer && labelsOption) ||
          (isBoundariesLayer && boundariesOption)
            ? 'visible'
            : 'none';

        if (isLabelsLayer || isBoundariesLayer) {
          return {
            ...layer,
            layout: {
              ...layer.layout,
              visibility
            },
            metadata: {
              layerOrderPosition: 'basemap-foreground'
            }
          };
        }
        return { ...layer };
      }
      return { ...layer };
    });

    updateStyle({
      generatorId: 'basemap',
      sources: baseStyle.sources,
      layers: layers as ExtendedLayer[]
    });
  }, [updateStyle, labelsOption, boundariesOption, baseStyle]);

  return null;
}
