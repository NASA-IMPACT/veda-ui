import { useEffect, useMemo } from 'react';
import qs from 'qs';
import { RasterSource, RasterLayer } from 'mapbox-gl';

import { useMapStyle } from './styles';

interface RasterPaintLayerProps {
  id: string;
  tileParams?: Record<string, any>;
  tileApiEndpoint?: string;
  zoomExtent?: number[];
  isHidden?: boolean;
  idSuffix?: string;
}

export function RasterPaintLayer(props: RasterPaintLayerProps) {
  const {
    id,
    tileApiEndpoint,
    tileParams,
    zoomExtent,
    isHidden,
    idSuffix = ''
  } = props;

  const { updateStyle } = useMapStyle();

  const [minZoom] = zoomExtent ?? [0, 20];

  const generatorId = 'zarr-timeseries' + idSuffix;

  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(tileParams),
    [tileParams]
  );

  useEffect(
    () => {

    // Customize qs to use comma separated values for arrays
    // e.g. rescale: [[0, 100]] -> rescale=0,100
    // TODO: test this with multiple rescale values, for multiple bands
    const options = {
        arrayFormat: 'comma',
    };

      const tileParamsAsString = qs.stringify(tileParams, options);

      const layerSource: RasterSource = {
        type: 'raster',
        url: `${tileApiEndpoint}?${tileParamsAsString}`
      };

      const layer: RasterLayer = {
        id: id,
        type: 'raster',
        source: id,
        layout: {
          visibility: isHidden ? 'none' : 'visible'
        },
        paint: {
          'raster-opacity': Number(!isHidden),
          'raster-opacity-transition': {
            duration: 320
          }
        },
        minzoom: minZoom,
        metadata: {
          layerOrderPosition: 'raster'
        }
      };

      const sources = {
        [id]: layerSource
      };
      const layers = [layer];

      updateStyle({
        generatorId,
        sources,
        layers
      });
    },
    // sourceParams not included, but using a stringified version of it to detect changes (haveSourceParamsChanged)
    [
      updateStyle,
      id,
      tileParams,
      minZoom,
      haveSourceParamsChanged,
      isHidden,
      generatorId,
      tileApiEndpoint,

    ]
  );

  //
  // Cleanup layers on unmount.
  //
  useEffect(() => {
    return () => {
      updateStyle({
        generatorId,
        sources: {},
        layers: []
      });
    };
  }, [updateStyle, generatorId]);

  return null;
}