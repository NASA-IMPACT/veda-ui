import mapboxgl, { Layer } from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BasemapId,
  BASEMAP_STYLES,
  GROUPS_BY_OPTION,
  Option
} from './basemaps';

export function useBasemap(mapInstance: mapboxgl.Map | null) {
  const [styleLoaded, setStyleLoaded] = useState(true);

  // Listen to style reloads to set a state prop, which is then used as an useEffect dependency
  // to retrigger adding raster layers/markers, and to reapply options
  useEffect(() => {
    const onStyleDataLoading = () => {
      setStyleLoaded(false);
    };
    const onStyleData = () => {
      setStyleLoaded(true);
    };
    if (mapInstance) {
      mapInstance.on('styledataloading', onStyleDataLoading);
      mapInstance.on('styledata', onStyleData);
    }

    return () => {
      if (mapInstance) {
        mapInstance.off('styledataloading', onStyleDataLoading);
        mapInstance.off('styledata', onStyleData);
      }
    };
  }, [mapInstance]);

  const [currentBasemapStyleId, setCurrentBasemapStyleId] =
    useState<BasemapId>('satellite');

  const onBasemapStyleIdChange = useCallback((basemapId) => {
    setCurrentBasemapStyleId(basemapId);
  }, []);

  const styleUrl = useMemo(() => {
    return currentBasemapStyleId
      ? BASEMAP_STYLES.find((b) => b.id === currentBasemapStyleId)!.url
      : BASEMAP_STYLES[0].url;
  }, [currentBasemapStyleId]);

  useEffect(() => {
    if (!mapInstance || !styleUrl) return;

    // Any BaseLayerComponent (ie raster-timeseries or others) must listen to styledata/styledataloading events
    // on the mgl instance to re-add layers
    mapInstance.setStyle(styleUrl);
  }, [mapInstance, styleUrl]);

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
  useEffect(() => {
    if (!mapInstance || !styleLoaded) return;
    try {
      const style = mapInstance.getStyle();
      style.layers.forEach((layer) => {
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

          if ((isLabelsLayer || isBoundariesLayer) && (layer as Layer).layout?.visibility !== visibility) {
            mapInstance.setLayoutProperty(layer.id, 'visibility', visibility);
          }
        }
      });
    } catch (e) {
      // Mapbox GL is throwing an error at initial map mount when calling getStyle
      // Not a proble for now but we should keep an eye on this
    }
  }, [labelsOption, boundariesOption, styleLoaded, mapInstance]);

  return {
    styleLoaded,
    currentBasemapStyleId,
    onBasemapStyleIdChange,
    labelsOption,
    boundariesOption,
    onOptionChange
  };
}
